"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { BasicInfoStep } from "./BasicInfoStep";
import { MediaDetailsStep } from "./MediaDetailsStep";
import {
  useCreateProductDraft,
  useUpdateProductBasicInfo,
  usePublishProduct,
} from "../../../../lib/hooks/useProduct";
import { BasicInfoPayload, ProductImage } from "@/lib/api/product.api";

const STEPS = [
  { id: 1, label: "Basic information" },
  { id: 2, label: "Images & details" },
];

const DEFAULT_BASIC_INFO: BasicInfoPayload = {
  name: "",
  category: "",
  subCategory: "",
  brand: "",
  modelNumber: "",
  sku: "",
  shortDescription: "",
  description: "",
  priceType: "fixed",
  currency: "USD",
  unit: "Piece",
  tags: [],
  keywords: [],
};

export default function AddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);

  const [basicInfo, setBasicInfo] =
    useState<BasicInfoPayload>(DEFAULT_BASIC_INFO);
  const [mediaDetails, setMediaDetails] = useState({
    keyFeatures: [] as string[],
    specifications: [] as { key: string; value: string }[],
    shippingInfo: { weight: "", dimensions: "", leadTime: "" },
    certifications: [] as string[],
  });

  const createDraft = useCreateProductDraft();
  const updateBasicInfo = useUpdateProductBasicInfo();
  const publish = usePublishProduct();

  const handleNext = async () => {
    try {
      if (!productId) {
        const res = await createDraft.mutateAsync(basicInfo);
        setProductId(res.data.id);
      } else {
        await updateBasicInfo.mutateAsync({ id: productId, data: basicInfo });
      }
      setStep(2);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to save product details",
      );
    }
  };

  const handlePublish = async () => {
    if (!productId) return;
    try {
      const specifications = Object.fromEntries(
        mediaDetails.specifications
          .filter((s) => s.key.trim())
          .map((s) => [s.key.trim(), s.value.trim()]),
      );
      await publish.mutateAsync({
        id: productId,
        data: {
          keyFeatures: mediaDetails.keyFeatures,
          specifications,
          shippingInfo: mediaDetails.shippingInfo,
          certifications: mediaDetails.certifications,
        },
      });
      toast.success("Product published");
      router.push("/supplier/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to publish product");
    }
  };

  const isSavingStep1 = createDraft.isPending || updateBasicInfo.isPending;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Add a product</h1>
        <p className="text-sm text-muted-foreground">
          Buyers will see this listing once it's published.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step > s.id
                    ? "bg-emerald-600 text-white"
                    : step === s.id
                      ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-600"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= s.id ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-4 h-px flex-1 ${step > s.id ? "bg-emerald-600" : "bg-slate-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <BasicInfoStep
          form={basicInfo}
          setForm={setBasicInfo}
          onNext={handleNext}
          isSaving={isSavingStep1}
        />
      )}

      {step === 2 && productId && (
        <MediaDetailsStep
          productId={productId}
          images={images}
          onImagesChange={setImages}
          form={mediaDetails}
          setForm={setMediaDetails}
          onBack={() => setStep(1)}
          onPublish={handlePublish}
          isPublishing={publish.isPending}
        />
      )}
    </div>
  );
}
