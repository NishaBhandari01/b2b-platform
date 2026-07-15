"use client";

import { useFormContext } from "react-hook-form";
import { Search, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SectionCard, TagInput } from "@/components/add-product/form-primitives";
import type { ProductFormValues } from "@/lib/schemas/product-schema";

export function StepSeo() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const metaTitle = watch("metaTitle") ?? "";
  const metaDescription = watch("metaDescription") ?? "";

  return (
    <div className="space-y-5">
      <SectionCard
        title="Product Tags"
        description="Help buyers find this product through search and related listings."
        icon={<Hash className="h-5 w-5" />}
      >
        <Field label="Tags" required error={errors.tags?.message as string}>
          <TagInput
            value={watch("tags") ?? []}
            onChange={(v) => setValue("tags", v, { shouldValidate: true })}
            placeholder="Type a tag and press Enter..."
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Search Engine Optimization"
        description="Controls how this listing appears in search engine results."
        icon={<Search className="h-5 w-5" />}
      >
        <div className="space-y-5">
          <Field
            label="Meta Title"
            error={errors.metaTitle?.message as string}
            hint={`${metaTitle.length}/60 characters`}
          >
            <Input
              {...register("metaTitle")}
              placeholder="e.g. Galvanized Steel I-Beams | Bulk Supplier"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>

          <Field
            label="Meta Description"
            error={errors.metaDescription?.message as string}
            hint={`${metaDescription.length}/160 characters`}
          >
            <Textarea
              {...register("metaDescription")}
              rows={3}
              placeholder="A concise summary shown under the title in search results..."
              className="resize-none border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>

          <Field label="Keywords" hint="Additional search terms, separate from tags">
            <TagInput
              value={watch("keywords") ?? []}
              onChange={(v) => setValue("keywords", v)}
              placeholder="Type a keyword and press Enter..."
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
