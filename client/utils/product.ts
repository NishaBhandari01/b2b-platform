import type { ProductImage } from "@/types/product";

export function getProductImage(images?: ProductImage[]) {
  if (!images || images.length === 0) {
    return "/placeholder.png";
  }

  return (
    images.find((img) => img.isPrimary)?.url ??
    images[0]?.url ??
    "/placeholder.png"
  );
}
