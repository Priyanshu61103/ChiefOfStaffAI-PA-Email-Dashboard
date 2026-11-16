export const seedConversations = [
  // 1. Assistant to Reply - Meetings & Appointments - Outlook
  {
    subject: "Rescheduling Q4 Board Prep Alignment",
    accountSource: "Outlook",
    senderName: "Evelyn Reed",
    senderEmail: "ereed@summitcap.com",
    classification: "Assistant to Reply",
    confidenceScore: 0.94,
    classificationReason: "Routine scheduling adjustment and calendar coordination suitable for executive assistant action.",
    aiSummary: "Evelyn requests pushing the Q4 Board Prep meeting from Wednesday to Thursday afternoon due to a portfolio conflict.",
    extractedDates: [
      { label: "Proposed Meeting Date", date: "Thursday, Nov 20, 2026 at 3:00 PM EST" },
      { label: "Original Date", date: "Wednesday, Nov 19, 2026 at 11:00 AM EST" }
    ],
    suggestedReply: "Hi Evelyn,\n\nThursday, November 20th at 3:00 PM EST works well on our end. I have shifted the calendar invite and sent an updated Zoom link.\n\nBest,\nExecutive Office",
    segment: "Meetings & Appointments",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Evelyn Reed",
        senderEmail: "ereed@summitcap.com",
        body: "Hi team, I noticed we have our Board Prep sync locked for Wednesday at 11am, but our audit committee session is running over. Could we move this to Thursday at 3:00 PM EST instead?",
        timestamp: new Date("2026-11-16T09:15:00Z"),
        isInternal: false,
      },
      {
        senderName: "Executive Office",
        senderEmail: "exec-team@apexholdings.com",
        body: "Thanks for flagging Evelyn, checking our calendar availability now.",
        timestamp: new Date("2026-11-16T09:45:00Z"),
        isInternal: true,
      },
      {
        senderName: "Evelyn Reed",
        senderEmail: "ereed@summitcap.com",
        body: "Appreciate it! Let me know as soon as you confirm so I can release the holding block.",
        timestamp: new Date("2026-11-16T10:05:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Thread imported via Outlook sync", actor: "System", timestamp: new Date("2026-11-16T09:15:00Z") },
      { action: "Classified as Assistant to Reply", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T10:06:00Z") }
    ]
  },

  // 2. Client to Reply - Important - Gmail
  {
    subject: "Series B Term Sheet & Valuation Guidance",
    accountSource: "Gmail",
    senderName: "Marcus Vance",
    senderEmail: "mvance@vancepartners.vc",
    classification: "Client to Reply",
    confidenceScore: 0.98,
    classificationReason: "High-stakes strategic capital raise discussion and term sheet terms requiring direct founder/CEO decision.",
    aiSummary: "Marcus from Vance Partners shared the preliminary Series B term sheet and requested a direct 1-on-1 call with the CEO regarding valuation caps and board seat allocations.",
    extractedDates: [
      { label: "Discussion Window", date: "Tuesday, Nov 18, 2026" },
      { label: "Term Sheet Expiration", date: "Friday, Nov 21, 2026 at 5:00 PM PST" }
    ],
    suggestedReply: "Marcus, thank you for sending over the revised terms. I've reviewed Section 4 regarding governance and liquidation preferences. Let's speak directly Tuesday afternoon—I'll share my marked-up draft prior to the call.",
    segment: "Important",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Marcus Vance",
        senderEmail: "mvance@vancepartners.vc",
        body: "We concluded our investment committee review and are excited about your growth trajectory. Attached is our term sheet for the $24M Series B. We'd like to walk through the governance rights and liquidation preference with you directly before Friday's deadline.",
        timestamp: new Date("2026-11-16T11:20:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Received email from Marcus Vance", actor: "System", timestamp: new Date("2026-11-16T11:20:00Z") },
      { action: "High priority flag assigned", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T11:21:00Z") }
    ]
  },

  // 3. Assistant to Reply - Action Required - Gmail
  {
    subject: "Catering & Private Room Booking - Annual Partners Dinner",
    accountSource: "Gmail",
    senderName: "Claire Dupont",
    senderEmail: "claire@lemeridienevents.com",
    classification: "Assistant to Reply",
    confidenceScore: 0.92,
    classificationReason: "Event logistics and dietary headcount confirmation for an upcoming corporate dinner.",
    aiSummary: "The event coordinator is requesting final guest count and wine selection confirmations for the private dining suite by tomorrow at noon.",
    extractedDates: [
      { label: "Headcount Deadline", date: "Tuesday, Nov 17, 2026 at 12:00 PM EST" },
      { label: "Dinner Date", date: "Thursday, Dec 4, 2026 at 7:30 PM EST" }
    ],
    suggestedReply: "Hi Claire,\n\nWe have 16 confirmed attendees. Two guests require gluten-free courses. Please proceed with the Bordeaux reserve pairing as previously quoted.\n\nThank you,\nExecutive Assistant",
    segment: "Action Required",
    status: "Open",
    isImportant: false,
    isUnread: true,
    messages: [
      {
        senderName: "Claire Dupont",
        senderEmail: "claire@lemeridienevents.com",
        body: "Good morning! Just checking in regarding the private dining room reservation for December 4th. We need the final dietary requirements and your beverage package selection by noon tomorrow to ensure cellar availability.",
        timestamp: new Date("2026-11-16T08:30:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Imported via Gmail", actor: "System", timestamp: new Date("2026-11-16T08:30:00Z") }
    ]
  },

  // 4. No Reply Needed - General - Outlook
  {
    subject: "DocuSign: Master Services Agreement Fully Executed - Acme Corp",
    accountSource: "Outlook",
    senderName: "DocuSign System",
    senderEmail: "dse_na2@docusign.net",
    classification: "No Reply Needed",
    confidenceScore: 0.99,
    classificationReason: "Automated notification confirming all parties have signed the legal contract; purely informational.",
    aiSummary: "The Master Services Agreement with Acme Corp has been fully executed by all signatories and is stored in repository.",
    extractedDates: [
      { label: "Execution Date", date: "Nov 16, 2026" }
    ],
    suggestedReply: "",
    segment: "General",
    status: "Completed",
    isImportant: false,
    isUnread: false,
    messages: [
      {
        senderName: "DocuSign System",
        senderEmail: "dse_na2@docusign.net",
        body: "Your document 'MSA_AcmeCorp_Signed_2026.pdf' has been completed by all parties. A copy has been delivered to legal archives.",
        timestamp: new Date("2026-11-15T18:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Automatically marked completed", actor: "System", timestamp: new Date("2026-11-15T18:01:00Z") }
    ]
  },

  // 5. Client to Reply - Action Required - Outlook
  {
    subject: "Confidential: Senior VP of Engineering Compensation Package",
    accountSource: "Outlook",
    senderName: "Elena Rostova",
    senderEmail: "elena@talentadvisors.io",
    classification: "Client to Reply",
    confidenceScore: 0.93,
    classificationReason: "Executive hire compensation sign-off and equity allocation requiring direct leadership authority.",
    aiSummary: "Executive search recruiter requests approval for an equity grant increase for the final VP candidate who received a competing offer.",
    extractedDates: [
      { label: "Candidate Decision Deadline", date: "Wednesday, Nov 19, 2026 at 5:00 PM EST" }
    ],
    suggestedReply: "Elena, I am willing to approve the additional 0.15% equity grant provided the four-year vesting schedule maintains the standard 1-year cliff. Please extend the updated offer sheet today.",
    segment: "Action Required",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Elena Rostova",
        senderEmail: "elena@talentadvisors.io",
        body: "David has a competing offer from a Series C competitor offering $380k base and 1.2% equity. To close him, we need your sign-off to bump his equity grant to 1.1% or include a signing bonus. Can you give me the green light?",
        timestamp: new Date("2026-11-16T12:10:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "High priority executive decision", actor: "System", timestamp: new Date("2026-11-16T12:10:00Z") }
    ]
  },

  // 6. Needs Review (Low Confidence < 0.75) - General - Gmail
  {
    subject: "Follow-up regarding potential synergy opportunities",
    accountSource: "Gmail",
    senderName: "Arthur Pendelton",
    senderEmail: "arthur.pendelton@meridian-ventures-group.co.uk",
    classification: "Needs Review",
    confidenceScore: 0.62,
    classificationReason: "Ambiguous proposal blending generic business development pitch with specific mutual acquaintance references.",
    aiSummary: "Arthur reaches out referencing an encounter at the Geneva Summit, proposing exploratory collaboration without concrete specifics.",
    extractedDates: [],
    suggestedReply: "Hello Arthur, thanks for following up. Could you please provide a one-page summary or specific agenda topic so we can determine the right team member to connect you with?",
    segment: "General",
    status: "Open",
    isImportant: false,
    isUnread: true,
    messages: [
      {
        senderName: "Arthur Pendelton",
        senderEmail: "arthur.pendelton@meridian-ventures-group.co.uk",
        body: "Enjoyed briefly crossing paths near the main stage in Geneva. Our partners are exploring strategic alignments in AI infrastructure. Let me know if you or someone on your team has 15 minutes next week.",
        timestamp: new Date("2026-11-16T07:45:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Low confidence analysis flagged for review", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T07:46:00Z") }
    ]
  },

  // 7. Assistant to Reply - Meetings & Appointments - Gmail
  {
    subject: "Private Aviation Manifest & Ground Transportation Details",
    accountSource: "Gmail",
    senderName: "Charter Dispatch",
    senderEmail: "ops@jetluxconcierge.com",
    classification: "Assistant to Reply",
    confidenceScore: 0.96,
    classificationReason: "Travel logistics, passenger ID manifests, and car service coordination for executive transport.",
    aiSummary: "Flight operator needs passenger passport details and Aspen FBO ground transport preferences by this evening.",
    extractedDates: [
      { label: "Flight Departure", date: "Friday, Nov 21, 2026 at 7:00 AM EST" },
      { label: "Manifest Cutoff", date: "Monday, Nov 16, 2026 at 6:00 PM EST" }
    ],
    suggestedReply: "Hello Dispatch team,\n\nAttached are the verified IDs for both passengers. Please book an AWD SUV for Aspen arrival.\n\nThank you,\nExecutive Assistant",
    segment: "Meetings & Appointments",
    status: "Open",
    isImportant: true,
    isUnread: false,
    messages: [
      {
        senderName: "Charter Dispatch",
        senderEmail: "ops@jetluxconcierge.com",
        body: "Attached is the flight plan for Tail N442X on Nov 21st. Kindly send updated passenger identification copies and let us know if you require tarmac chauffeur pickup in Aspen.",
        timestamp: new Date("2026-11-16T08:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Manifest requested", actor: "System", timestamp: new Date("2026-11-16T08:00:00Z") }
    ]
  },

  // 8. Client to Reply - Waiting for Response - Outlook
  {
    subject: "Keynote Confirmation: AI Summit 2027 Mainstage",
    accountSource: "Outlook",
    senderName: "Sophia Zhang",
    senderEmail: "sophia@techfutureconferences.org",
    classification: "Client to Reply",
    confidenceScore: 0.91,
    classificationReason: "High-visibility speaking engagement invitation requiring personal executive commitment and topic choice.",
    aiSummary: "Sophia has reserved the opening morning keynote slot in San Francisco and needs confirmation of participation and proposed topic.",
    extractedDates: [
      { label: "Speaker Form Deadline", date: "Nov 25, 2026" },
      { label: "Conference Dates", date: "Feb 18-20, 2027" }
    ],
    suggestedReply: "Sophia, I would be honored to deliver the opening keynote. My office will sync on the title: 'Autonomous Workflows and the Future of Enterprise Software'. My PA will handle logistics.",
    segment: "Waiting for Response",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Sophia Zhang",
        senderEmail: "sophia@techfutureconferences.org",
        body: "We have finalized our keynote lineup for TechFuture 2027 at Moscone. We reserved the Thursday 9:00 AM slot for you. Please let us know if you can accept by Nov 25th so we can announce your session.",
        timestamp: new Date("2026-11-15T15:20:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Keynote invitation logged", actor: "System", timestamp: new Date("2026-11-15T15:20:00Z") }
    ]
  },

  // 9. No Reply Needed - General - Gmail
  {
    subject: "Stripe Monthly Payout Statement: $384,192.50 Dispatched",
    accountSource: "Gmail",
    senderName: "Stripe Financial",
    senderEmail: "receipts@stripe.com",
    classification: "No Reply Needed",
    confidenceScore: 0.99,
    classificationReason: "Standard financial payout confirmation and receipt requiring no response.",
    aiSummary: "Monthly merchant payout of $384,192.50 has been transferred to JPMorgan Chase primary operating account.",
    extractedDates: [
      { label: "Deposit Expected", date: "Nov 17, 2026" }
    ],
    suggestedReply: "",
    segment: "General",
    status: "Completed",
    isImportant: false,
    isUnread: false,
    messages: [
      {
        senderName: "Stripe Financial",
        senderEmail: "receipts@stripe.com",
        body: "Your daily/monthly payout of $384,192.50 is on its way to your account ending in 8841. Funds should settle within 1-2 business days.",
        timestamp: new Date("2026-11-16T03:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Automated statement cataloged", actor: "System", timestamp: new Date("2026-11-16T03:01:00Z") }
    ]
  },

  // 10. Needs Review (Low Confidence < 0.75) - Action Required - Outlook
  {
    subject: "Urgent dispute: Invoice #8841 discrepancy & legal hold",
    accountSource: "Outlook",
    senderName: "Raymond Sterling",
    senderEmail: "rsterling@sterling-law.co",
    classification: "Needs Review",
    confidenceScore: 0.71,
    classificationReason: "Mixed legal notices and disputed financial claims requiring careful attorney review before sending any acknowledgment.",
    aiSummary: "Opposing counsel claims billing discrepancies on contract vendor deliverables and requests an immediate billing conference.",
    extractedDates: [
      { label: "Response Requested By", date: "Wednesday, Nov 18, 2026 at 5:00 PM EST" }
    ],
    suggestedReply: "Dear Mr. Sterling, We have forwarded your correspondence to our general counsel for review. Our legal counsel will be in contact directly.",
    segment: "Action Required",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Raymond Sterling",
        senderEmail: "rsterling@sterling-law.co",
        body: "Take notice that our client disputes itemized hours in the October milestone billing. We insist on holding a meeting before any further collections are initiated.",
        timestamp: new Date("2026-11-16T13:40:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Marked Needs Review due to legal risk and low AI confidence", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T13:41:00Z") }
    ]
  },

  // 11. Assistant to Reply - General - Gmail
  {
    subject: "Annual Software License Renewal - Bloomberg Enterprise Terminal",
    accountSource: "Gmail",
    senderName: "Melissa Gomez",
    senderEmail: "mgomez@bloomberg-enterprise.net",
    classification: "Assistant to Reply",
    confidenceScore: 0.95,
    classificationReason: "Standard operational SaaS renewal and invoice PO verification handled routinely by assistant.",
    aiSummary: "Bloomberg account manager sends quotes for adding 2 additional analyst seats onto the corporate subscription tier.",
    extractedDates: [
      { label: "Renewal Effective Date", date: "Dec 1, 2026" }
    ],
    suggestedReply: "Hi Melissa, please route the electronic agreement and PO requisition to finance@apexholdings.com. I will coordinate internal signing.",
    segment: "General",
    status: "Open",
    isImportant: false,
    isUnread: false,
    messages: [
      {
        senderName: "Melissa Gomez",
        senderEmail: "mgomez@bloomberg-enterprise.net",
        body: "Attached is the renewal quote for the 2027 enterprise package. Let us know if you wish to lock in the 3-year discounted rate before the month end.",
        timestamp: new Date("2026-11-15T11:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Quote received", actor: "System", timestamp: new Date("2026-11-15T11:00:00Z") }
    ]
  },

  // 12. Client to Reply - Important - Outlook
  {
    subject: "Personal: Philanthropic Advisory Board Seat",
    accountSource: "Outlook",
    senderName: "Lady Caroline Hastings",
    senderEmail: "caroline.hastings@globaloceanfoundation.org",
    classification: "Client to Reply",
    confidenceScore: 0.97,
    classificationReason: "Direct personal invitation from a peer foundation chair for a trustee advisory role.",
    aiSummary: "Invitation to join the 2027 Oceanic Restoration Global Advisory Board with bi-annual meetings in London and Monaco.",
    extractedDates: [
      { label: "Inaugural Gala", date: "January 14, 2027" }
    ],
    suggestedReply: "Dear Caroline, I am deeply impressed by the Foundation's impact on marine habitats. I would be thrilled to discuss how I can contribute to the Advisory Board. Let's arrange a telephone conversation next week.",
    segment: "Important",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Lady Caroline Hastings",
        senderEmail: "caroline.hastings@globaloceanfoundation.org",
        body: "We are assembling our 2027 advisory cohort and would cherish your leadership and strategic perspective. Would you be open to an informal conversation next week regarding the appointment?",
        timestamp: new Date("2026-11-16T14:15:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Direct personal note identified", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T14:16:00Z") }
    ]
  },

  // 13. Assistant to Reply - Meetings & Appointments - Outlook
  {
    subject: "Offsite Venue Shortlist & Contract Signing",
    accountSource: "Outlook",
    senderName: "Karan Mehta",
    senderEmail: "karan@apollonavigators.com",
    classification: "Assistant to Reply",
    confidenceScore: 0.93,
    classificationReason: "Venue contract negotiations, room allocations, and executive retreat vendor follow-up.",
    aiSummary: "Karan submitted two vetted resort proposals in Lake Tahoe for the executive Q1 strategic offsite.",
    extractedDates: [
      { label: "Retreat Dates", date: "Jan 22-25, 2027" },
      { label: "Deposit Deadline", date: "Friday, Nov 21, 2026" }
    ],
    suggestedReply: "Hi Karan,\n\nThe Ritz Lake Tahoe option aligns best with our AV requirements. Please request the draft master service contract and deposit invoice for our review.\n\nBest,\nExecutive Assistant",
    segment: "Meetings & Appointments",
    status: "Open",
    isImportant: false,
    isUnread: true,
    messages: [
      {
        senderName: "Karan Mehta",
        senderEmail: "karan@apollonavigators.com",
        body: "Hi team, we've negotiated holds at both The Ritz Lake Tahoe and Edgewood Tahoe for Jan 22-25. The Ritz includes dedicated fiber line for hybrid sessions. Which should we execute?",
        timestamp: new Date("2026-11-16T15:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Offsite proposals delivered", actor: "System", timestamp: new Date("2026-11-16T15:00:00Z") }
    ]
  },

  // 14. Waiting for Response - Action Required - Gmail
  {
    subject: "Feedback requested: 2027 Product Roadmap Draft",
    accountSource: "Gmail",
    senderName: "Talia Al-Mansoor",
    senderEmail: "talia@apexholdings.com",
    classification: "Client to Reply",
    confidenceScore: 0.88,
    classificationReason: "Internal VP of Product seeking executive direction and strategic trade-off sign-off on 2027 milestones.",
    aiSummary: "Talia shared the v2 draft roadmap emphasizing enterprise compliance features and needs executive green light before tomorrow's team sync.",
    extractedDates: [
      { label: "Product All-Hands", date: "Tuesday, Nov 17, 2026 at 2:00 PM EST" }
    ],
    suggestedReply: "Talia, overall direction is solid. Prioritize the SOC2 Type II compliance engine ahead of the custom integrations suite for Q1. Let's sync for 10 mins before the all-hands.",
    segment: "Waiting for Response",
    status: "Open",
    isImportant: true,
    isUnread: false,
    messages: [
      {
        senderName: "Talia Al-Mansoor",
        senderEmail: "talia@apexholdings.com",
        body: "Here is the revised slide deck for our 2027 product milestones. The primary question is whether we double down on automated triage or SOC2 certifications first. Let me know your thoughts.",
        timestamp: new Date("2026-11-16T10:30:00Z"),
        isInternal: false,
      },
      {
        senderName: "Executive Office",
        senderEmail: "exec-team@apexholdings.com",
        body: "Reviewing this with the team now Talia, will provide feedback shortly.",
        timestamp: new Date("2026-11-16T11:00:00Z"),
        isInternal: true,
      }
    ],
    activityLog: [
      { action: "Interim response dispatched", actor: "Assistant", timestamp: new Date("2026-11-16T11:00:00Z") }
    ]
  },

  // 15. No Reply Needed - General - Outlook
  {
    subject: "Substack: The Weekly Tech Architect - Edition #194",
    accountSource: "Outlook",
    senderName: "Gergely Orosz",
    senderEmail: "newsletter@pragmaticengineer.com",
    classification: "No Reply Needed",
    confidenceScore: 0.99,
    classificationReason: "Standard editorial newsletter publication requiring zero reply or scheduling action.",
    aiSummary: "Deep dive analysis into engineering organizational structures and compensation benchmarks across high-growth startups.",
    extractedDates: [],
    suggestedReply: "",
    segment: "General",
    status: "Completed",
    isImportant: false,
    isUnread: false,
    messages: [
      {
        senderName: "Gergely Orosz",
        senderEmail: "newsletter@pragmaticengineer.com",
        body: "Welcome to this week's edition. Today we analyze how Big Tech compensation packages are shifting in late 2026 and what that means for hiring managers...",
        timestamp: new Date("2026-11-16T06:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Archived newsletter", actor: "System", timestamp: new Date("2026-11-16T06:05:00Z") }
    ]
  },

  // 16. Needs Review - Action Required - Gmail
  {
    subject: "Urgent: Unrecognized wire transfer inquiry - Audit Reference #9192",
    accountSource: "Gmail",
    senderName: "Global Wealth Treasury",
    senderEmail: "security-alert@wealth-treasury-corp.com",
    classification: "Needs Review",
    confidenceScore: 0.81,
    classificationReason: "Security alert regarding outgoing wire transfer requiring immediate human verification against banking records.",
    aiSummary: "Banking notification asking to verify an outgoing wire of $75,000 to an offshore escrow supplier.",
    extractedDates: [
      { label: "Verification Cutoff", date: "Today by 4:00 PM EST" }
    ],
    suggestedReply: "I am placing a temporary hold on wire #9192 while we cross-reference our internal PO authorization. Do not release funds.",
    segment: "Action Required",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Global Wealth Treasury",
        senderEmail: "security-alert@wealth-treasury-corp.com",
        body: "We received an instruction for a wire dispatch of $75,000.00 to Apex International Escrow Ltd. Please verify this authorization immediately via voice or secure token.",
        timestamp: new Date("2026-11-16T15:20:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "High risk security flag triggered", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T15:21:00Z") }
    ]
  },

  // 17. No Reply Needed - General - Gmail
  {
    subject: "Google Cloud: Billing alert: Actual costs exceeded 85% of budget",
    accountSource: "Gmail",
    senderName: "Google Cloud Billing",
    senderEmail: "cloud-billing-noreply@google.com",
    classification: "No Reply Needed",
    confidenceScore: 0.98,
    classificationReason: "Automated cloud infrastructure budget threshold alert.",
    aiSummary: "GCP production cluster spending reached 85% ($17,000 of $20,000) of the monthly allocation for November.",
    extractedDates: [],
    suggestedReply: "",
    segment: "General",
    status: "Completed",
    isImportant: false,
    isUnread: false,
    messages: [
      {
        senderName: "Google Cloud Billing",
        senderEmail: "cloud-billing-noreply@google.com",
        body: "Your project 'production-ai-clusters' has reached 85.4% of your set $20,000.00 monthly threshold. No action is required if this usage is anticipated.",
        timestamp: new Date("2026-11-16T04:12:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Budget alert cataloged", actor: "System", timestamp: new Date("2026-11-16T04:13:00Z") }
    ]
  },

  // 18. Needs Review - Meetings & Appointments - Outlook
  {
    subject: "Potential conflict: Dinner with Ambassador vs Munich flight",
    accountSource: "Outlook",
    senderName: "Sir Julian Thorne",
    senderEmail: "jthorne@diplomaticmissions.uk",
    classification: "Needs Review",
    confidenceScore: 0.79,
    classificationReason: "Diplomatic protocol engagement overlapping with international flight schedule requiring executive preference.",
    aiSummary: "Sir Julian proposes a private diplomatic dinner in London on Dec 8th, which directly clashes with the currently booked flight to Munich.",
    extractedDates: [
      { label: "Proposed Dinner", date: "Monday, Dec 8, 2026 at 8:00 PM GMT" },
      { label: "Scheduled Flight", date: "Monday, Dec 8, 2026 at 7:15 PM GMT" }
    ],
    suggestedReply: "Dear Sir Julian, Thank you for this kind invitation. I am checking our European flight arrangements to see if we can reroute through London Heathrow earlier that morning.",
    segment: "Meetings & Appointments",
    status: "Open",
    isImportant: true,
    isUnread: true,
    messages: [
      {
        senderName: "Sir Julian Thorne",
        senderEmail: "jthorne@diplomaticmissions.uk",
        body: "The Ambassador is hosting a private roundtable in Mayfair on the 8th of December at 8pm. It would be our great pleasure if you could attend. Please advise on your availability.",
        timestamp: new Date("2026-11-16T12:00:00Z"),
        isInternal: false,
      }
    ],
    activityLog: [
      { action: "Calendar conflict detected", actor: "AI Chief of Staff", timestamp: new Date("2026-11-16T12:01:00Z") }
    ]
  }
];
