"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProductById } from "@/lib/api/product.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Pencil,
  Upload,
  Eye,
  Boxes,
  Tag,
  ShieldCheck,
  Truck,
  ListChecks,
  PackageSearch,
  ImageOff,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function statusClass(status?: string) {
  return STATUS_STYLES[status?.toLowerCase() ?? ""] ?? STATUS_STYLES.draft;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
          <div className="h-8 w-40 rounded-md bg-slate-200" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="h-96 rounded-2xl bg-slate-200 lg:col-span-1" />
            <div className="h-96 rounded-2xl bg-slate-200 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-8 text-center">
        <PackageSearch className="h-10 w-10 text-slate-300" />
        <p className="text-lg font-semibold text-slate-700">
          Product not found
        </p>
        <p className="text-sm text-slate-500">
          It may have been removed, or the link is incorrect.
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => router.push("/supplier/products")}
        >
          Back to products
        </Button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const image =
    images[activeImage]?.url ?? images.find((img) => img.isPrimary)?.url;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* STICKY ACTION BAR */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <Button
            variant="ghost"
            className="gap-2 text-slate-600"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Back to products
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 border-slate-300"
              onClick={() =>
                router.push(`/supplier/products/${product.id}/edit`)
              }
            >
              <Pencil size={16} />
              Edit Product
            </Button>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Upload size={16} />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 p-8">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* IMAGE GALLERY */}
          <Card className="border-slate-200 shadow-sm lg:col-span-1">
            <CardContent className="space-y-3 p-5">
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                {image ? (
                  <img
                    src={image}
                    className="h-full w-full object-cover"
                    alt={product.name}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageOff size={32} />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <button
                      key={img.url}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                        i === activeImage
                          ? "border-emerald-500"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* BASIC INFO */}
          <Card className="border-slate-200 shadow-sm lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                    {product.name}
                  </CardTitle>
                  <p className="mt-2 max-w-xl text-slate-500">
                    {product.shortDescription}
                  </p>
                </div>
                <Badge
                  className={`border px-3 py-1 text-xs font-medium capitalize ${statusClass(product.status)}`}
                >
                  {product.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <Separator />
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {[
                  { label: "Category", value: product.category },
                  { label: "SKU", value: product.sku },
                  { label: "Brand", value: product.brand },
                  { label: "Model", value: product.modelNumber },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {field.label}
                    </p>
                    <p className="mt-1 font-medium text-slate-800">
                      {field.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PRICE & STATS */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Tag size={18} className="text-emerald-600" />
              Pricing & Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Price Range",
                  value: `${product.currency} ${product.minPrice}–${product.maxPrice}`,
                  icon: Tag,
                },
                {
                  label: "MOQ",
                  value: `${product.minOrderQty} ${product.moqUnit}`,
                  icon: Boxes,
                },
                {
                  label: "Available Stock",
                  value: `${product.availableQuantity} ${product.stockUnit}`,
                  icon: PackageSearch,
                },
                { label: "Views", value: product.views, icon: Eye },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7 text-slate-600">{product.description}</p>
          </CardContent>
        </Card>

        {/* FEATURES */}
        {!!product.keyFeatures?.length && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ListChecks size={18} className="text-emerald-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.keyFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-slate-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SPECIFICATIONS */}
        {!!Object.keys(product.specifications || {}).length && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(product.specifications || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-slate-500">
                        {key}
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {String(value)}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SHIPPING */}
        {!!Object.keys(product.shippingInfo || {}).length && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Truck size={18} className="text-emerald-600" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(product.shippingInfo || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-slate-100 py-2 last:border-0"
                  >
                    <span className="text-sm text-slate-500">{key}</span>
                    <span className="text-sm font-medium text-slate-800">
                      {String(value)}
                    </span>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        )}

        {/* CERTIFICATIONS */}
        {!!product.certifications?.length && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ShieldCheck size={18} className="text-emerald-600" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700"
                  >
                    <ShieldCheck size={12} />
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
