import productRepository from "../repository/product.repository.js";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { r2, bucketName, R2_PUBLIC_BASE_URL } from "../config/r2.js";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const BASIC_INFO_FIELDS = [
  "name",
  "category",
  "subCategory",
  "brand",
  "modelNumber",
  "sku",
  "shortDescription",
  "description",
  "priceType",
  "currency",
  "price",
  "minPrice",
  "maxPrice",
  "unit",
  "minOrderQty",
  "moqUnit",
  "availableQuantity",
  "stockUnit",
  "tags",
  "keywords",
];

const MEDIA_DETAIL_FIELDS = [
  "keyFeatures",
  "applications",
  "benefits",
  "specifications",
  "shippingInfo",
  "certifications",
  "videoUrl",
];

function pick(source: any, keys: string[]) {
  const result: any = {};
  for (const key of keys) {
    if (source[key] !== undefined) result[key] = source[key];
  }
  return result;
}

class ProductService {
  async createDraft(supplierId: string, data: any) {
    if (!data.name) throw new Error("Product name is required");
    if (!data.category) throw new Error("Category is required");
    if (!data.description) throw new Error("Description is required");

    const slug = `${slugify(data.name)}-${randomUUID().slice(0, 6)}`;

    return productRepository.createProduct({
      supplierId,
      slug,
      status: "draft",
      ...pick(data, BASIC_INFO_FIELDS),
    });
  }

  async getProduct(id: string, supplierId: string) {
    const product = await productRepository.getProductById(id);
    if (!product || product.supplierId !== supplierId) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getSupplierProducts(supplierId: string) {
    return productRepository.getSupplierProducts(supplierId);
  }

  async updateBasicInfo(id: string, supplierId: string, data: any) {
    await this.getProduct(id, supplierId);
    return productRepository.updateProduct(id, pick(data, BASIC_INFO_FIELDS));
  }

  async publishProduct(id: string, supplierId: string, data: any) {
    const product = await this.getProduct(id, supplierId);

    const imageCount = await productRepository.countImages(id);
    if (imageCount === 0) {
      throw new Error("Add at least one product image before publishing");
    }

    return productRepository.updateProduct(id, {
      ...pick(data, MEDIA_DETAIL_FIELDS),
      status: "active",
      publishedAt: product.publishedAt ?? new Date(),
    });
  }

  async uploadImage(
    id: string,
    supplierId: string,
    file: Express.Multer.File,
    isPrimary: boolean,
  ) {
    const product = await this.getProduct(id, supplierId);

    const ext = file.originalname.split(".").pop();
    const fileKey = `products/${product.id}/images/${randomUUID()}.${ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = R2_PUBLIC_BASE_URL
      ? `${R2_PUBLIC_BASE_URL}/${fileKey}`
      : await getSignedUrl(
          r2,
          new GetObjectCommand({ Bucket: bucketName, Key: fileKey }),
          { expiresIn: 60 * 60 * 24 * 7 },
        );

    const existingCount = await productRepository.countImages(product.id);
    const makePrimary = isPrimary || existingCount === 0; // first image is always primary

    if (makePrimary) {
      await productRepository.unsetPrimaryImages(product.id);
    }

    return productRepository.addImage(product.id, {
      url,
      publicId: fileKey,
      isPrimary: makePrimary,
      displayOrder: existingCount,
    });
  }

  async deleteImage(id: string, supplierId: string, imageId: string) {
    await this.getProduct(id, supplierId);
    const image = await productRepository.getImageById(imageId);
    if (!image || image.productId !== id) {
      throw new Error("Image not found");
    }

    if (R2_PUBLIC_BASE_URL) {
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: image.publicId }),
        );
      } catch (e) {
        console.warn("Failed to delete R2 object:", (e as Error).message);
      }
    }

    return productRepository.deleteImage(imageId);
  }

  async deleteProduct(productId: string, supplierId: string) {
    const product = await productRepository.deleteProduct(
      productId,
      supplierId,
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}

export default new ProductService();
