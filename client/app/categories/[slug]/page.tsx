"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Search } from "lucide-react";
import { CATEGORY_SEED, PRODUCT_CATALOG } from "@/lib/utils/mockData";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = params;
  const slug = resolvedParams?.slug ?? "";
  const category = CATEGORY_SEED.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const products = PRODUCT_CATALOG.filter(
    (product) => product.categoryId === category.id,
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Category
              </p>
              <h1 className="text-4xl font-bold mt-2">{category.name}</h1>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                {category.description}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              {products.length} active listings
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            Search vetted suppliers and products in this category.
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              Browse all products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">
                  ${product.price}
                </span>
                <span className="text-muted-foreground">MOQ {product.moq}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
