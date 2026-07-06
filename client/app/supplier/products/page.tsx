"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import { PRODUCT_CATALOG } from "@/lib/utils/mockData";

export default function SupplierProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-muted-foreground mt-2">
            Keep your catalog fresh and discoverable for buyers across the
            marketplace.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {PRODUCT_CATALOG.map((product) => (
          <Card key={product.id} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Package className="w-5 h-5" />
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Live
              </span>
            </div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold">${product.price}</span>
              <span className="text-muted-foreground">MOQ {product.moq}</span>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" /> View
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
