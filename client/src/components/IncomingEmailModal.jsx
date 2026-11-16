import { useState } from "react";
import { X, Sparkles, Send, Loader2, Mail, User, Tag, FileText, AlertCircle } from "lucide-react";
import { createIncomingEmail } from "../hooks/useConversations";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PRESETS = [
  {
    id: "investor",
    label: "Investor Term Sheet",
    tag: "Client to Reply",
    tagColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    data: {
      senderName: "Marcus Vance",
      senderEmail: "mvance@vancepartners.vc",
      subject: "Urgent: Series A Term Sheet Review & Founder Governance",
      accountSource: "Gmail",
      body: "Hi Arjun,\n\nFollowing up on our partner meeting yesterday. Attached is the revised Series A term sheet with a $35M pre-money valuation cap.\n\nOur investment committee requires your personal sign-off on the 1x non-participating liquidation preference and founder vesting acceleration clauses before this Friday at 5:00 PM PST.\n\nCould we schedule a direct 15-minute call tomorrow afternoon to finalize terms?\n\nBest,\nMarcus Vance\nManaging Partner, Vance Partners",
    },
  },
  {
    id: "vendor",
    label: "Vendor Meeting",
    tag: "Assistant to Reply",
    tagColor: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    data: {
      senderName: "Claire Dupont",
      senderEmail: "claire@lemeridienevents.com",
      subject: "Rescheduling Vendor Planning Walkthrough - Le Meridien",
      accountSource: "Outlook",
      body: "Hi Priya,\n\nCould we please reschedule our private dining room and AV equipment walkthrough for the upcoming executive summit from this Thursday to next Tuesday at 2:00 PM EST?\n\nPlease confirm if that time slot aligns with the team's calendar so we can lock in the catering coordinators.\n\nWarm regards,\nClaire Dupont\nSenior Event Director, Le Meridien",
    },
  },
  {
    id: "ambiguous",
    label: "Ambiguous / Low Confidence",
    tag: "Needs Review",
    tagColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    data: {
      senderName: "Arthur Pendelton",
      senderEmail: "arthur.pendelton@meridian-ventures-group.co.uk",
      subject: "Quick catch up regarding that thing soon",
      accountSource: "Gmail",
      body: "Hey Arjun,\n\nGreat briefly crossing paths in London last month near Mayfair. Wondering if you or someone on your team has 10 minutes soon to chat about potential synergies and that idea we touched on.\n\nLet me know what your week looks like or if you'll be around next month.\n\nCheers,\nArthur",
    },
  },
];

export default function IncomingEmailModal({ isOpen, onClose, onEmailAdded, toast }) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    accountSource: "Gmail",
    body: "",
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setFormData({ ...preset.data });
    setTouched({});
  };

  const isEmailValid = EMAIL_REGEX.test(formData.senderEmail.trim());
  const isNameValid = formData.senderName.trim().length > 0;
  const isSubjectValid = formData.subject.trim().length > 0;
  const isBodyValid = formData.body.trim().length > 0;
  const isFormValid = isEmailValid && isNameValid && isSubjectValid && isBodyValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNameValid) {
      toast("Please enter the sender's full name", "warning");
      return;
    }
    if (!isEmailValid) {
      toast("Please enter a valid email address (e.g. name@domain.com)", "warning");
      return;
    }
    if (!isSubjectValid) {
      toast("Subject line is required", "warning");
      return;
    }
    if (!isBodyValid) {
      toast("Email thread body cannot be empty", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const newConversation = await createIncomingEmail({
        senderName: formData.senderName.trim(),
        senderEmail: formData.senderEmail.trim(),
        subject: formData.subject.trim(),
        accountSource: formData.accountSource,
        body: formData.body.trim(),
      });
      toast(
        `Triaged as "${newConversation.classification}" (${Math.round(
          (newConversation.confidenceScore || 0) * 100
        )}% confidence)`,
        "success"
      );
      onEmailAdded(newConversation);
      onClose();
    } catch (err) {
      console.error("Failed to simulate incoming email:", err);
      toast("Failed to process incoming email via Groq", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#090D16] rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden my-8 animate-slide-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Live Incoming Email Simulator</h3>
              <p className="text-xs text-indigo-100">
                Trigger real-time Chief of Staff AI triage &amp; drafting via Groq
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Strip */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Quick-Fill Test Presets:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                  activePreset === preset.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
              >
                <span>{preset.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${preset.tagColor}`}>
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sender Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.senderName}
                  onBlur={() => setTouched((t) => ({ ...t, senderName: true }))}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              {touched.senderName && !isNameValid && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Name is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sender Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.senderEmail}
                  onBlur={() => setTouched((t) => ({ ...t, senderEmail: true }))}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  placeholder="e.g. mvance@vancepartners.vc"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              {touched.senderEmail && !isEmailValid && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Enter a valid email address
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Series A Term Sheet Discussion"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              {touched.subject && !isSubjectValid && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Subject is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Source
              </label>
              <select
                value={formData.accountSource}
                onChange={(e) => setFormData({ ...formData, accountSource: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Gmail">Gmail (arjun@mehtaventures.com)</option>
                <option value="Outlook">Outlook (arjun.mehta@board-advisory.com)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Body <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                required
                rows={6}
                value={formData.body}
                onBlur={() => setTouched((t) => ({ ...t, body: true }))}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Paste or write email thread body…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-mono text-xs sm:text-sm transition"
              />
            </div>
            {touched.body && !isBodyValid && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Email body is required
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Groq structured JSON schema output enabled
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Running AI Triage (Groq)...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Run Live AI Triage &amp; Add to Inbox</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
