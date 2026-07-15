"use client";

import { type ReactNode, useState, type KeyboardEvent } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Specification } from "@/lib/schemas/product-schema";

/* ------------------------------------------------------------------ */
/*  Field — label + required marker + error + hint                     */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-[12px] text-slate-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tag input — press Enter or comma to add, click x to remove         */
/* ------------------------------------------------------------------ */

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter...",
  maxTags,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    if (maxTags && value.length >= maxTags) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full p-0.5 hover:bg-emerald-100"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 border-none bg-transparent py-0.5 text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List input — for key features / applications / benefits            */
/* ------------------------------------------------------------------ */

export function ListInput({
  value,
  onChange,
  placeholder,
  addLabel,
}: {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
          <Input
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[idx] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="h-9 flex-1 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== idx))}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, ""])}
        className="h-8 gap-1.5 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Specification builder — dynamic key/value rows                     */
/* ------------------------------------------------------------------ */

export function SpecificationBuilder({
  value,
  onChange,
}: {
  value: Specification[];
  onChange: (specs: Specification[]) => void;
}) {
  const addRow = () =>
    onChange([
      ...value,
      { id: `spec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, key: "", value: "" },
    ]);

  const updateRow = (id: string, field: "key" | "value", val: string) =>
    onChange(value.map((s) => (s.id === id ? { ...s, [field]: val } : s)));

  const removeRow = (id: string) => onChange(value.filter((s) => s.id !== id));

  return (
    <div className="space-y-2.5">
      {value.length > 0 && (
        <div className="hidden grid-cols-[1fr_1fr_32px] gap-2.5 px-1 sm:grid">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Attribute
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Value
          </span>
          <span />
        </div>
      )}
      {value.map((spec) => (
        <div key={spec.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_32px] sm:gap-2.5">
          <Input
            value={spec.key}
            onChange={(e) => updateRow(spec.id, "key", e.target.value)}
            placeholder="e.g. Material"
            className="h-9 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
          <Input
            value={spec.value}
            onChange={(e) => updateRow(spec.id, "value", e.target.value)}
            placeholder="e.g. Stainless Steel"
            className="h-9 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
          <button
            type="button"
            onClick={() => removeRow(spec.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center justify-self-start rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 sm:justify-self-auto"
            aria-label="Remove specification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="h-8 gap-1.5 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Specification
      </Button>
    </div>
  );
}
