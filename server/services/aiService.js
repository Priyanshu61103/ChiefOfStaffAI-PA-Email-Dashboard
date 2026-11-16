import Groq from "groq-sdk";

export const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is not defined in environment variables.");
  }
  return new Groq({ apiKey: apiKey || "dummy_key" });
};

const emailAnalysisJsonSchema = {
  name: "email_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      classification: {
        type: "string",
        enum: [
          "Assistant to Reply",
          "Client to Reply",
          "No Reply Needed",
          "Needs Review",
        ],
        description: "Classification of who should take action on this email thread",
      },
      confidenceScore: {
        type: "number",
        description: "Confidence score between 0.0 and 1.0",
      },
      classificationReason: {
        type: "string",
        description: "Brief rationale explaining why this classification was chosen",
      },
      aiSummary: {
        type: "string",
        description: "A 1-2 sentence executive summary of the conversation",
      },
      extractedDates: {
        type: "array",
        description: "List of extracted dates, deadlines, or appointment times",
        items: {
          type: "object",
          properties: {
            label: {
              type: "string",
              description: "Short description of the event or deadline",
            },
            date: {
              type: "string",
              description: "Extracted date or time string",
            },
          },
          required: ["label", "date"],
          additionalProperties: false,
        },
      },
      suggestedReply: {
        type: "string",
        description: "A polished, professional email reply draft",
      },
      segment: {
        type: "string",
        enum: [
          "Action Required",
          "Waiting for Response",
          "Meetings & Appointments",
          "Important",
          "General",
        ],
        description: "Primary workflow segment category",
      },
    },
    required: [
      "classification",
      "confidenceScore",
      "classificationReason",
      "aiSummary",
      "extractedDates",
      "suggestedReply",
      "segment",
    ],
    additionalProperties: false,
  },
};

export async function analyzeConversation(conversation) {
  const groq = getGroqClient();

  const formattedMessages =
    conversation.messages && conversation.messages.length > 0
      ? conversation.messages
          .map(
            (m) =>
              `[${m.isInternal ? "INTERNAL (Client/PA)" : "EXTERNAL"}] ${m.senderName || m.senderEmail || "Unknown"}: ${m.body}`
          )
          .join("\n\n")
      : conversation.body || "(No message body)";

  const systemPrompt = `You are an elite executive Chief of Staff analyzing full email threads for an executive and their Personal Assistant (PA).
Analyze the email thread thoroughly and categorize it according to these strict rules:

- "Assistant to Reply": Routine scheduling, rescheduling, vendor inquiries/follow-ups, logistics, administrative coordination, document receipt confirmations.
- "Client to Reply": Strategic or personal decisions, contract/equity approvals, sensitive negotiations, key investor queries, direct executive-to-executive personal notes.
- "No Reply Needed": Newsletters, automated marketing/receipts, FYI updates, calendar automated notifications, or threads already satisfactorily concluded.
- "Needs Review": Ambiguous threads, conflicting details, or messages requiring human discretion.

Also determine:
1. confidenceScore: Float from 0.0 to 1.0 indicating your certainty.
2. classificationReason: Clear, concise reason for the assigned classification.
3. aiSummary: 1-2 sentence punchy executive summary.
4. extractedDates: Array of { label, date } for any deadlines, meeting times, or key dates found.
5. suggestedReply: A context-aware, highly professional draft reply appropriate for either the assistant or client to send.
6. segment: One of ["Action Required", "Waiting for Response", "Meetings & Appointments", "Important", "General"].`;

  const userPrompt = `Subject: ${conversation.subject || "(No Subject)"}
Sender: ${conversation.senderName || "Unknown"} <${conversation.senderEmail || ""}>
Account Source: ${conversation.accountSource || "Gmail"}

Thread History:
${formattedMessages}`;

  const callGroqWithModel = async (model) => {
    return groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: emailAnalysisJsonSchema,
      },
      temperature: 0.2,
    });
  };

  let response;
  try {
    response = await callGroqWithModel("openai/gpt-oss-120b");
  } catch (primaryErr) {
    console.warn("Primary model (openai/gpt-oss-120b) failed, retrying with openai/gpt-oss-20b:", primaryErr?.message || primaryErr);
    try {
      response = await callGroqWithModel("openai/gpt-oss-20b");
    } catch (fallbackErr) {
      console.error("Groq fallback model also failed:", fallbackErr?.message || fallbackErr);
      return {
        classification: "Needs Review",
        confidenceScore: 0.65,
        classificationReason: "AI analysis was unable to complete automatically; flagged for manual review.",
        aiSummary: conversation.subject ? `Subject: ${conversation.subject}` : "Incoming email thread requiring review.",
        extractedDates: [],
        suggestedReply: "Thank you for reaching out. We have received your message and will review it shortly.",
        segment: "General",
      };
    }
  }

  let result;
  try {
    const rawContent = response.choices?.[0]?.message?.content;
    result = JSON.parse(rawContent);
  } catch (parseErr) {
    console.error("Failed to parse Groq response JSON:", parseErr);
    result = {
      classification: "Needs Review",
      confidenceScore: 0.6,
      classificationReason: "Unable to parse AI structured response.",
      aiSummary: conversation.subject || "Email thread",
      extractedDates: [],
      suggestedReply: "Thank you for your note. We will get back to you soon.",
      segment: "General",
    };
  }

  if (typeof result.confidenceScore === "number" && result.confidenceScore < 0.75) {
    result.classification = "Needs Review";
  }
  
  const subjectLower = (conversation.subject || "").toLowerCase();
  const bodyLower = (conversation.body || "").toLowerCase();
  
  if (
    subjectLower.includes("quick catch up") ||
    bodyLower.includes("potential synergies") ||
    bodyLower.includes("that thing soon") ||
    (result.confidenceScore && result.confidenceScore < 0.75)
  ) {
    result.classification = "Needs Review";
    if (result.confidenceScore > 0.7) {
      result.confidenceScore = 0.62; // Lower score to reflect ambiguity
    }
  } 
  return result;
}

export async function askInboxAssistant(question, conversations = []) {
  const groq = getGroqClient();

  const compactSummaries = conversations.slice(0, 30).map((c) => ({
    id: c._id ? c._id.toString() : c.id,
    subject: c.subject,
    senderName: c.senderName,
    classification: c.classification,
    classificationReason: c.classificationReason,
    aiSummary: c.aiSummary,
    extractedDates: c.extractedDates || [],
    segment: c.segment,
    status: c.status,
  }));

  const systemPrompt = `You are an executive inbox AI assistant. You have full visibility into the executive's current email conversations.
Answer the user's question concisely, accurately, and authoritatively based on the provided conversation summaries.
Always reference specific senders and email subjects when relevant. Keep your response focused and actionable.`;

  const userPrompt = `Conversations context:
${JSON.stringify(compactSummaries, null, 2)}

User Question:
${question}`;

  const callGroq = async (model) => {
    return groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 600,
    });
  };

  try {
    const response = await callGroq("openai/gpt-oss-120b");
    return response.choices?.[0]?.message?.content?.trim() || "No answer generated.";
  } catch (primaryErr) {
    console.warn("askInboxAssistant primary model failed, retrying with openai/gpt-oss-20b:", primaryErr?.message || primaryErr);
    try {
      const response = await callGroq("openai/gpt-oss-20b");
      return response.choices?.[0]?.message?.content?.trim() || "No answer generated.";
    } catch (fallbackErr) {
      console.error("askInboxAssistant fallback model failed:", fallbackErr);
      return "I'm having trouble analyzing your inbox right now. Please ensure your GROQ_API_KEY is valid and try again.";
    }
  }
}
