import { useState } from "react";
import {
  Star,
  CheckCircle2,
  Archive,
  ChevronDown,
  RefreshCw,
  Send,
  Calendar,
  ChevronUp,
  User,
  Loader2,
  MessageSquare,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  CLASSIFICATION_STYLES,
  CLASSIFICATIONS,
  formatTimestamp,
} from "../utils/constants";
import { patchConversation, regenerateDraft } from "../hooks/useConversations";

function ClassificationBadge({ value }) {
  const style = CLASSIFICATION_STYLES[value] || CLASSIFICATION_STYLES["Needs Review"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>
      <span className={`w-2 h-2 rounded-full ${style.glowDot || style.dot}`} />
      <span>{value}</span>
    </span>
  );
}

function MessageBubble({ message }) {
  const isInternal = message.isInternal;
  const initials = (message.senderName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex gap-3 ${isInternal ? "flex-row-reverse" : ""} animate-fadeIn`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-sm ${
          isInternal
            ? "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
        }`}
      >
        {initials}
      </div>
      <div className={`max-w-[82%] ${isInternal ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {message.senderName || message.senderEmail || "Unknown"}
          </span>
          {isInternal && (
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.2 rounded-full font-semibold">
              PA Office Note
            </span>
          )}
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
            isInternal
              ? "bg-indigo-600 text-white rounded-tr-sm"
              : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
          }`}
        >
          {message.body}
        </div>
      </div>
    </div>
  );
}

export default function ConversationDetail({ conversation, onUpdate, toast }) {
  const [replyText, setReplyText] = useState(conversation?.suggestedReply || "");
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [overrideClassification, setOverrideClassification] = useState(conversation?.classification || "");
  const [activityOpen, setActivityOpen] = useState(false);
  const [overriding, setOverriding] = useState(false);

  // Sync replyText when conversation changes
  if (conversation && conversation.suggestedReply !== undefined && replyText === "") {
    setReplyText(conversation.suggestedReply || "");
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50/40 dark:bg-[#090D16] p-8 text-center animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-sm">
          <MessageSquare className="w-6 h-6 text-indigo-500/70 dark:text-indigo-400/80" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
          Executive Thread Focus
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          Select an email thread from the inbox to review live Chief of Staff AI classification, date extractions, and approve draft replies.
        </p>
      </div>
    );
  }

  const style = CLASSIFICATION_STYLES[conversation.classification] || CLASSIFICATION_STYLES["Needs Review"];
  const confidencePct = Math.round((conversation.confidenceScore || 0) * 100);

  const handleStar = async () => {
    try {
      const updated = await patchConversation(conversation._id, { isImportant: !conversation.isImportant });
      onUpdate(updated);
      toast(`${updated.isImportant ? "Starred" : "Unstarred"} conversation`, "info");
    } catch {
      toast("Failed to update star", "error");
    }
  };

  const handleMarkCompleted = async () => {
    try {
      const updated = await patchConversation(conversation._id, { status: "Completed" });
      onUpdate(updated);
      toast("Marked as Completed", "success");
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleArchive = async () => {
    try {
      const updated = await patchConversation(conversation._id, { status: "Archived" });
      onUpdate(updated);
      toast("Conversation archived", "info");
    } catch {
      toast("Failed to archive", "error");
    }
  };

  const handleClassificationOverride = async (newClass) => {
    setOverrideClassification(newClass);
    setOverriding(true);
    try {
      const updated = await patchConversation(conversation._id, { classification: newClass });
      onUpdate(updated);
      toast(`Classification updated to "${newClass}"`, "success");
    } catch {
      toast("Failed to update classification", "error");
    } finally {
      setOverriding(false);
    }
  };

  const handleRegenerateDraft = async () => {
    setRegenerating(true);
    try {
      const updated = await regenerateDraft(conversation._id);
      onUpdate(updated);
      setReplyText(updated.suggestedReply || "");
      toast("New draft generated by Groq AI", "success");
    } catch {
      toast("Failed to regenerate draft", "error");
    } finally {
      setRegenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast("Reply cannot be empty", "warning");
      return;
    }
    setSending(true);
    try {
      const updated = await patchConversation(conversation._id, {
        replyBody: replyText,
        actor: "Executive Assistant",
      });
      onUpdate(updated);
      setReplyText("");
      toast("Reply dispatched and thread marked Completed", "success");
    } catch {
      toast("Failed to send reply", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#090D16] overflow-hidden transition-colors duration-200 animate-fadeIn">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1.5 line-clamp-2 tracking-tight">
              {conversation.subject}
            </h2>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {conversation.senderName}
                </span>
              </div>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{conversation.senderEmail}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                conversation.accountSource === "Gmail"
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
              }`}>
                {conversation.accountSource}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={handleStar} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Star">
              <Star className={`w-4 h-4 transition-colors ${conversation.isImportant ? "fill-amber-400 text-amber-400" : "text-slate-400 dark:text-slate-500 hover:text-amber-400"}`} />
            </button>
            {conversation.status !== "Completed" && (
              <button
                onClick={handleMarkCompleted}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Complete
              </button>
            )}
            <button
              onClick={handleArchive}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        {conversation.status && (
          <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
            conversation.status === "Completed"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              : conversation.status === "Archived"
              ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
          }`}>
            Status: {conversation.status}
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/40 dark:bg-[#090D16]/70 p-4 space-y-4">
        {/* AI Rationale Banner */}
        <div className={`rounded-2xl border p-4 shadow-xs backdrop-blur-sm ${style.bg} ${style.border}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Chief of Staff AI Triage
              </p>
              <ClassificationBadge value={conversation.classification} />
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">Confidence</p>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      confidencePct >= 80 ? "bg-emerald-500" : confidencePct >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
                <span className={`text-xs font-bold font-mono ${style.text}`}>{confidencePct}%</span>
              </div>
            </div>
          </div>

          {conversation.classificationReason && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Executive Rationale
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {conversation.classificationReason}
              </p>
            </div>
          )}

          {/* Manual Override */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0">Manual Override:</p>
            <div className="relative">
              <select
                value={overrideClassification}
                onChange={(e) => handleClassificationOverride(e.target.value)}
                disabled={overriding}
                className="text-xs font-semibold pl-2.5 pr-7 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 shadow-xs"
              >
                {CLASSIFICATIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {overriding ? (
                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-slate-500" />
              ) : (
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* Extracted Dates */}
        {conversation.extractedDates?.length > 0 && (
          <div className="p-3.5 bg-teal-50/80 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/60 rounded-2xl shadow-xs">
            <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Extracted Deadlines &amp; Dates
            </p>
            <div className="flex flex-wrap gap-2">
              {conversation.extractedDates.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 rounded-xl px-3 py-1.5 shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">{d.label}</p>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{d.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Summary */}
        {conversation.aiSummary && (
          <div className="p-3.5 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
              Executive 1-Sentence Summary
            </p>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{conversation.aiSummary}</p>
          </div>
        )}

        {/* Message Thread */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Thread Activity ({conversation.messages?.length || 0})
          </p>
          <div className="space-y-3">
            {conversation.messages?.map((msg, i) => (
              <MessageBubble key={msg._id || i} message={msg} />
            ))}
          </div>
        </div>

        {/* Reply Composer */}
        {conversation.status !== "Archived" && (
          <div className="pt-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  {conversation.status === "Completed" ? "Reply (Completed)" : "AI-Assisted Reply Composer"}
                </p>
                <button
                  onClick={handleRegenerateDraft}
                  disabled={regenerating}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-50 transition"
                >
                  {regenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Regenerate with Groq
                </button>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none border-0 leading-relaxed font-normal"
                placeholder="Compose or refine your reply…"
              />
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{replyText.length} characters</p>
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-900 text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {sending ? "Sending…" : "Approve & Send Reply"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log */}
        {conversation.activityLog?.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setActivityOpen((v) => !v)}
              className="w-full flex items-center justify-between py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-t border-slate-200/80 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Audit Trail ({conversation.activityLog.length})
              </span>
              {activityOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {activityOpen && (
              <div className="space-y-2 mt-2 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-xs">
                {conversation.activityLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-1 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">{log.action}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {log.actor} · {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
