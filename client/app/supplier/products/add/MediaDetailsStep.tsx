"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { TagInput } from "./tag-input";
import {
  useUploadProductImage,
  useDeleteProductImage,
} from "../../../../lib/hooks/useProduct";
import { ProductImage } from "@/lib/api/product.api";

interface MediaDetailsForm {
  keyFeatures: string[];
  specifications: { key: string; value: string }[];
  shippingInfo: { weight: string; dimensions: string; leadTime: string };
  certifications: string[];
}

interface MediaDetailsStepProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  form: MediaDetailsForm;
  setForm: (form: MediaDetailsForm) => void;
  onBack: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

export function MediaDetailsStep({
  productId,
  images,
  onImagesChange,
  form,
  setForm,
  onBack,
  onPublish,
  isPublishing,
}: MediaDetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const uploadImage = useUploadProductImage();
  const deleteImage = useDeleteProductImage();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setUploadingCount((c) => c + list.length);

    for (const file of list) {
      try {
        const res = await uploadImage.mutateAsync({
          id: productId,
          file,
          isPrimary: images.length === 0,
        });
        onImagesChange([...images, res.data]);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || `Failed to upload ${file.name}`,
        );
      } finally {
        setUploadingCount((c) => c - 1);
      }
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      await deleteImage.mutateAsync({ id: productId, imageId });
      onImagesChange(images.filter((img) => img.id !== imageId));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove image");
    }
  };

  const addSpecRow = () =>
    setForm({
      ...form,
      specifications: [...form.specifications, { key: "", value: "" }],
    });

  const updateSpecRow = (
    index: number,
    patch: Partial<{ key: string; value: string }>,
  ) => {
    const next = [...form.specifications];
    next[index] = { ...next[index], ...patch };
    setForm({ ...form, specifications: next });
  };

  const removeSpecRow = (index: number) =>
    setForm({
      ...form,
      specifications: form.specifications.filter((_, i) => i !== index),
    });

  return (
    <div className="space-y-6">
      {/* Images */}
      <Card className="p-6">
        <h2 className="font-semibold">Product images</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Add at least one image. The starred image is what buyers see first.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragging
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="rounded-full bg-emerald-50 p-3">
            <ImagePlus className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Drag images here, or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, or WEBP · up to 10MB each
          </p>
        </div>

        {(images.length > 0 || uploadingCount > 0) && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                <img
                  src={img.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {img.isPrimary && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-medium text-white">
                    <Star className="h-3 w-3 fill-current" /> Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {Array.from({ length: uploadingCount }).map((_, i) => (
              <div
                key={`uploading-${i}`}
                className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50"
              >
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Key features */}
      <Card className="p-6">
        <h2 className="font-semibold">Key features</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Short highlights shown as bullet points on the listing.
        </p>
        <div className="mt-4">
          <TagInput
            value={form.keyFeatures}
            onChange={(keyFeatures) => setForm({ ...form, keyFeatures })}
            placeholder="Type a feature and press Enter"
          />
        </div>
      </Card>

      {/* Specifications */}
      <Card className="p-6">
        <h2 className="font-semibold">Specifications</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Technical details buyers compare across suppliers.
        </p>
        <div className="mt-4 space-y-2">
          {form.specifications.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={row.key}
                onChange={(e) => updateSpecRow(i, { key: e.target.value })}
                placeholder="Attribute (e.g. Wattage)"
                className="flex-1"
              />
              <Input
                value={row.value}
                onChange={(e) => updateSpecRow(i, { value: e.target.value })}
                placeholder="Value (e.g. 150W)"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-slate-400 hover:text-red-500"
                onClick={() => removeSpecRow(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addSpecRow}
            className="mt-1 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add specification
          </Button>
        </div>
      </Card>

      {/* Shipping & certifications */}
      <Card className="p-6">
        <h2 className="font-semibold">Shipping & certifications</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={form.shippingInfo.weight}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingInfo: {
                    ...form.shippingInfo,
                    weight: e.target.value,
                  },
                })
              }
              placeholder="2.5 kg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={form.shippingInfo.dimensions}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingInfo: {
                    ...form.shippingInfo,
                    dimensions: e.target.value,
                  },
                })
              }
              placeholder="30 × 20 × 10 cm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="leadTime">Lead time</Label>
            <Input
              id="leadTime"
              value={form.shippingInfo.leadTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingInfo: {
                    ...form.shippingInfo,
                    leadTime: e.target.value,
                  },
                })
              }
              placeholder="7-10 days"
            />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label>Certifications</Label>
          <TagInput
            value={form.certifications}
            onChange={(certifications) => setForm({ ...form, certifications })}
            placeholder="e.g. ISO 9001, CE, RoHS"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onPublish}
          disabled={isPublishing || images.length === 0 || uploadingCount > 0}
          className="gap-1.5"
        >
          {isPublishing ? "Publishing..." : "Publish product"}
        </Button>
      </div>
    </div>
  );
}
