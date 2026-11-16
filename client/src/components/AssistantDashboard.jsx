import { useState, useMemo, useCallback } from "react";
import {
  Zap,
  Menu,
  ArrowLeft,
  ShieldCheck,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import HeaderActions from "./HeaderActions";
import Sidebar from "./Sidebar";
import KPIStrip from "./KPIStrip";
import ConversationList from "./ConversationList";
import ConversationDetail from "./ConversationDetail";
import { patchConversation } from "../hooks/useConversations";
import { useStats } from "../hooks/useConversations";

function GmailSyncPill() {
  return (
   <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800">
      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 opacity-80 animate-pulse" />
      <span className="hidden sm:inline">Gmail · </span>Synced
    </span>
  );
}

function OutlookSyncPill() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-80 animate-pulse" />
      <span className="hidden sm:inline">Outlook · </span>Synced
    </span>
  );
}

export default function AssistantDashboard({
  profile,
  conversations,
  setConversations,
  loading,
  highlightedId,
  onManageAccounts,
  onSwitchToExecutive,
  onOpenSimulator,
  isDark,
  onToggleTheme,
  toast,
}) {
  const [activeFilter, setActiveFilter] = useState({ filterKey: null });
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedConv, setSelectedConv] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [explainabilityModalOpen, setExplainabilityModalOpen] = useState(false);

  const { refetch: refetchStats } = useStats();

  // Active (non-completed, non-archived) conversations
  const activeConvs = useMemo(
    () =>
      conversations.filter(
        (c) => c.status !== "Completed" && c.status !== "Archived",
      ),
    [conversations],
  );

  // Real-time computed KPI stats derived directly from client conversation state
  const computedStats = useMemo(() => {
    return {
      total: activeConvs.length,
      unread: activeConvs.filter((c) => c.isUnread).length,
      assistantToReply: activeConvs.filter(
        (c) => c.classification === "Assistant to Reply",
      ).length,
      clientToReply: activeConvs.filter(
        (c) => c.classification === "Client to Reply",
      ).length,
      waitingForResponse: activeConvs.filter(
        (c) => c.segment === "Waiting for Response",
      ).length,
      upcomingMeetings: activeConvs.filter(
        (c) =>
          c.segment === "Meetings & Appointments" ||
          (c.extractedDates && c.extractedDates.length > 0),
      ).length,
    };
  }, [activeConvs]);

  // Reactive email queue filtering:
  // - Completed/Archived threads are hidden from ALL active work queues
  // - They only appear when the user explicitly selects "Completed" or "Archived"
  const displayedConversations = useMemo(() => {
    return conversations.filter((c) => {
      // 1. Text search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          c.subject?.toLowerCase().includes(q) ||
          c.senderName?.toLowerCase().includes(q) ||
          c.senderEmail?.toLowerCase().includes(q) ||
          c.aiSummary?.toLowerCase().includes(q) ||
          c.messages?.some((m) => m.body?.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Dedicated status filters (Completed or Archived)
      if (activeFilter.filterKey === "status") {
        return c.status === activeFilter.filterValue;
      }

      // 3. For ALL other active queues, immediately exclude Completed and Archived
      if (c.status === "Completed" || c.status === "Archived") {
        return false;
      }

      // 4. Specific active work queue filters
      if (activeFilter.filterKey === "classification") {
        return c.classification === activeFilter.filterValue;
      }
      if (activeFilter.filterKey === "segment") {
        return c.segment === activeFilter.filterValue;
      }
      if (activeFilter.filterKey === "isImportant") {
        return c.isImportant;
      }
      if (activeFilter.filterKey === "isUnread") {
        return c.isUnread;
      }

      // 5. Default: All Inbox (all active conversations)
      return true;
    });
  }, [conversations, activeFilter, search]);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setSelectedConv(null);
  }, []);

  const handleSelectConv = useCallback(
    (conv) => {
      setSelectedConv(conv);
      setMobileDetailOpen(true);
      if (conv.isUnread) {
        patchConversation(conv._id, { isUnread: false })
          .then((updated) => {
            setConversations((prev) =>
              prev.map((c) => (c._id === updated._id ? updated : c)),
            );
            refetchStats();
          })
          .catch(() => {});
      }
    },
    [setConversations, refetchStats],
  );

  const handleConvUpdate = useCallback(
    (updated) => {
      setConversations((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
      setSelectedConv(updated);
      refetchStats();
    },
    [setConversations, refetchStats],
  );

  const handleToggleStar = useCallback(
    async (id, currentState) => {
      try {
        const updated = await patchConversation(id, {
          isImportant: !currentState,
        });
        setConversations((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c)),
        );
        if (selectedConv?._id === id) setSelectedConv(updated);
        refetchStats();
        toast(`${updated.isImportant ? "Starred" : "Unstarred"}`, "info");
      } catch {
        toast("Failed to update star", "error");
      }
    },
    [selectedConv, setConversations, refetchStats, toast],
  );

  const assistantName = profile?.assistantName || "Priya Sharma";
  const clientName = profile?.clientName || "Arjun Mehta";
  const gmailEnabled = profile?.gmailEnabled !== false;
  const outlookEnabled = profile?.outlookEnabled !== false;

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden transition-colors duration-200">
      {/* ── TOP HEADER ── */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 sm:gap-3 shrink-0 z-20 transition-colors duration-200">
        {/* Mobile burger */}
        <button
          className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm hidden md:block">
            ChiefOfStaff <span className="text-indigo-600">AI</span>
          </span>
        </div>

        {/* Sync pills (visible on desktop alongside brand) */}
        <div className="hidden sm:flex items-center gap-1.5">
          {gmailEnabled && <GmailSyncPill />}
          {outlookEnabled && <OutlookSyncPill />}
        </div>

        {/* Responsive Header Actions */}
        <HeaderActions
          currentView="assistant"
          onSwitchView={onSwitchToExecutive}
          onOpenSimulator={onOpenSimulator}
          onManageAccounts={onManageAccounts}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          profile={profile}
          gmailEnabled={gmailEnabled}
          outlookEnabled={outlookEnabled}
        />
      </header>

      {/* ── KPI STRIP ── */}
      <KPIStrip
        stats={computedStats}
        loading={loading}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          conversations={conversations}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Conversation List */}
        <div
          className={`${
            mobileDetailOpen ? "hidden lg:flex" : "flex"
          } flex-col w-full lg:w-80 xl:w-96 shrink-0`}
        >
          <ConversationList
            conversations={displayedConversations}
            loading={loading}
            selectedId={selectedConv?._id}
            highlightedId={highlightedId}
            onSelect={handleSelectConv}
            onToggleStar={handleToggleStar}
            search={search}
            onSearchChange={setSearch}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
          />
        </div>

        {/* Detail pane */}
        <div
          className={`${
            mobileDetailOpen ? "flex" : "hidden lg:flex"
          } flex-col flex-1 min-w-0 overflow-hidden border-l border-slate-200 dark:border-slate-800 relative`}
        >
          {mobileDetailOpen && (
            <button
              onClick={() => setMobileDetailOpen(false)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Inbox
            </button>
          )}

          {/* AI Explainability & Debugger Button */}
          <button
            onClick={() => setExplainabilityModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 mr-3 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transition shadow-2xs ml-auto"
            title="Inspect Groq AI JSON Schema & Telemetry"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>AI Debugger</span>
          </button>

          <div className="flex-1 overflow-hidden">
            <ConversationDetail
              conversation={selectedConv}
              onUpdate={handleConvUpdate}
              toast={toast}
            />
          </div>
        </div>
      </div>

      {/* ── Real-Time AI Explainability & Telemetry Modal ── */}
      {explainabilityModalOpen && selectedConv && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Live AI Telemetry &amp; Audit Inspector
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time MongoDB document &amp; Groq schema trace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExplainabilityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-5 text-xs">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">
                    Assigned Role
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate block">
                    {selectedConv.classification}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Confidence</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round((selectedConv.confidenceScore || 0.9) * 100)}%
                    {selectedConv.confidenceScore < 0.75
                      ? " (Flagged)"
                      : " (Passed)"}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Audit Edits</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedConv.activityLog?.length || 0} Actions
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800">
                <pre>
                  {JSON.stringify(
                    {
                      _id: selectedConv._id,
                      subject: selectedConv.subject,
                      sender: selectedConv.senderEmail,
                      classification: selectedConv.classification,
                      confidenceScore: selectedConv.confidenceScore,
                      classificationReason: selectedConv.classificationReason,
                      extractedDates: selectedConv.extractedDates,
                      status: selectedConv.status,
                      activityLog: selectedConv.activityLog || [],
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(selectedConv, null, 2),
                  );
                  toast("Live conversation JSON copied!", "success");
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Object JSON</span>
              </button>
              <button
                onClick={() => setExplainabilityModalOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
