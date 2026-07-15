"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "add-product-draft:";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Debounced autosave to localStorage. Only serializable values should be
 * passed in (strip File objects / object URLs before calling this).
 */
export function useAutosaveDraft<T>(
  draftKey: string,
  values: T,
  options: { delay?: number; enabled?: boolean } = {},
) {
  const { delay = 1500, enabled = true } = options;
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_PREFIX + draftKey,
          JSON.stringify(values),
        );
        setStatus("saved");
        setLastSavedAt(new Date());
      } catch {
        setStatus("error");
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), enabled, delay, draftKey]);

  const loadDraft = (): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + draftKey);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  };

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_PREFIX + draftKey);
  };

  return { status, lastSavedAt, loadDraft, clearDraft };
}
