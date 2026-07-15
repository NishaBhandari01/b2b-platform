"use client";

import { Check } from "lucide-react";
import { STEP_META } from "@/lib/schemas/product-schema";

interface StepperProps {
  currentStep: number; // 1-indexed
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export function Stepper({ currentStep, completedSteps, onStepClick }: StepperProps) {
  return (
    <>
      {/* Desktop: vertical rail */}
      <nav className="hidden w-64 shrink-0 lg:block" aria-label="Add product steps">
        <ol className="relative space-y-0.5">
          {STEP_META.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isDone = completedSteps.has(step.id) && !isActive;
            const isLast = idx === STEP_META.length - 1;
            return (
              <li key={step.id} className="relative">
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isActive ? "bg-emerald-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="relative flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : step.id}
                    </span>
                    {!isLast && (
                      <span
                        className={`mt-1 h-6 w-px ${isDone ? "bg-emerald-300" : "bg-slate-200"}`}
                      />
                    )}
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <p
                      className={`truncate text-[13px] font-semibold ${
                        isActive ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="truncate text-[12px] text-slate-400">
                      {step.description}
                    </p>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile / tablet: horizontal progress */}
      <div className="mb-5 lg:hidden">
        <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
          <span>
            Step {currentStep} of {STEP_META.length}
          </span>
          <span className="text-slate-900">
            {STEP_META[currentStep - 1].title}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${(currentStep / STEP_META.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
