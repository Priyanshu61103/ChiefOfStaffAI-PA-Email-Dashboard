import {
  Mail,
  Inbox,
  Star,
  Clock,
  Calendar,
  Archive,
  MessageSquare,
  AlertCircle,
  EyeOff,
  CheckCircle2,
  X,
} from "lucide-react";
import { CLASSIFICATION_STYLES } from "../utils/constants";

const NAV_ITEMS = [
  { key: "all", label: "All Inbox", icon: Inbox, filterKey: null },
  { key: "assistant", label: "Assistant to Reply", icon: Mail, filterKey: "classification", filterValue: "Assistant to Reply" },
  { key: "client", label: "Client to Reply", icon: MessageSquare, filterKey: "classification", filterValue: "Client to Reply" },
  { key: "review", label: "Needs Review", icon: AlertCircle, filterKey: "classification", filterValue: "Needs Review" },
  { key: "noreply", label: "No Reply Needed", icon: EyeOff, filterKey: "classification", filterValue: "No Reply Needed" },
  { key: "divider1", divider: true },
  { key: "action", label: "Action Required", icon: Clock, filterKey: "segment", filterValue: "Action Required" },
  { key: "waiting", label: "Waiting for Response", icon: Clock, filterKey: "segment", filterValue: "Waiting for Response" },
  { key: "meetings", label: "Meetings & Appointments", icon: Calendar, filterKey: "segment", filterValue: "Meetings & Appointments" },
  { key: "divider2", divider: true },
  { key: "important", label: "Important", icon: Star, filterKey: "isImportant", filterValue: true },
  { key: "completed", label: "Completed", icon: CheckCircle2, filterKey: "status", filterValue: "Completed" },
  { key: "archived", label: "Archived", icon: Archive, filterKey: "status", filterValue: "Archived" },
];

function countForItem(item, conversations) {
  if (!conversations || !Array.isArray(conversations)) return 0;

  // Dedicated status views count directly for their status
  if (item.filterKey === "status") {
    return conversations.filter((c) => c.status === item.filterValue).length;
  }

  // All active queues ONLY count conversations that are NOT Completed and NOT Archived
  const activeConvs = conversations.filter(
    (c) => c.status !== "Completed" && c.status !== "Archived"
  );

  if (item.filterKey === null) {
    return activeConvs.length;
  }
  if (item.filterKey === "isImportant") {
    return activeConvs.filter((c) => c.isImportant).length;
  }
  return activeConvs.filter((c) => c[item.filterKey] === item.filterValue).length;
}

export default function Sidebar({ activeFilter, onFilterChange, conversations, isMobileOpen, onMobileClose }) {
  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-40 lg:z-auto w-64 bg-white dark:bg-[#090D16] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col transition-all duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Navigation</span>
          <button onClick={onMobileClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map((item) => {
            if (item.divider) {
              return <div key={item.key} className="my-2 mx-2 border-t border-slate-100 dark:border-slate-800/80" />;
            }
            const isActive =
              item.filterKey === null
                ? activeFilter.filterKey === null
                : activeFilter.filterKey === item.filterKey &&
                  activeFilter.filterValue === item.filterValue;
            const count = countForItem(item, conversations);
            const style =
              item.filterKey === "classification"
                ? CLASSIFICATION_STYLES[item.filterValue]
                : null;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onFilterChange(
                    item.filterKey === null
                      ? { filterKey: null }
                      : { filterKey: item.filterKey, filterValue: item.filterValue }
                  );
                  onMobileClose?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all mb-0.5 group ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-200/60 dark:border-indigo-800/60"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  {style?.dot ? (
                    <span className={`w-2 h-2 rounded-full ${style.glowDot || style.dot} shrink-0`} />
                  ) : item.key === "completed" ? (
                    <item.icon className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <item.icon className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span className="truncate">{item.label}</span>
                </span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.2 rounded-full min-w-[20px] text-center ${
                      isActive
                        ? "bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200"
                        : item.key === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
