"use client";

import { useFormContext } from "react-hook-form";
import { ImagePlus, Images, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, SectionCard } from "@/components/add-product/form-primitives";
import { ImageDropzone } from "@/components/add-product/upload-zones";
import type { FullFormValues } from "@/lib/schemas/product-schema";

export function StepMedia() {
  const { watch, setValue, formState } = useFormContext<FullFormValues>();
  const mainImage = watch("mainImage") ?? [];
  const additionalImages = watch("additionalImages") ?? [];
  const mainImageError = (formState as any).errors?.mainImage?.message as
    | string
    | undefined;

  return (
    <div className="space-y-5">
      <SectionCard
        title="Main Product Image"
        description="This is the primary photo shown in search results and listings."
        icon={<ImagePlus className="h-5 w-5" />}
      >
        <Field label="" error={mainImageError}>
          <ImageDropzone
            images={mainImage || []}
            onChange={(imgs) =>
              setValue("mainImage", imgs, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            multiple={false}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Additional Images"
        description="Add up to 8 more angles, use cases, or packaging shots."
        icon={<Images className="h-5 w-5" />}
      >
        <ImageDropzone
          images={additionalImages}
          onChange={(imgs) => setValue("additionalImages", imgs)}
          multiple
          maxImages={8}
        />
      </SectionCard>

      <SectionCard
        title="Product Video"
        description="Optional — link to a hosted demo, factory tour, or explainer video."
        icon={<Video className="h-5 w-5" />}
      >
        <Field label="Video URL" hint="YouTube, Vimeo, or a direct MP4 link">
          <Input
            value={watch("videoUrl") ?? ""}
            onChange={(e) => setValue("videoUrl", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
        </Field>
      </SectionCard>
    </div>
  );
}
