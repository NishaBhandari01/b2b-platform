"use client";

import { AuthProvider } from "@/lib/hooks/useAuth";
import { ToastProvider } from "@/lib/hooks/useToast";
import { Analytics } from "@vercel/analytics/next";
import { ReactNode } from "react";

export function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </ToastProvider>
    </AuthProvider>
  );
}
