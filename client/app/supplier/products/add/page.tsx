"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Save,
  Rocket,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Stepper } from "@/components/add-product/stepper";
import { StepBasicInfo } from "@/components/add-product/steps/step-basic-info";
import { StepMedia } from "@/components/add-product/steps/step-media";
import { StepDescription } from "@/components/add-product/steps/step-description";
import { StepPricing } from "@/components/add-product/steps/step-pricing";
import { StepSpecifications } from "@/components/add-product/steps/step-specifications";
import { StepShipping } from "@/components/add-product/steps/step-shipping";
import { StepCertifications } from "@/components/add-product/steps/step-certifications";
import { StepDocuments } from "@/components/add-product/steps/step-documents";
import { StepSeo } from "@/components/add-product/steps/step-seo";
import { StepReview } from "@/components/add-product/steps/step-review";

import { useAutosaveDraft } from "../../../../lib/hooks/use-autosave-draft";
import { useUnsavedChangesWarning } from "../../../../lib/hooks/use-unsaved-changes-warning";

import {
  defaultProductFormValues,
  stepSchemas,
  STEP_META,
  type FullFormValues,
} from "@/lib/schemas/product-schema";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const TOTAL_STEPS = STEP_META.length;

async function publishProduct(payload: unknown, status: "draft" | "active") {
  const res = await fetch(`${API_BASE}/api/supplier/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...(payload as object), status }),
  });
  if (!res.ok) throw new Error("Failed to save product");
  return res.json();
}

export default function AddProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false);

  const methods = useForm<FullFormValues>({
    defaultValues: {
      ...defaultProductFormValues(),
      mainImage: [],
      additionalImages: [],
      videoUrl: "",
      certificationFiles: {},
      documents: {},
    } as FullFormValues,
    mode: "onChange",
  });

  const { getValues, setError, clearErrors, formState, watch } = methods;
  const { isDirty } = formState;

  /* -------------------------- initial load -------------------------- */
  useEffect(() => {
    const t = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(t);
  }, []);

  /* -------------------------- autosave -------------------------- */
  const watchedValues = watch();
  const serializableSnapshot = useMemo(() => {
    // Strip File objects / object URLs — keep names/metadata so the draft banner
    // can say "3 images, 2 documents" without trying to persist blobs.
    const { mainImage, additionalImages, ...rest } = watchedValues;
    return {
      ...rest,
      mainImageCount: mainImage?.length ?? 0,
      additionalImageCount: additionalImages?.length ?? 0,
    };
  }, [watchedValues]);

  const {
    status: autosaveStatus,
    lastSavedAt,
    loadDraft,
    clearDraft,
  } = useAutosaveDraft("supplier-add-product", serializableSnapshot, {
    enabled: !isInitializing,
  });

  useUnsavedChangesWarning(isDirty);

  const [hasStoredDraft, setHasStoredDraft] = useState(false);
  useEffect(() => {
    setHasStoredDraft(!!loadDraft());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------- validation -------------------------- */
  async function validateStep(step: number): Promise<boolean> {
    const schema = stepSchemas[step - 1];

    if (step === 2) {
      const mainImage = getValues("mainImage");
      if (!mainImage || mainImage.length === 0) {
        setError("mainImage" as any, {
          type: "manual",
          message: "Upload a main product image",
        });
        return false;
      }
      clearErrors("mainImage" as any);
      return true;
    }

    if (!schema) return true; // steps 8 & 10 have no required schema

    const values = getValues();
    const result = schema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path.join(".") as any, {
          type: "manual",
          message: issue.message,
        });
      });
      return false;
    }
    return true;
  }

  async function validateAllSteps(): Promise<number | null> {
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const valid = await validateStep(step);
      if (!valid) return step;
    }
    return null;
  }

  /* -------------------------- navigation -------------------------- */
  async function goNext() {
    const valid = await validateStep(currentStep);
    if (!valid) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* -------------------------- mutations -------------------------- */
  const saveMutation = useMutation({
    mutationFn: (status: "draft" | "active") =>
      publishProduct(getValues(), status),
    onSuccess: (_data, status) => {
      clearDraft();
      toast.success(status === "draft" ? "Draft saved" : "Product published", {
        description:
          status === "draft"
            ? "You can find it under Draft Products and finish it anytime."
            : "Your product is now live in the marketplace.",
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "We couldn't save this product. Please try again.",
      });
    },
  });

  async function handleSaveDraft() {
    saveMutation.mutate("draft");
  }

  async function handlePublish() {
    const invalidStep = await validateAllSteps();
    if (invalidStep) {
      toast.error("A few required fields need attention", {
        description: `Check ${STEP_META[invalidStep - 1].title} (step ${invalidStep}).`,
      });
      goToStep(invalidStep);
      return;
    }
    saveMutation.mutate("active");
  }

  const isLastStep = currentStep === TOTAL_STEPS;
  const isSaving = saveMutation.isPending;

  if (isInitializing) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add Product
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Complete all steps to publish a product buyers can request quotes
              on.
            </p>
          </div>
          <AutosaveIndicator
            status={autosaveStatus}
            lastSavedAt={lastSavedAt}
          />
        </div>

        {/* Resume draft banner */}
        {hasStoredDraft && !draftBannerDismissed && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-[13px] font-medium text-emerald-800">
              You have an unsaved draft from a previous session.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-emerald-300 bg-white text-[12px] text-emerald-700 hover:bg-emerald-100"
                onClick={() => {
                  clearDraft();
                  setDraftBannerDismissed(true);
                }}
              >
                Discard
              </Button>
              <button
                onClick={() => setDraftBannerDismissed(true)}
                className="rounded-full p-1 text-emerald-600 hover:bg-emerald-100"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start"
          >
            <Stepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />

            <div className="min-w-0 flex-1">
              {currentStep === 1 && <StepBasicInfo />}
              {currentStep === 2 && <StepMedia />}
              {currentStep === 3 && <StepDescription />}
              {currentStep === 4 && <StepPricing />}
              {currentStep === 5 && <StepSpecifications />}
              {currentStep === 6 && <StepShipping />}
              {currentStep === 7 && <StepCertifications />}
              {currentStep === 8 && <StepDocuments />}
              {currentStep === 9 && <StepSeo />}
              {currentStep === 10 && <StepReview onEditStep={goToStep} />}

              {/* Footer actions */}
              <div className="sticky bottom-4 mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 1}
                  className="h-10 gap-1.5 border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="h-10 gap-1.5 border-slate-200 text-sm font-semibold text-slate-600"
                  >
                    {isSaving && saveMutation.variables === "draft" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Draft
                  </Button>

                  {isLastStep && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPreviewOpen(true)}
                      className="h-10 gap-1.5 border-slate-200 text-sm font-semibold text-slate-600"
                    >
                      <Eye className="h-4 w-4" />
                      Preview Product
                    </Button>
                  )}

                  {isLastStep ? (
                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={isSaving}
                      className="h-10 gap-1.5 bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
                    >
                      {isSaving && saveMutation.variables === "active" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="h-4 w-4" />
                      )}
                      Publish Product
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={goNext}
                      className="h-10 gap-1.5 bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>

          <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} />
        </FormProvider>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Autosave indicator                                                  */
/* ------------------------------------------------------------------ */

function AutosaveIndicator({
  status,
  lastSavedAt,
}: {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
}) {
  if (status === "idle") return null;
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
      {status === "saving" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving draft...
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Draft saved
          {lastSavedAt ? ` at ${lastSavedAt.toLocaleTimeString()}` : ""}
        </>
      )}
      {status === "error" && (
        <span className="text-rose-500">Couldn't save draft locally</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview dialog — buyer-facing snapshot                              */
/* ------------------------------------------------------------------ */

function PreviewDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Preview as Buyer</DialogTitle>
        </DialogHeader>
        <PreviewBody />
      </DialogContent>
    </Dialog>
  );
}

function PreviewBody() {
  const { watch } = useFormContext<FullFormValues>();
  const values = watch();
  const mainImg = values.mainImage?.[0];

  const priceDisplay =
    values.priceType === "fixed"
      ? `${values.currency} ${values.price ?? "—"} / ${values.unit || "unit"}`
      : values.priceType === "range"
        ? `${values.currency} ${values.minPrice ?? "—"} – ${values.maxPrice ?? "—"} / ${values.unit || "unit"}`
        : "Request for Quotation";

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="aspect-video w-full bg-slate-100">
          {mainImg ? (
            <img
              src={mainImg.url}
              alt={values.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
              No main image uploaded
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600">
            {values.category || "Uncategorized"}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-slate-900">
            {values.productName || "Untitled product"}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] text-slate-500">
            {values.shortDescription || "No short description yet."}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-100 pt-3">
            <span className="text-[15px] font-bold text-slate-900">
              {priceDisplay}
            </span>
            <span className="text-[12px] text-slate-400">
              MOQ {values.moq ?? "—"} {values.moqUnit ?? ""}
            </span>
          </div>
          {(values.tags?.length ?? 0) > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {values.tags!.slice(0, 5).map((tag: any) => (
                <span
                  key={tag}
                  className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-[12px] text-slate-400">
        This is a simplified preview. The published listing will also show your
        full description, specifications, and documents.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton — shown briefly on initial mount                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-[1400px] animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-7 w-48 rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-80 rounded-lg bg-slate-100" />
        <div className="mt-6 flex gap-6">
          <div className="hidden w-64 shrink-0 space-y-2 lg:block">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100" />
            ))}
          </div>
          <div className="flex-1 space-y-5">
            <div className="h-64 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100" />
            <div className="h-40 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
