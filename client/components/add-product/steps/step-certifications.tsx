"use client";

import { useFormContext } from "react-hook-form";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import { Field, SectionCard } from "@/components/add-product/form-primitives";
import { DocumentSlot } from "@/components/add-product/upload-zones";
import { CERTIFICATIONS, type FullFormValues } from "@/lib/schemas/product-schema";

export function StepCertifications() {
  const { watch, setValue } = useFormContext<FullFormValues>();
  const certifications = watch("certifications") ?? [];
  const certificationFiles = watch("certificationFiles") ?? {};

  const toggleCert = (cert: string) => {
    const next = certifications.includes(cert)
      ? certifications.filter((c) => c !== cert)
      : [...certifications, cert];
    setValue("certifications", next);
  };

  return (
    <div className="space-y-5">
      <SectionCard
        title="Certifications"
        description="Select the quality and compliance marks that apply to this product."
        icon={<ShieldCheck className="h-5 w-5" />}
      >
        <Field label="" hint="Optional, but certified products get more buyer trust and RFQs">
          <div className="flex flex-wrap gap-2">
            {CERTIFICATIONS.map((cert) => {
              const selected = certifications.includes(cert);
              return (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCert(cert)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    selected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {selected && <BadgeCheck className="h-3.5 w-3.5" />}
                  {cert}
                </button>
              );
            })}
          </div>
        </Field>
      </SectionCard>

      {certifications.length > 0 && (
        <SectionCard
          title="Certification Documents"
          description="Upload a PDF for each selected certification (optional, but recommended)."
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {certifications.map((cert) => (
              <DocumentSlot
                key={cert}
                label={`${cert} Certificate`}
                accept=".pdf"
                document={certificationFiles[cert]}
                onChange={(doc) =>
                  setValue("certificationFiles", { ...certificationFiles, [cert]: doc })
                }
              />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
