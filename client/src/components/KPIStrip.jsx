import { Mail, Inbox, Users, Clock, Calendar, AlertCircle } from "lucide-react";

const CARDS = [
  { key: "total", label: "Total Emails", icon: Inbox, color: "text-slate-700 dark:text-slate-200", bg: "bg-slate-100 dark:bg-slate-800/80", border: "border-slate-300 dark:border-slate-700", filter: null },
  { key: "unread", label: "Unread", icon: Mail, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-300 dark:border-blue-800", filter: { filterKey: "isUnread", filterValue: true } },
  { key: "assistantToReply", label: "Assistant to Reply", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/50", border: "border-indigo-300 dark:border-indigo-800", filter: { filterKey: "classification", filterValue: "Assistant to Reply" } },
  { key: "clientToReply", label: "Client to Reply", icon: AlertCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-300 dark:border-amber-800", filter: { filterKey: "classification", filterValue: "Client to Reply" } },
  { key: "waitingForResponse", label: "Waiting", icon: Clock, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/50", border: "border-sky-300 dark:border-sky-800", filter: { filterKey: "segment", filterValue: "Waiting for Response" } },
  { key: "upcomingMeetings", label: "Upcoming Meetings", icon: Calendar, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/50", border: "border-teal-300 dark:border-teal-800", filter: { filterKey: "segment", filterValue: "Meetings & Appointments" } },
];

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 animate-pulse shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="w-8 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="w-14 h-7 bg-slate-100 dark:bg-slate-800 rounded mb-1" />
      <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
    </div>
  );
}

export default function KPIStrip({ stats, loading, onFilterChange, activeFilter }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#090D16]/90 obsidian-glow">
        {CARDS.map((c) => <SkeletonCard key={c.key} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#090D16]/90 obsidian-glow transition-colors duration-200">
      {CARDS.map((card) => {
        const isActive =
          card.filter === null
            ? activeFilter?.filterKey === null
            : activeFilter?.filterKey === card.filter?.filterKey &&
              activeFilter?.filterValue === card.filter?.filterValue;
        const value = stats?.[card.key] ?? 0;

        return (
          <button
            key={card.key}
            onClick={() => onFilterChange(card.filter || { filterKey: null })}
            className={`bg-white dark:bg-slate-900/90 backdrop-blur-sm border rounded-xl p-3.5 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group ${
              isActive
                ? `${card.border} ring-2 ring-offset-1 ring-indigo-500/80 dark:ring-indigo-500/70 shadow-sm dark:bg-slate-800/80`
                : "border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 ${card.bg} rounded-lg flex items-center justify-center transition-transform group-hover:scale-105`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
              {isActive && (
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Active
                </span>
              )}
            </div>
            <p className={`text-2xl font-bold tracking-tight ${card.color} leading-none mb-1 font-mono`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">{card.label}</p>
          </button>
        );
      })}
    </div>
  );
}
