import slugify from "slugify";
import { Prisma } from "@prisma/client";

import productRepository from "../repository/product.repository.js";
import { AuthRepository } from "../repository/auth.repository.js";

const authRepository = new AuthRepository();

export class ProductService {
  async createProduct(
    supplierId: string,
    productData: any,
  ) {
    // Check supplier exists
    const supplier = await authRepository.findUserById(supplierId);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    // Only suppliers can create products
    if (supplier.role !== "supplier") {
      throw new Error("Only suppliers can create products.");
    }

    // Generate slug
    let slug = slugify(productData.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Ensure slug is unique
    const existingProduct = await productRepository.findProductBySlug(slug);

    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const { images, documents, ...rest } = productData;

    const formattedImages = images && Array.isArray(images)
      ? {
          create: images.map((img: any) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: img.isPrimary ?? false,
            displayOrder: img.displayOrder ?? 0,
          })),
        }
      : undefined;

    const formattedDocuments = documents && Array.isArray(documents)
      ? {
          create: documents.map((doc: any) => ({
            type: doc.type,
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            publicId: doc.publicId || "",
          })),
        }
      : undefined;

    // Create Product
    return await productRepository.createProduct({
      ...rest,
      slug,
      supplier: {
        connect: {
          id: supplierId,
        },
      },
      images: formattedImages,
      documents: formattedDocuments,
    });
  }

  async getProductById(productId: string) {
    const product = await productRepository.findProductById(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }

  async getSupplierProducts(supplierId: string) {
    const supplier = await authRepository.findUserById(supplierId);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    return await productRepository.findSupplierProducts(supplierId);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findProductBySlug(slug);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }

  async updateProduct(
    productId: string,
    supplierId: string,
    productData: any,
  ) {
    const product = await productRepository.findSupplierProduct(
      productId,
      supplierId,
    );

    if (!product) {
      throw new Error("Product not found or unauthorized.");
    }

    const { images, documents, ...rest } = productData;

    let imagesUpdate: any = undefined;
    if (images && Array.isArray(images)) {
      imagesUpdate = {
        deleteMany: {},
        create: images.map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: img.isPrimary ?? false,
          displayOrder: img.displayOrder ?? 0,
        })),
      };
    }

    let documentsUpdate: any = undefined;
    if (documents && Array.isArray(documents)) {
      documentsUpdate = {
        deleteMany: {},
        create: documents.map((doc: any) => ({
          type: doc.type,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          publicId: doc.publicId || "",
        })),
      };
    }

    return await productRepository.updateProduct(productId, {
      ...rest,
      images: imagesUpdate,
      documents: documentsUpdate,
    });
  }

  async deleteProduct(productId: string, supplierId: string) {
    const product = await productRepository.findSupplierProduct(
      productId,
      supplierId,
    );

    if (!product) {
      throw new Error("Product not found or unauthorized.");
    }

    return await productRepository.softDeleteProduct(productId);
  }

  async publishProduct(productId: string, supplierId: string) {
    const product = await productRepository.findSupplierProduct(
      productId,
      supplierId,
    );

    if (!product) {
      throw new Error("Product not found or unauthorized.");
    }

    return await productRepository.updateProduct(productId, {
      status: "active",
      publishedAt: new Date(),
    });
  }
}

export const productService = new ProductService();
