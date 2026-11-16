import { useState, useEffect } from "react";
import {
  User,
  Mail,
  CheckCircle2,
  Loader2,
  Shield,
  Zap,
  AlertCircle,
} from "lucide-react";

const STEPS = ["Your Details", "Connect Accounts", "Syncing"];

function ProgressBar({ value }) {
  return (
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
              i < current
                ? "bg-indigo-600 text-white"
                : i === current
                ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400 dark:ring-indigo-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
            }`}
          >
            {i < current ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span
            className={`text-xs font-semibold ${
              i === current ? "text-indigo-700 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function OAuthToggle({ label, email, icon: Icon, color, enabled, onToggle, customStyle }) {
  return (
    <div
      className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
        enabled
          ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/70 dark:bg-indigo-950/30 shadow-2xs"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-2xs ${color || ""}`}
            style={customStyle}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
          </div>
        </div>
        <div
          className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
            enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-200 ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
      </div>
      {enabled && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Read messages", "Classify threads", "Draft replies"].map((p) => (
            <span
              key={p}
              className="text-[11px] bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800"
            >
              ✓ {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnboardingModal({ onComplete, initialData = {} }) {
  const [step, setStep] = useState(0);
  const [assistantName, setAssistantName] = useState(
    initialData.assistantName || "Priya Sharma"
  );
  const [clientName, setClientName] = useState(
    initialData.clientName || "Arjun Mehta"
  );
  const [gmailEnabled, setGmailEnabled] = useState(true);
  const [outlookEnabled, setOutlookEnabled] = useState(true);
  const [syncProgress, setSyncProgress] = useState(0);

  const isStep0Valid = assistantName.trim().length > 0 && clientName.trim().length > 0;

  useEffect(() => {
    if (step === 2) {
      const steps = [15, 35, 55, 72, 88, 100];
      let i = 0;
      const interval = setInterval(() => {
        if (i < steps.length) {
          setSyncProgress(steps[i]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete({
              assistantName: assistantName.trim() || "Priya Sharma",
              clientName: clientName.trim() || "Arjun Mehta",
              gmailEnabled,
              outlookEnabled,
            });
          }, 600);
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step, assistantName, clientName, gmailEnabled, outlookEnabled, onComplete]);

  const syncMessages = [
    "Authenticating with Google Workspace...",
    "Fetching thread index...",
    "Authenticating with Microsoft 365...",
    "Syncing Outlook threads...",
    "Running AI classification...",
    "All accounts synced!",
  ];
  const syncMsgIndex = Math.min(
    Math.floor(syncProgress / 17),
    syncMessages.length - 1
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#090D16] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/90 dark:border-slate-800 animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">ChiefOfStaff AI</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {step === 0 && "Welcome! Let's set up your PA workspace."}
            {step === 1 && "Connect your email accounts."}
            {step === 2 && "Syncing your inbox…"}
          </h2>
          <p className="text-indigo-200 text-sm">
            {step === 0 && "Your AI-powered Chief of Staff for executive email management."}
            {step === 1 && "Grant access so your AI assistant can classify and draft replies."}
            {step === 2 && "This takes just a moment. Hang tight."}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-6 bg-white dark:bg-slate-900/90">
          <StepIndicator current={step} />

          {/* Step 0 - Names */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Assistant Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
                {!assistantName.trim() && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Assistant name cannot be blank
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Executive Client Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g. Arjun Mehta"
                  />
                </div>
                {!clientName.trim() && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Executive client name cannot be blank
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 1 - OAuth */}
          {step === 1 && (
            <div className="space-y-3">
              <OAuthToggle
                label="Gmail"
                email="arjun@mehtaventures.com"
                icon={Mail}
                customStyle={{ backgroundColor: "#1A73E8" }}
                enabled={gmailEnabled}
                onToggle={() => setGmailEnabled((v) => !v)}
              />
              <OAuthToggle
                label="Outlook"
                email="arjun.mehta@board-advisory.com"
                icon={Mail}
                color="bg-blue-600"
                enabled={outlookEnabled}
                onToggle={() => setOutlookEnabled((v) => !v)}
              />
              {/* Transparency badge */}
              <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mt-2">
                <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Prototype Mode:</span>{" "}
                  Inbox sync uses simulated sample data; AI classification &amp; drafting run live on Groq.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 - Sync progress */}
          {step === 2 && (
            <div className="space-y-5">
              <ProgressBar value={syncProgress} />
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                {syncProgress < 100 ? (
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                <span>{syncMessages[syncMsgIndex]}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {gmailEnabled && (
                  <div className={`border rounded-xl p-3 text-center transition-all ${syncProgress >= 50 ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"}`}>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Gmail</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">arjun@mehtaventures.com</p>
                    {syncProgress >= 50 ? (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">● Synced</span>
                    ) : (
                      <span className="inline-block mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">Syncing…</span>
                    )}
                  </div>
                )}
                {outlookEnabled && (
                  <div className={`border rounded-xl p-3 text-center transition-all ${syncProgress >= 85 ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"}`}>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Outlook</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">arjun.mehta@board-advisory.com</p>
                    {syncProgress >= 85 ? (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">● Synced</span>
                    ) : (
                      <span className="inline-block mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">Syncing…</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer buttons */}
          {step < 2 && (
            <div className="flex justify-end gap-3 mt-6">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 1) setStep(2);
                  else setStep((s) => s + 1);
                }}
                disabled={(step === 0 && !isStep0Valid) || (step === 1 && !gmailEnabled && !outlookEnabled)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                {step === 0 ? "Next →" : "Connect & Sync"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
