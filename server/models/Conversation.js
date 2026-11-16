import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderName: { type: String, default: "" },
    senderEmail: { type: String, default: "" },
    body: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false },
  },
  { _id: true }
);

const extractedDateSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: { type: String, default: "System" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    accountSource: {
      type: String,
      enum: ["Gmail", "Outlook"],
      default: "Gmail",
    },
    senderName: { type: String, default: "" },
    senderEmail: { type: String, default: "" },
    messages: [messageSchema],
    classification: {
      type: String,
      enum: [
        "Assistant to Reply",
        "Client to Reply",
        "No Reply Needed",
        "Needs Review",
      ],
      default: "Needs Review",
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.85,
    },
    classificationReason: { type: String, default: "" },
    aiSummary: { type: String, default: "" },
    extractedDates: [extractedDateSchema],
    suggestedReply: { type: String, default: "" },
    segment: {
      type: String,
      enum: [
        "Action Required",
        "Waiting for Response",
        "Meetings & Appointments",
        "Important",
        "General",
      ],
      default: "General",
    },
    status: {
      type: String,
      enum: ["Open", "Completed", "Archived"],
      default: "Open",
    },
    isImportant: { type: Boolean, default: false },
    isUnread: { type: Boolean, default: true },
    activityLog: [activityLogSchema],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
