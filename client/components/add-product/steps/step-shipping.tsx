"use client";

import { useFormContext } from "react-hook-form";
import { Factory, Truck, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, SectionCard } from "@/components/add-product/form-primitives";
import {
  DELIVERY_TERMS,
  type ProductFormValues,
} from "@/lib/schemas/product-schema";

const COUNTRIES = [
  "India",
  "China",
  "United States",
  "Germany",
  "Vietnam",
  "Turkey",
  "United Arab Emirates",
  "Italy",
];

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-slate-300"
    >
      <span>
        <span className="block text-[13px] font-semibold text-slate-800">
          {label}
        </span>
        <span className="block text-[12px] text-slate-400">{description}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function StepShipping() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const deliveryTerms = watch("deliveryTerms") ?? [];
  const countryOfOrigin = watch("countryOfOrigin") ?? "";
  const shippingAvailable = watch("shippingAvailable") ?? false;
  const exportAvailable = watch("exportAvailable") ?? false;

  const toggleTerm = (term: (typeof DELIVERY_TERMS)[number]) => {
    const next = deliveryTerms.includes(term)
      ? deliveryTerms.filter((t) => t !== term)
      : [...deliveryTerms, term];
    setValue("deliveryTerms", next, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <SectionCard
        title="Manufacturing"
        description="Where and how much you can produce."
        icon={<Factory className="h-5 w-5" />}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Country of Origin"
            required
            error={errors.countryOfOrigin?.message as string}
          >
            <Select
              value={countryOfOrigin}
              onValueChange={(value: any) =>
                setValue("countryOfOrigin", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-emerald-200">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Dispatch Time"
            required
            error={errors.dispatchTime?.message as string}
          >
            <Input
              {...register("dispatchTime")}
              placeholder="e.g. 7-10 business days"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>

          <Field
            label="Production Capacity"
            required
            error={errors.productionCapacity?.message as string}
          >
            <Input
              {...register("productionCapacity")}
              placeholder="e.g. 5,000"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>

          <Field
            label="Production Unit"
            required
            error={errors.productionUnit?.message as string}
          >
            <Input
              {...register("productionUnit")}
              placeholder="e.g. units/month, tons/week"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Shipping"
        description="Delivery terms and fulfillment options."
        icon={<Truck className="h-5 w-5" />}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Toggle
              checked={watch("shippingAvailable")}
              onChange={(v) => setValue("shippingAvailable", v)}
              label="Shipping Available"
              description="You handle logistics to the buyer"
            />
            <Toggle
              checked={watch("exportAvailable")}
              onChange={(v) => setValue("exportAvailable", v)}
              label="Export Available"
              description="You ship internationally"
            />
          </div>

          <Field
            label="Delivery Terms"
            required
            error={errors.deliveryTerms?.message as string}
            hint="Incoterms — select all that apply"
          >
            <div className="flex flex-wrap gap-2">
              {DELIVERY_TERMS.map((term) => {
                const selected = deliveryTerms.includes(term);
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => toggleTerm(term)}
                    className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {term}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Packaging"
        description="How the product is packed for dispatch."
        icon={<Package className="h-5 w-5" />}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Packaging Type"
            required
            error={errors.packagingType?.message as string}
          >
            <Input
              {...register("packagingType")}
              placeholder="e.g. Wooden crates, palletized"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
          <Field
            label="Package Weight"
            required
            error={errors.packageWeight?.message as string}
          >
            <Input
              {...register("packageWeight")}
              placeholder="e.g. 25 kg per unit"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
          <Field label="Package Dimensions" className="sm:col-span-2">
            <div className="grid grid-cols-3 gap-3">
              <Input
                {...register("packageLength")}
                placeholder="Length (cm)"
                className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
              />
              <Input
                {...register("packageWidth")}
                placeholder="Width (cm)"
                className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
              />
              <Input
                {...register("packageHeight")}
                placeholder="Height (cm)"
                className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
              />
            </div>
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
