"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (input: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function getIcon(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-rose-600" />;
    default:
      return <Info className="h-5 w-5 text-sky-600" />;
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (input: Omit<ToastItem, "id">) => {
      const id = Date.now() + Math.round(Math.random() * 1000);
      setToasts((current) => [...current, { ...input, id }]);
      window.setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  const success = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "success" });
    },
    [toast],
  );

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "error" });
    },
    [toast],
  );

  const info = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "info" });
    },
    [toast],
  );

  const value = useMemo(
    () => ({ toasts, toast, success, error, info, dismiss }),
    [toasts, toast, success, error, info, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-120 flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className="rounded-xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(toastItem.variant)}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {toastItem.title}
                </p>
                {toastItem.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {toastItem.description}
                  </p>
                ) : null}
              </div>
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => dismiss(toastItem.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
