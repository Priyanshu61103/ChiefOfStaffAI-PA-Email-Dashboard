import { Search, Star, Mail, MailOpen } from "lucide-react";
import { CLASSIFICATION_STYLES, relativeTime } from "../utils/constants";

function SkeletonCard() {
  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 animate-pulse">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="w-28 h-3.5 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="w-12 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="w-3/4 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="w-20 h-5 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function EmailCard({ conversation, isSelected, isHighlighted, onClick, onToggleStar }) {
  const style = CLASSIFICATION_STYLES[conversation.classification] || CLASSIFICATION_STYLES["Needs Review"];
  const initials = (conversation.senderName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarColors = {
    "Assistant to Reply": "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/60",
    "Client to Reply": "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/60",
    "Needs Review": "bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-400 border border-purple-200/70 dark:border-purple-800/60",
    "No Reply Needed": "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
  };

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3.5 border-b border-slate-100/90 dark:border-slate-800/70 cursor-pointer transition-all duration-200 group ${
        isHighlighted
          ? "ring-2 ring-indigo-500 shadow-lg bg-indigo-50/90 dark:bg-indigo-950/60 animate-pulse"
          : isSelected
          ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-l-3 border-l-indigo-600 dark:border-l-indigo-500 shadow-xs"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
      } ${conversation.isUnread ? "bg-white dark:bg-[#090D16]" : "bg-slate-50/40 dark:bg-slate-900/30"}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs ${avatarColors[conversation.classification] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Row 1 */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {conversation.isUnread && (
                <span className="w-2 h-2 bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)] rounded-full shrink-0" />
              )}
              <span className={`text-xs truncate ${conversation.isUnread ? "font-bold text-slate-900 dark:text-slate-100" : "font-medium text-slate-600 dark:text-slate-400"}`}>
                {conversation.senderName || conversation.senderEmail}
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border shrink-0 ${
                conversation.accountSource === "Gmail"
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
              }`}>
                {conversation.accountSource}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {relativeTime(conversation.updatedAt || conversation.createdAt)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(conversation._id, conversation.isImportant); }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${conversation.isImportant ? "!opacity-100" : ""}`}
              >
                <Star
                  className={`w-3.5 h-3.5 transition-colors ${
                    conversation.isImportant
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600 hover:text-amber-400"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Row 2 - Subject */}
          <p className={`text-xs truncate mb-1 ${conversation.isUnread ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}`}>
            {conversation.subject}
          </p>

          {/* Row 3 - Summary */}
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mb-1.5 leading-relaxed font-normal">
            {conversation.aiSummary || "No summary available"}
          </p>

          {/* Badge */}
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.glowDot || style.dot}`} />
            {conversation.classification}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ConversationList({
  conversations,
  loading,
  selectedId,
  highlightedId,
  onSelect,
  onToggleStar,
  search,
  onSearchChange,
  sourceFilter,
  onSourceFilterChange,
}) {
  const filtered = conversations.filter((c) => {
    if (sourceFilter && sourceFilter !== "All") return c.accountSource === sourceFilter;
    return true;
  });

  return (
    <div className="flex flex-col h-full border-r border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#090D16] transition-colors duration-200">
      {/* Search & filter bar */}
      <div className="px-3 py-3 border-b border-slate-200/90 dark:border-slate-800/80 space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search email threads…"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700/80 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
          />
        </div>
        <div className="flex gap-1.5">
          {["All", "Gmail", "Outlook"].map((src) => (
            <button
              key={src}
              onClick={() => onSourceFilterChange(src)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-full border transition-all ${
                sourceFilter === src
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-xs">
              <MailOpen className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Queue Clear</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              No threads matching the current filter. All items handled or archived.
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <EmailCard
              key={conv._id}
              conversation={conv}
              isSelected={conv._id === selectedId}
              isHighlighted={conv._id === highlightedId}
              onClick={() => onSelect(conv)}
              onToggleStar={onToggleStar}
            />
          ))
        )}
      </div>

      {!loading && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-mono">
            {filtered.length} conversation{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
