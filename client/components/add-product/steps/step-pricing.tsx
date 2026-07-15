"use client";

import { useFormContext } from "react-hook-form";
import { DollarSign, Boxes } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, SectionCard } from "@/components/add-product/form-primitives";
import { CURRENCIES, PRICE_TYPE, type ProductFormValues } from "@/lib/schemas/product-schema";

const PRICE_TYPE_LABELS: Record<(typeof PRICE_TYPE)[number], { label: string; hint: string }> = {
  fixed: { label: "Fixed Price", hint: "One price for all buyers" },
  range: { label: "Price Range", hint: "Varies with order size or spec" },
  rfq: { label: "RFQ Only", hint: "Buyers request a quote" },
};

export function StepPricing() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const priceType = watch("priceType");
  const currency = watch("currency");

  return (
    <div className="space-y-5">
      <SectionCard
        title="Pricing"
        description="Set how buyers see and request pricing for this product."
        icon={<DollarSign className="h-5 w-5" />}
      >
        <div className="space-y-5">
          <Field label="Price Type" required error={errors.priceType?.message as string}>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {PRICE_TYPE.map((pt) => {
                const selected = priceType === pt;
                return (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setValue("priceType", pt, { shouldValidate: true })}
                    className={`rounded-xl border px-4 py-2.5 text-left transition-colors ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[13px] font-semibold text-slate-800">
                      {PRICE_TYPE_LABELS[pt].label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">
                      {PRICE_TYPE_LABELS[pt].hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Currency" required>
              <Select value={currency} onValueChange={(v) => setValue("currency", v as any)}>
                <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-emerald-200">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Unit" required error={errors.unit?.message as string}>
              <Input
                {...register("unit")}
                placeholder="e.g. piece, ton, meter"
                className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
              />
            </Field>

            {priceType === "fixed" && (
              <Field
                label={`Price (${currency})`}
                required
                error={errors.price?.message as string}
                className="sm:col-span-2"
              >
                <Input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  placeholder="0.00"
                  className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
                />
              </Field>
            )}

            {priceType === "range" && (
              <>
                <Field
                  label={`Minimum Price (${currency})`}
                  required
                  error={errors.minPrice?.message as string}
                >
                  <Input
                    type="number"
                    step="0.01"
                    {...register("minPrice")}
                    placeholder="0.00"
                    className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
                  />
                </Field>
                <Field
                  label={`Maximum Price (${currency})`}
                  required
                  error={errors.maxPrice?.message as string}
                >
                  <Input
                    type="number"
                    step="0.01"
                    {...register("maxPrice")}
                    placeholder="0.00"
                    className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
                  />
                </Field>
              </>
            )}

            {priceType === "rfq" && (
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-500 sm:col-span-2">
                Buyers will submit a Request for Quotation instead of seeing a listed price.
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Inventory"
        description="Minimum order quantity and available stock."
        icon={<Boxes className="h-5 w-5" />}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Minimum Order Quantity (MOQ)" required error={errors.moq?.message as string}>
            <Input
              type="number"
              {...register("moq")}
              placeholder="e.g. 500"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
          <Field label="MOQ Unit" required error={errors.moqUnit?.message as string}>
            <Input
              {...register("moqUnit")}
              placeholder="e.g. units, tons, meters"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
          <Field label="Available Stock" required error={errors.stock?.message as string}>
            <Input
              type="number"
              {...register("stock")}
              placeholder="e.g. 12000"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
          <Field label="Stock Unit" required error={errors.stockUnit?.message as string}>
            <Input
              {...register("stockUnit")}
              placeholder="e.g. units, tons, meters"
              className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
