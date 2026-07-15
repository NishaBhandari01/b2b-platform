"use client";

import { useFormContext } from "react-hook-form";
import { FileStack } from "lucide-react";
import { SectionCard } from "@/components/add-product/form-primitives";
import { DocumentSlot } from "@/components/add-product/upload-zones";
import type { FullFormValues } from "@/lib/schemas/product-schema";

const DOC_SLOTS = [
  { key: "brochure", label: "Product Brochure" },
  { key: "datasheet", label: "Datasheet" },
  { key: "catalog", label: "Catalog" },
  { key: "userManual", label: "User Manual" },
  { key: "safetySheet", label: "Safety Sheet" },
] as const;

export function StepDocuments() {
  const { watch, setValue } = useFormContext<FullFormValues>();
  const documents = watch("documents") ?? {};

  return (
    <SectionCard
      title="Documents"
      description="Upload supporting PDFs or Word documents buyers can download from the listing."
      icon={<FileStack className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DOC_SLOTS.map((slot) => (
          <DocumentSlot
            key={slot.key}
            label={slot.label}
            document={documents[slot.key]}
            onChange={(doc) => setValue("documents", { ...documents, [slot.key]: doc })}
          />
        ))}
      </div>
    </SectionCard>
  );
}
