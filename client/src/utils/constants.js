export const CLASSIFICATION_STYLES = {
  "Assistant to Reply": {
    bg: "bg-indigo-50/70 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/80 dark:border-indigo-800/60",
    dot: "bg-indigo-500",
    glowDot: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]",
    badge: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm",
  },
  "Client to Reply": {
    bg: "bg-amber-50/70 dark:bg-amber-950/30",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200/80 dark:border-amber-800/60",
    dot: "bg-amber-500",
    glowDot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    badge: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 shadow-sm",
  },
  "Needs Review": {
    bg: "bg-purple-50/70 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200/80 dark:border-purple-800/60",
    dot: "bg-purple-500",
    glowDot: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]",
    badge: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 shadow-sm",
  },
  "No Reply Needed": {
    bg: "bg-slate-100/70 dark:bg-slate-800/50",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-200/80 dark:border-slate-700/60",
    dot: "bg-slate-400 dark:bg-slate-500",
    glowDot: "bg-slate-400 dark:bg-slate-500 shadow-[0_0_6px_rgba(148,163,184,0.4)]",
    badge: "bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-sm",
  },
};

export const SEGMENT_STYLES = {
  "Action Required": "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  "Waiting for Response": "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  "Meetings & Appointments": "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  Important: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  General: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export const CLASSIFICATIONS = [
  "Assistant to Reply",
  "Client to Reply",
  "No Reply Needed",
  "Needs Review",
];

export const SEGMENTS = [
  "Action Required",
  "Waiting for Response",
  "Meetings & Appointments",
  "Important",
  "General",
];

export function relativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTimestamp(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
