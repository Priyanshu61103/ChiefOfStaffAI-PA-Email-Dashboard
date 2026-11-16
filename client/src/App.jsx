import { useState, useEffect } from "react";
import OnboardingModal from "./components/OnboardingModal";
import AssistantDashboard from "./components/AssistantDashboard";
import ClientExecutiveView from "./components/ClientExecutiveView";
import IncomingEmailModal from "./components/IncomingEmailModal";
import { ToastContainer, useToast } from "./components/Toast";
import { useDarkMode } from "./hooks/useDarkMode";
import { useConversations } from "./hooks/useConversations";

const STORAGE_KEY = "pa_dashboard_profile";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [viewMode, setViewMode] = useState("assistant"); // "assistant" | "executive"
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  const [isDark, setIsDark] = useDarkMode();
  const { toasts, toast, dismiss } = useToast();
  const { conversations, loading, refetch, setConversations } = useConversations();

  useEffect(() => {
    // Initial theme check
    const storedTheme = localStorage.getItem("pa_theme");
    if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
        setShowOnboarding(false);
      } catch {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
    setAppReady(true);
  }, []);

  const handleOnboardingComplete = (profileData) => {
    setProfile(profileData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    setShowOnboarding(false);
  };

  const handleManageAccounts = () => {
    setShowOnboarding(true);
  };

  const handleEmailAdded = (newConv) => {
    setConversations((prev) => [newConv, ...prev.filter((c) => c._id !== newConv._id)]);
    setHighlightedId(newConv._id);
    setTimeout(() => {
      setHighlightedId(null);
    }, 5000);
  };

  const handleUpdateConversation = (updated) => {
    setConversations((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  if (!appReady) {
    return (
      <div className="h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading ChiefOfStaff AI…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#F8FAFC] dark:bg-[#090D16] min-h-screen text-slate-900 dark:text-slate-100 obsidian-glow">
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={handleOnboardingComplete}
          initialData={profile || {}}
        />
      )}

      {/* Incoming Email Simulator Modal */}
      <IncomingEmailModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onEmailAdded={handleEmailAdded}
        toast={toast}
      />

      {/* Main Views */}
      {profile && !showOnboarding && viewMode === "assistant" && (
        <AssistantDashboard
          profile={profile}
          conversations={conversations}
          setConversations={setConversations}
          loading={loading}
          highlightedId={highlightedId}
          onManageAccounts={handleManageAccounts}
          onSwitchToExecutive={() => setViewMode("executive")}
          onOpenSimulator={() => setSimulatorOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
          toast={toast}
        />
      )}

      {profile && !showOnboarding && viewMode === "executive" && (
        <ClientExecutiveView
          conversations={conversations}
          onUpdateConversation={handleUpdateConversation}
          onBackToAssistant={() => setViewMode("assistant")}
          onOpenSimulator={() => setSimulatorOpen(true)}
          profile={profile}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
          toast={toast}
        />
      )}

      {!profile && !showOnboarding && (
        <div className="h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center">
          <button
            onClick={() => setShowOnboarding(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
