"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProductById, updateProductBasicInfo } from "@/lib/api/product.api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, ArrowLeft, Package, Info, FileText, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
  });

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    sku: "",
    brand: "",
    modelNumber: "",
  });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        sku: product.sku ?? "",
        brand: product.brand ?? "",
        modelNumber: product.modelNumber ?? "",
      });
      setDirty(false);
    }
  }, [product]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const mutation = useMutation({
    mutationFn: () => updateProductBasicInfo(id as string, form),
    onSuccess: () => router.push(`/supplier/products/${id}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-8 w-40 rounded-md bg-slate-200" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="h-80 rounded-2xl bg-slate-200 lg:col-span-2" />
            <div className="h-80 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Product not found
      </div>
    );
  }

  const field = (
    label: string,
    key: keyof typeof form,
    props: { textarea?: boolean; rows?: number } = {},
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      {props.textarea ? (
        <Textarea
          rows={props.rows ?? 6}
          value={form[key]}
          onChange={(e) => updateField(key, e.target.value)}
          className="resize-none border-slate-300 focus-visible:ring-emerald-500"
        />
      ) : (
        <Input
          value={form[key]}
          onChange={(e) => updateField(key, e.target.value)}
          className="border-slate-300 focus-visible:ring-emerald-500"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div>
            <Button
              variant="ghost"
              className="-ml-3 gap-2 text-slate-600"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
              Back
            </Button>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Edit Product
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="text-xs font-medium text-amber-600">
                Unsaved changes
              </span>
            )}
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={mutation.isPending || !dirty}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save size={16} />
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to save these changes?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This will update the product information and overwrite the
                    existing details.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => mutation.mutate()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Yes, Save Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT FORM */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Info size={18} className="text-emerald-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {field("Product Name", "name")}
                <div className="grid gap-5 md:grid-cols-2">
                  {field("Category", "category")}
                  {field("SKU", "sku")}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {field("Brand", "brand")}
                  {field("Model Number", "modelNumber")}
                </div>
                {field("Description", "description", { textarea: true })}
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <FileText size={18} className="text-emerald-600" />
                  Product Information
                </CardTitle>
                <p className="text-xs text-slate-400">
                  Managed from the pricing & inventory step
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {[
                    { label: "Price Type", value: product.priceType },
                    { label: "Currency", value: product.currency },
                    { label: "MOQ", value: product.minOrderQty },
                    { label: "Stock", value: product.availableQuantity },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={product.images?.[0]?.url ?? "/placeholder.png"}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {form.name || product.name}
                </h2>
                <Badge className="mt-2 border border-slate-200 bg-slate-100 capitalize text-slate-600">
                  {product.status}
                </Badge>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <strong className="text-slate-800">
                      {form.category || "—"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SKU</span>
                    <strong className="text-slate-800">
                      {form.sku || "—"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Brand</span>
                    <strong className="text-slate-800">
                      {form.brand || "—"}
                    </strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Eye size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Views</p>
                    <p className="font-bold text-slate-900">{product.views}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Stock</p>
                    <p className="font-bold text-slate-900">
                      {product.availableQuantity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
