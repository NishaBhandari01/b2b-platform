"use client";

import { useFormContext } from "react-hook-form";
import { FileText, ListChecks, Compass, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field, ListInput, SectionCard } from "@/components/add-product/form-primitives";
import type { ProductFormValues } from "@/lib/schemas/product-schema";

export function StepDescription() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const shortDescription = watch("shortDescription") ?? "";

  return (
    <div className="space-y-5">
      <SectionCard
        title="Description"
        description="Give buyers a clear, scannable picture of the product."
        icon={<FileText className="h-5 w-5" />}
      >
        <div className="space-y-5">
          <Field
            label="Short Description"
            required
            error={errors.shortDescription?.message as string}
            hint={`${shortDescription.length}/220 characters — shown in search results`}
          >
            <Textarea
              {...register("shortDescription")}
              rows={2}
              placeholder="A one- or two-sentence summary buyers see before opening the listing..."
              className="resize-none border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>

          <Field
            label="Detailed Description"
            required
            error={errors.detailedDescription?.message as string}
            hint="Cover materials, use cases, quality standards, and what sets it apart"
          >
            <Textarea
              {...register("detailedDescription")}
              rows={7}
              placeholder="Describe the product in full detail..."
              className="resize-y border-slate-200 text-sm leading-relaxed focus-visible:ring-emerald-200"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Key Features"
        description="Short, specific bullet points — buyers scan these first."
        icon={<ListChecks className="h-5 w-5" />}
      >
        <Field label="" error={errors.keyFeatures?.message as string}>
          <ListInput
            value={watch("keyFeatures") ?? []}
            onChange={(v) => setValue("keyFeatures", v, { shouldValidate: true })}
            placeholder="e.g. Corrosion-resistant zinc coating"
            addLabel="Add Feature"
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Applications"
        description="Where and how this product is typically used."
        icon={<Compass className="h-5 w-5" />}
      >
        <ListInput
          value={watch("applications") ?? []}
          onChange={(v) => setValue("applications", v)}
          placeholder="e.g. Commercial building construction"
          addLabel="Add Application"
        />
      </SectionCard>

      <SectionCard
        title="Product Benefits"
        description="The outcomes or advantages a buyer gets from choosing this product."
        icon={<Sparkles className="h-5 w-5" />}
      >
        <ListInput
          value={watch("benefits") ?? []}
          onChange={(v) => setValue("benefits", v)}
          placeholder="e.g. Reduces installation time by 30%"
          addLabel="Add Benefit"
        />
      </SectionCard>
    </div>
  );
}
