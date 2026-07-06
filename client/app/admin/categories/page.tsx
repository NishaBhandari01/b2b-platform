"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package2 } from "lucide-react";
import { CATEGORY_SEED } from "@/lib/utils/mockData";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Organize the marketplace taxonomy and improve buyer discovery.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORY_SEED.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Package2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {category.productCount} listings
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
