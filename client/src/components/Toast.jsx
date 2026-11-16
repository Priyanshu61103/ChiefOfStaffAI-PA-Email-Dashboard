import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  error: <XCircle className="w-4 h-4 text-pink-500" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
};

function Toast({ id, type = "info", message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  const borderColors = {
    success: "border-l-emerald-500",
    error: "border-l-pink-500",
    warning: "border-l-amber-500",
    info: "border-l-blue-500",
  };

  return (
    <div
      className={`flex items-start gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 ${borderColors[type]} rounded-lg shadow-lg px-4 py-3 min-w-[280px] max-w-sm animate-slide-in`}
    >
      <span className="mt-0.5 shrink-0">{ICONS[type]}</span>
      <p className="text-sm text-slate-700 dark:text-slate-200 flex-1 leading-snug">{message}</p>
      <button onClick={() => onDismiss(id)} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, toast: addToast, dismiss };
}
