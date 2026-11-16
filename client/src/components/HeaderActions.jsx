import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Briefcase,
  ArrowLeft,
  Settings,
  MoreVertical,
  X,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function HeaderActions({
  currentView = "assistant",
  onSwitchView,
  onOpenSimulator,
  onManageAccounts,
  isDark,
  onToggleTheme,
  profile,
  gmailEnabled = true,
  outlookEnabled = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const assistantName = profile?.assistantName || "Priya Sharma";
  const clientName = profile?.clientName || "Arjun Mehta";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 ml-auto" ref={menuRef}>
      {/* ── DESKTOP BUTTONS (Visible on lg and above) ── */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Simulate Incoming Email */}
        <button
          onClick={onOpenSimulator}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/90 dark:border-indigo-800/80 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Simulate Incoming Email</span>
        </button>

        {/* View Switcher Button */}
        {currentView === "assistant" ? (
          <button
            onClick={onSwitchView}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/80 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/60 transition shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Executive View</span>
          </button>
        ) : (
          <button
            onClick={onSwitchView}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Assistant Dashboard</span>
          </button>
        )}

        {/* Profile Pill */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 shadow-2xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{assistantName}</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-[11px]">PA for {clientName}</span>
        </div>

        {/* Dark Mode Toggle */}
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

        {/* Manage Accounts */}
        <button
          onClick={onManageAccounts}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Manage Accounts</span>
        </button>
      </div>

      {/* ── TABLET & MOBILE COMPACT CONTROLS (< lg) ── */}
      <div className="flex lg:hidden items-center gap-1.5">
        {/* Quick Simulator Icon Button */}
        <button
          onClick={onOpenSimulator}
          type="button"
          title="Simulate Incoming Email"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Simulate</span>
        </button>

        {/* Quick View Toggle */}
        <button
          onClick={onSwitchView}
          type="button"
          title={currentView === "assistant" ? "Switch to Executive View" : "Back to Assistant"}
          className={`p-1.5 rounded-xl border transition ${
            currentView === "assistant"
              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
          }`}
        >
          {currentView === "assistant" ? (
            <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

        {/* Responsive Overflow Dropdown Menu Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          aria-label="More actions"
          className={`p-1.5 rounded-xl border transition ${
            menuOpen
              ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* ── RESPONSIVE COMPACT MENU POPUP ── */}
      {menuOpen && (
        <div className="absolute right-4 top-14 mt-1 w-72 bg-white dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 space-y-2 animate-slide-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                PA
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{assistantName}</p>
                <p className="text-[10px] text-slate-400">Assistant for {clientName}</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sync Statuses */}
          <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1.5 text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Connections</p>
            {gmailEnabled && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ backgroundColor: "#1A73E8" }}>
                    <Mail className="w-2.5 h-2.5 text-white" />
                  </span>
                  Gmail
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Synced
                </span>
              </div>
            )}
            {outlookEnabled && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-3.5 h-3.5 rounded flex items-center justify-center bg-blue-600">
                    <Mail className="w-2.5 h-2.5 text-white" />
                  </span>
                  Outlook
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Synced
                </span>
              </div>
            )}
          </div>

          {/* Actions List */}
          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSimulator();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Simulate Incoming Email</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onSwitchView();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentView === "assistant" ? "Switch to Executive View" : "Back to Assistant"}</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onManageAccounts();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Manage Accounts &amp; OAuth</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
