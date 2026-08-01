import type { RawProduct, Product, ProductStatus } from "@/types/product";

const STATUS_MAP: Record<string, ProductStatus> = {
  active: "Active",
  draft: "Draft",
  pending_approval: "Pending Approval",
  out_of_stock: "Out of Stock",
};

function formatPrice(p: RawProduct): string {
  if (p.priceType === "fixed" && p.price) {
    return `${p.currency} ${p.price} / ${p.unit || "unit"}`;
  }
  if (p.priceType === "range" && p.minPrice && p.maxPrice) {
    return `${p.currency} ${p.minPrice} – ${p.maxPrice} / ${p.unit || "unit"}`;
  }
  return "Request for Quotation";
}

export function mapRawProduct(p: RawProduct): Product {
  const primaryImage =
    p.images?.find((img) => img.isPrimary)?.url ?? p.images?.[0]?.url ?? null;

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.shortDescription || p.description,
    image: primaryImage,
    status: STATUS_MAP[p.status] ?? "Draft",
    price: formatPrice(p),
    moq: `${p.minOrderQty ?? "—"} ${p.moqUnit ?? ""}`.trim(),
    sku: p.sku ?? "", // ← fix: never undefined/null
    stock: p.availableQuantity ?? 0,
    location: p.shippingInfo?.countryOfOrigin ?? "—",
    updatedAt: new Date(p.updatedAt).toLocaleDateString(),
    rating: 0,
    reviews: 0,
    rfqs: 0,
    inquiries: 0,
    clicks: 0,
    conversion: 0,
    views: p.views ?? 0,
    tags: p.tags ?? [],
  };
}
