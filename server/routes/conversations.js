import express from "express";
import Conversation from "../models/Conversation.js";
import { analyzeConversation, askInboxAssistant } from "../services/aiService.js";

const router = express.Router();

// GET /api/conversations
router.get("/", async (req, res) => {
  try {
    const { classification, segment, status, accountSource, search } = req.query;
    const filter = {};

    if (classification) {
      filter.classification = classification;
    }
    if (segment) {
      filter.segment = segment;
    }
    if (status) {
      filter.status = status;
    }
    if (accountSource) {
      filter.accountSource = accountSource;
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { subject: searchRegex },
        { senderName: searchRegex },
        { senderEmail: searchRegex },
        { aiSummary: searchRegex },
        { "messages.body": searchRegex },
      ];
    }

    const conversations = await Conversation.find(filter).sort({
      updatedAt: -1,
      createdAt: -1,
    });
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// GET /api/conversations/stats
router.get("/stats", async (req, res) => {
  try {
    const activeFilter = { status: { $nin: ["Completed", "Archived"] } };

    const [
      total,
      unread,
      important,
      assistantToReply,
      clientToReply,
      needsReview,
      waitingForResponse,
      upcomingMeetings,
    ] = await Promise.all([
      Conversation.countDocuments(activeFilter),
      Conversation.countDocuments({ ...activeFilter, isUnread: true }),
      Conversation.countDocuments({ ...activeFilter, isImportant: true }),
      Conversation.countDocuments({ ...activeFilter, classification: "Assistant to Reply" }),
      Conversation.countDocuments({ ...activeFilter, classification: "Client to Reply" }),
      Conversation.countDocuments({ ...activeFilter, classification: "Needs Review" }),
      Conversation.countDocuments({ ...activeFilter, segment: "Waiting for Response" }),
      Conversation.countDocuments({
        ...activeFilter,
        $or: [
          { segment: "Meetings & Appointments" },
          { extractedDates: { $exists: true, $not: { $size: 0 } } },
        ],
      }),
    ]);

    res.json({
      total,
      unread,
      important,
      assistantToReply,
      clientToReply,
      needsReview,
      waitingForResponse,
      upcomingMeetings,
    });
  } catch (error) {
    console.error("Error calculating stats:", error);
    res.status(500).json({ error: "Failed to calculate stats" });
  }
});

// POST /api/conversations/ask
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required" });
    }

    const openConversations = await Conversation.find({ status: "Open" })
      .sort({ updatedAt: -1 })
      .limit(30);

    const conversations =
      openConversations.length > 0
        ? openConversations
        : await Conversation.find().sort({ updatedAt: -1 }).limit(30);

    const answer = await askInboxAssistant(question, conversations);
    res.json({ answer });
  } catch (error) {
    console.error("Error in askInboxAssistant endpoint:", error);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

// POST /api/conversations/incoming
router.post("/incoming", async (req, res) => {
  try {
    const { conversationId, senderName, senderEmail, subject, body, accountSource } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      conversation.messages.push({
        senderName: senderName || conversation.senderName,
        senderEmail: senderEmail || conversation.senderEmail,
        body: body || "",
        timestamp: new Date(),
        isInternal: false,
      });
      conversation.isUnread = true;
      conversation.status = "Open";
      conversation.activityLog.push({
        action: `New message received from ${senderName || senderEmail || "sender"}`,
        actor: senderName || "External Sender",
        timestamp: new Date(),
      });
    } else {
      if (!subject || !body) {
        return res.status(400).json({ error: "subject and body are required for new email" });
      }

      conversation = new Conversation({
        subject,
        accountSource: accountSource === "Outlook" ? "Outlook" : "Gmail",
        senderName: senderName || "",
        senderEmail: senderEmail || "",
        isUnread: true,
        status: "Open",
        messages: [
          {
            senderName: senderName || "",
            senderEmail: senderEmail || "",
            body: body,
            timestamp: new Date(),
            isInternal: false,
          },
        ],
        activityLog: [
          {
            action: "Email thread received",
            actor: senderName || "External Sender",
            timestamp: new Date(),
          },
        ],
      });
    }

    // Call Groq live analysis
    const analysis = await analyzeConversation(conversation);

    conversation.classification = analysis.classification;
    conversation.confidenceScore = analysis.confidenceScore;
    conversation.classificationReason = analysis.classificationReason;
    conversation.aiSummary = analysis.aiSummary;
    conversation.extractedDates = analysis.extractedDates || [];
    conversation.suggestedReply = analysis.suggestedReply || "";
    conversation.segment = analysis.segment;

    conversation.activityLog.push({
      action: `AI analysis completed (${conversation.classification})`,
      actor: "AI Chief of Staff",
      timestamp: new Date(),
    });

    const saved = await conversation.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error processing incoming email:", error);
    res.status(500).json({ error: "Failed to process incoming email" });
  }
});

// POST /api/conversations/:id/regenerate-draft
router.post("/:id/regenerate-draft", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const analysis = await analyzeConversation(conversation);
    conversation.suggestedReply = analysis.suggestedReply || conversation.suggestedReply;
    if (analysis.aiSummary) {
      conversation.aiSummary = analysis.aiSummary;
    }

    conversation.activityLog.push({
      action: "Regenerated reply draft",
      actor: "AI Chief of Staff",
      timestamp: new Date(),
    });

    const saved = await conversation.save();
    res.json(saved);
  } catch (error) {
    console.error("Error regenerating draft:", error);
    res.status(500).json({ error: "Failed to regenerate reply draft" });
  }
});

// GET /api/conversations/:id
router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// PATCH /api/conversations/:id
router.patch("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const {
      classification,
      segment,
      status,
      isImportant,
      isUnread,
      replyBody,
      actor,
    } = req.body;

    const currentActor = actor || "User";

    // Handle sending a reply
    if (replyBody) {
      conversation.messages.push({
        senderName: currentActor,
        senderEmail: "exec-office@apexholdings.com",
        body: replyBody,
        timestamp: new Date(),
        isInternal: true,
      });
      conversation.status = "Completed";
      conversation.activityLog.push({
        action: "Sent reply and marked completed",
        actor: currentActor,
        timestamp: new Date(),
      });
    }

    // Handle updates to fields
    if (classification && classification !== conversation.classification) {
      conversation.activityLog.push({
        action: `Classification updated to ${classification}`,
        actor: currentActor,
        timestamp: new Date(),
      });
      conversation.classification = classification;
    }

    if (segment && segment !== conversation.segment) {
      conversation.activityLog.push({
        action: `Segment moved to ${segment}`,
        actor: currentActor,
        timestamp: new Date(),
      });
      conversation.segment = segment;
    }

    if (status && status !== conversation.status && !replyBody) {
      conversation.activityLog.push({
        action: `Status changed to ${status}`,
        actor: currentActor,
        timestamp: new Date(),
      });
      conversation.status = status;
    }

    if (typeof isImportant === "boolean") {
      conversation.isImportant = isImportant;
    }

    if (typeof isUnread === "boolean") {
      conversation.isUnread = isUnread;
    }

    const updated = await conversation.save();
    res.json(updated);
  } catch (error) {
    console.error("Error updating conversation:", error);
    res.status(500).json({ error: "Failed to update conversation" });
  }
});

export default router;
