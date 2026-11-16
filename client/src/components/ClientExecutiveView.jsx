import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  Calendar,
  Sparkles,
  MessageSquare,
  Send,
  AlertCircle,
  FileCheck,
  User,
  Star,
  Loader2,
  MessageCircle,
  Volume2,
  Check,
} from "lucide-react";
import HeaderActions from "./HeaderActions";
import { patchConversation } from "../hooks/useConversations";
import { formatTimestamp, relativeTime } from "../utils/constants";

export default function ClientExecutiveView({
  conversations,
  onUpdateConversation,
  onBackToAssistant,
  onOpenSimulator,
  profile,
  isDark,
  onToggleTheme,
  toast,
}) {
  const clientName = profile?.clientName || "Arjun Mehta";
  const assistantName = profile?.assistantName || "Priya Sharma";

  // Filter only active items requiring executive action (Client to Reply)
  const executiveItems = conversations.filter(
    (c) =>
      c.classification === "Client to Reply" &&
      c.status !== "Completed" &&
      c.status !== "Archived",
  );

  const [selectedId, setSelectedId] = useState(executiveItems[0]?._id || null);
  const [requestingChanges, setRequestingChanges] = useState(false);
  const [changeNote, setChangeNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingPlaying, setBriefingPlaying] = useState(false);

  // Fallback to first item if current selection was completed/dropped
  const selectedItem =
    executiveItems.find((c) => c._id === selectedId) ||
    executiveItems[0] ||
    null;

  // Generate 30-Second Morning Executive Briefing script
  const briefingScript = `Good morning ${clientName}. Chief of Staff AI briefing: You have ${executiveItems.length} pending executive decision${executiveItems.length === 1 ? "" : "s"} requiring your personal authorization today. Priority item: "${selectedItem?.subject || "Review pending term sheet"}" from ${selectedItem?.senderName || "Key stakeholder"}. Recommended action: Approve the AI-drafted reply or route back to ${assistantName} with notes.`;

  // 1-Click Approve Draft
  const handleApproveDraft = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const reply =
        selectedItem.suggestedReply ||
        `Approved by ${clientName}. Please proceed accordingly.`;

      const updated = await patchConversation(selectedItem._id, {
        replyBody: reply,
        actor: clientName,
        status: "Completed",
      });

      onUpdateConversation(updated);
      toast("Draft approved & reply sent! Item marked completed.", "success");
    } catch (err) {
      console.error("Failed to approve draft:", err);
      toast("Failed to approve draft", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Request Changes from Assistant
  const handleSendChangeRequest = async () => {
    if (!selectedItem) return;
    if (!changeNote.trim()) {
      toast("Please enter your feedback or change request", "warning");
      return;
    }

    setActionLoading(true);
    try {
      const updated = await patchConversation(selectedItem._id, {
        replyBody: `[Executive Note from ${clientName}]: ${changeNote}`,
        actor: clientName,
        classification: "Assistant to Reply", // Route back to assistant
      });

      onUpdateConversation(updated);
      setChangeNote("");
      setRequestingChanges(false);
      toast(`Change request routed to ${assistantName}!`, "success");
    } catch (err) {
      console.error("Failed to request changes:", err);
      toast("Failed to route changes", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-200 animate-fadeIn obsidian-glow">
      {/* ── Top Executive Navbar ── */}
      <header className="h-14 bg-white dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200/90 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
            EO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                Executive Portal
              </span>
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 font-bold px-2 py-0.2 rounded-full">
                CEO Focus
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
              {clientName} · Executive View
            </p>
          </div>
        </div>

        <HeaderActions
          currentView="executive"
          onSwitchView={onBackToAssistant}
          onOpenSimulator={onOpenSimulator}
          onManageAccounts={onBackToAssistant}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          profile={profile}
        />
      </header>

      {/* ── Executive Calm Banner & Morning Briefing Button ── */}
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200/90 dark:border-slate-800/80 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Pending Executive Decisions ({executiveItems.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High-leverage threads filtered by Chief of Staff AI requiring your
            personal authorization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {executiveItems.length > 0 && (
            <button
              onClick={() => setBriefingOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 rounded-xl hover:bg-amber-500/20 transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>✨ 30-Sec Morning Briefing</span>
            </button>
          )}
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 font-medium">
              Assistant on duty:
            </span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {assistantName}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {executiveItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-[#090D16] animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
            <FileCheck className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">
            Inbox Zero · All Executive Decisions Clear
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed font-normal">
            All pending term sheets and partner emails have been authorized.
            Your executive queue is fully up to date.
          </p>
          <button
            onClick={onBackToAssistant}
            className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Switch to Assistant View
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* ── Left Column: Decision Queue ── */}
          <div className="w-full lg:w-96 xl:w-[420px] bg-white dark:bg-[#090D16] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Action Items for {clientName}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {executiveItems.map((item) => {
                const isSelected = selectedItem?._id === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedId(item._id);
                      setRequestingChanges(false);
                    }}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-50/70 dark:bg-amber-950/30 border-l-3 border-l-amber-500 shadow-xs"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {item.senderName || item.senderEmail}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border shrink-0 ${
                            item.accountSource === "Gmail"
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                              : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {item.accountSource}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                        {relativeTime(item.updatedAt || item.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">
                      {item.subject}
                    </h4>

                    {/* Executive 1-line AI summary */}
                    <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-2.5 mb-2 shadow-2xs">
                      <p className="text-xs text-amber-950 dark:text-amber-200 leading-snug line-clamp-2 font-medium">
                        {item.aiSummary || "Review requested by sender."}
                      </p>
                    </div>

                    {/* Dates */}
                    {item.extractedDates?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {item.extractedDates[0].label}:{" "}
                          {item.extractedDates[0].date}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Column: Decision Focus & Instant Actions ── */}
          {selectedItem && (
            <div className="flex-1 flex flex-col bg-slate-50/40 dark:bg-[#090D16]/60 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 animate-fadeIn">
              {/* Header Card */}
              <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                      Action Required: Client to Reply
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {selectedItem.subject}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-mono">
                    {formatTimestamp(
                      selectedItem.updatedAt || selectedItem.createdAt,
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    From: {selectedItem.senderName}
                  </span>
                  <span>({selectedItem.senderEmail})</span>
                  <span>·</span>
                  <span>Source: {selectedItem.accountSource}</span>
                </div>
              </div>

              {/* Chief of Staff Brief */}
              <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/90 dark:border-amber-800/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Chief of Staff AI Briefing
                </div>
                <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-semibold mb-2">
                  {selectedItem.aiSummary}
                </p>
                {selectedItem.classificationReason && (
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Why personal reply:{" "}
                    </span>
                    {selectedItem.classificationReason}
                  </p>
                )}

                {selectedItem.extractedDates?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/60 flex flex-wrap gap-2">
                    {selectedItem.extractedDates.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-slate-700 dark:text-slate-300 shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="font-bold">{d.label}:</span>
                        <span>{d.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Thread History */}
              <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                  Conversation Thread ({selectedItem.messages?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedItem.messages?.map((msg, i) => (
                    <div
                      key={msg._id || i}
                      className={`p-4 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                        msg.isInternal
                          ? "bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-200"
                          : "bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {msg.senderName || msg.senderEmail}{" "}
                          {msg.isInternal && "(Internal Office Note)"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 1-Click Executive Action Card ── */}
              <div className="bg-white dark:bg-slate-900/90 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/40 p-6 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    AI-Drafted Executive Response
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Ready to Approve
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-normal">
                  {selectedItem.suggestedReply ||
                    "Thank you for sending this over. I have reviewed the details and agree with the proposed terms."}
                </div>

                {requestingChanges ? (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Feedback / Change Request for {assistantName}:
                    </label>
                    <textarea
                      rows={3}
                      value={changeNote}
                      onChange={(e) => setChangeNote(e.target.value)}
                      placeholder={`e.g. Ask them to remove clause 4.2 and push the deadline to Monday...`}
                      className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setRequestingChanges(false)}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendChangeRequest}
                        disabled={actionLoading || !changeNote.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-xs font-bold rounded-xl shadow transition"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        Route Back to Assistant
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setRequestingChanges(true)}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
                    >
                      <MessageCircle className="w-4 h-4 text-slate-500" />
                      Request Changes from Assistant
                    </button>

                    <button
                      onClick={handleApproveDraft}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-xl shadow-md transition"
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Approval...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve &amp; Send Draft Now</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 30-Second Morning Briefing Modal ── */}
      {briefingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Morning Executive Briefing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generated by Groq AI · 30-sec digest
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBriefingOpen(false);
                  setBriefingPlaying(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-2"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 rounded-2xl p-4 mb-5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {briefingScript}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (!briefingPlaying) {
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel(); // Stop any ongoing speech
                      const utterance = new SpeechSynthesisUtterance(
                        briefingScript,
                      );
                      utterance.rate = 1.0;
                      utterance.pitch = 1.0;
                      utterance.onend = () => setBriefingPlaying(false);
                      window.speechSynthesis.speak(utterance);
                      setBriefingPlaying(true);
                      toast("Playing executive voice script...", "info");
                    } else {
                      toast(
                        "Speech synthesis not supported in this browser",
                        "error",
                      );
                    }
                  } else {
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                    setBriefingPlaying(false);
                    toast("Audio briefing paused", "info");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow transition"
              >
                <Volume2
                  className={`w-4 h-4 ${briefingPlaying ? "animate-bounce" : ""}`}
                />
                <span>
                  {briefingPlaying ? "Pause Briefing" : "Play Voice Briefing"}
                </span>
              </button>

              <button
                onClick={() => setBriefingOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
