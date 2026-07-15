"use client";

import { useFormContext } from "react-hook-form";
import { ListTree } from "lucide-react";
import { Field, SectionCard, SpecificationBuilder } from "@/components/add-product/form-primitives";
import type { ProductFormValues } from "@/lib/schemas/product-schema";

export function StepSpecifications() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  return (
    <SectionCard
      title="Specifications"
      description="Add technical attributes buyers filter and compare by, such as material, grade, color, or dimensions."
      icon={<ListTree className="h-5 w-5" />}
    >
      <Field label="" error={errors.specifications?.message as string}>
        <SpecificationBuilder
          value={watch("specifications") ?? []}
          onChange={(v) => setValue("specifications", v, { shouldValidate: true })}
        />
      </Field>
    </SectionCard>
  );
}
