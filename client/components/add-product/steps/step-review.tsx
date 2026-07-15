"use client";

import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import {
  CheckCircle2,
  Tag,
  ImageIcon,
  FileText,
  DollarSign,
  ListTree,
  Truck,
  ShieldCheck,
  FileStack,
  Search,
  Pencil,
} from "lucide-react";
import { SectionCard } from "@/components/add-product/form-primitives";
import type { FullFormValues } from "@/lib/schemas/product-schema";

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 text-[13px] last:border-none">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-700">{value}</span>
    </div>
  );
}

function ReviewSection({
  title,
  icon,
  stepNumber,
  onEdit,
  children,
}: {
  title: string;
  icon: ReactNode;
  stepNumber: number;
  onEdit: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          {icon}
          <h4 className="text-[13px] font-semibold">{title}</h4>
        </div>
        <button
          type="button"
          onClick={() => onEdit(stepNumber)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export function StepReview({ onEditStep }: { onEditStep: (step: number) => void }) {
  const { watch } = useFormContext<FullFormValues>();
  const values = watch();

  const priceDisplay =
    values.priceType === "fixed"
      ? `${values.currency} ${values.price ?? "—"} / ${values.unit || "unit"}`
      : values.priceType === "range"
        ? `${values.currency} ${values.minPrice ?? "—"} – ${values.maxPrice ?? "—"} / ${values.unit || "unit"}`
        : "Request for Quotation";

  const mainImg = values.mainImage?.[0];
  const docCount = Object.values(values.documents ?? {}).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <SectionCard
        title="Review & Publish"
        description="Double-check the details below, then save as a draft or publish live."
        icon={<CheckCircle2 className="h-5 w-5" />}
      >
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-200">
            {mainImg ? (
              <img src={mainImg.url} alt={values.productName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-slate-900">
              {values.productName || "Untitled product"}
            </p>
            <p className="text-[13px] text-slate-500">
              {values.category || "No category"}
              {values.subCategory ? ` · ${values.subCategory}` : ""}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-emerald-700">{priceDisplay}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReviewSection title="Basic Information" icon={<Tag className="h-4 w-4" />} stepNumber={1} onEdit={onEditStep}>
          <ReviewRow label="Brand" value={values.brand || "—"} />
          <ReviewRow label="Model Number" value={values.modelNumber || "—"} />
          <ReviewRow label="SKU" value={values.sku || "Auto-generated"} />
          <ReviewRow label="Status" value={values.status ?? "—"} />
        </ReviewSection>

        <ReviewSection title="Images & Media" icon={<ImageIcon className="h-4 w-4" />} stepNumber={2} onEdit={onEditStep}>
          <ReviewRow label="Main image" value={mainImg ? "Uploaded" : "Missing"} />
          <ReviewRow label="Additional images" value={`${values.additionalImages?.length ?? 0} uploaded`} />
          <ReviewRow label="Video" value={values.videoUrl || "None"} />
        </ReviewSection>

        <ReviewSection title="Description" icon={<FileText className="h-4 w-4" />} stepNumber={3} onEdit={onEditStep}>
          <ReviewRow label="Key features" value={`${values.keyFeatures?.length ?? 0} listed`} />
          <ReviewRow label="Applications" value={`${values.applications?.length ?? 0} listed`} />
          <ReviewRow label="Benefits" value={`${values.benefits?.length ?? 0} listed`} />
        </ReviewSection>

        <ReviewSection title="Pricing & Inventory" icon={<DollarSign className="h-4 w-4" />} stepNumber={4} onEdit={onEditStep}>
          <ReviewRow label="Price" value={priceDisplay} />
          <ReviewRow label="MOQ" value={`${values.moq ?? "—"} ${values.moqUnit ?? ""}`} />
          <ReviewRow label="Stock" value={`${values.stock ?? "—"} ${values.stockUnit ?? ""}`} />
        </ReviewSection>

        <ReviewSection title="Specifications" icon={<ListTree className="h-4 w-4" />} stepNumber={5} onEdit={onEditStep}>
          <ReviewRow label="Attributes" value={`${values.specifications?.length ?? 0} added`} />
        </ReviewSection>

        <ReviewSection title="Shipping & Manufacturing" icon={<Truck className="h-4 w-4" />} stepNumber={6} onEdit={onEditStep}>
          <ReviewRow label="Origin" value={values.countryOfOrigin || "—"} />
          <ReviewRow label="Dispatch time" value={values.dispatchTime || "—"} />
          <ReviewRow label="Delivery terms" value={(values.deliveryTerms ?? []).join(", ") || "—"} />
        </ReviewSection>

        <ReviewSection title="Certifications" icon={<ShieldCheck className="h-4 w-4" />} stepNumber={7} onEdit={onEditStep}>
          <ReviewRow label="Selected" value={(values.certifications ?? []).join(", ") || "None"} />
        </ReviewSection>

        <ReviewSection title="Documents" icon={<FileStack className="h-4 w-4" />} stepNumber={8} onEdit={onEditStep}>
          <ReviewRow label="Uploaded" value={`${docCount} of 5`} />
        </ReviewSection>

        <ReviewSection title="SEO & Tags" icon={<Search className="h-4 w-4" />} stepNumber={9} onEdit={onEditStep}>
          <ReviewRow label="Tags" value={(values.tags ?? []).join(", ") || "—"} />
          <ReviewRow label="Meta title" value={values.metaTitle || "—"} />
        </ReviewSection>
      </div>
    </div>
  );
}
