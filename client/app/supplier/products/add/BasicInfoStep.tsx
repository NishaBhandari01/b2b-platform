"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { TagInput } from "./tag-input";
import { BasicInfoPayload, PriceType } from "@/lib/api/product.api";

interface BasicInfoStepProps {
  form: BasicInfoPayload;
  setForm: (form: BasicInfoPayload) => void;
  onNext: () => void;
  isSaving: boolean;
}

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED"];

export function BasicInfoStep({
  form,
  setForm,
  onNext,
  isSaving,
}: BasicInfoStepProps) {
  const update = (patch: Partial<BasicInfoPayload>) =>
    setForm({ ...form, ...patch });

  const canContinue =
    form.name.trim() && form.category.trim() && form.description.trim();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold">Product identity</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          The essentials buyers see first in search and listings.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">Product name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Industrial LED High Bay Light"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => update({ category: e.target.value })}
              placeholder="Lighting & Fixtures"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subCategory">Sub-category</Label>
            <Input
              id="subCategory"
              value={form.subCategory ?? ""}
              onChange={(e) => update({ subCategory: e.target.value })}
              placeholder="LED High Bay"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={form.brand ?? ""}
              onChange={(e) => update({ brand: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="modelNumber">Model number</Label>
            <Input
              id="modelNumber"
              value={form.modelNumber ?? ""}
              onChange={(e) => update({ modelNumber: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={form.sku ?? ""}
              onChange={(e) => update({ sku: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input
              id="shortDescription"
              value={form.shortDescription ?? ""}
              onChange={(e) => update({ shortDescription: e.target.value })}
              placeholder="One line that sums up the product"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Full description *</Label>
            <Textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Materials, use cases, what sets it apart..."
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Tags</Label>
            <TagInput
              value={form.tags ?? []}
              onChange={(tags) => update({ tags })}
              placeholder="Type a tag and press Enter"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold">Pricing & order quantity</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          How buyers see cost and how much they need to commit to.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Price type</Label>
            <Select
              value={form.priceType}
              onValueChange={(v) => update({ priceType: v as PriceType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed price</SelectItem>
                <SelectItem value="range">Price range</SelectItem>
                <SelectItem value="rfq">Quote on request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select
              value={form.currency}
              onValueChange={(v) => update({ currency: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.priceType === "fixed" && (
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={form.price ?? ""}
                onChange={(e) =>
                  update({
                    price: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          )}

          {form.priceType === "range" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="minPrice">Min price</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={form.minPrice ?? ""}
                  onChange={(e) =>
                    update({
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxPrice">Max price</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={form.maxPrice ?? ""}
                  onChange={(e) =>
                    update({
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={form.unit}
              onChange={(e) => update({ unit: e.target.value })}
              placeholder="Piece"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="minOrderQty">Minimum order quantity</Label>
            <Input
              id="minOrderQty"
              type="number"
              value={form.minOrderQty ?? ""}
              onChange={(e) =>
                update({
                  minOrderQty: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="availableQuantity">Available quantity</Label>
            <Input
              id="availableQuantity"
              type="number"
              value={form.availableQuantity ?? ""}
              onChange={(e) =>
                update({
                  availableQuantity: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stockUnit">Stock unit</Label>
            <Input
              id="stockUnit"
              value={form.stockUnit ?? ""}
              onChange={(e) => update({ stockUnit: e.target.value })}
              placeholder="Units"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canContinue || isSaving}
          className="gap-1.5"
        >
          {isSaving ? "Saving..." : "Next: Images & details"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
