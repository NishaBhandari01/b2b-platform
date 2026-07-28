import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "../config/db.js";
import { bucketName, r2 } from "../config/r2.js";

class ProductRepository {
  async createProduct(data: any) {
    return prisma.product.create({
      data,
      include: {
        images: true,
        documents: true,
      },
    });
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        documents: true,
      },
    });
  }

  async getSupplierProducts(supplierId: string) {
    return prisma.product.findMany({
      where: {
        supplierId,
      },
      include: {
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
      include: {
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        documents: true,
      },
    });
  }

  async addImage(
    productId: string,
    data: {
      url: string;
      publicId: string;
      isPrimary: boolean;
      displayOrder: number;
    },
  ) {
    return prisma.productImage.create({
      data: {
        productId,
        ...data,
      },
    });
  }

  async unsetPrimaryImages(productId: string) {
    return prisma.productImage.updateMany({
      where: {
        productId,
      },
      data: {
        isPrimary: false,
      },
    });
  }

  async getImageById(imageId: string) {
    return prisma.productImage.findUnique({
      where: {
        id: imageId,
      },
    });
  }

  async deleteImage(imageId: string) {
    return prisma.productImage.delete({
      where: {
        id: imageId,
      },
    });
  }

  async countImages(productId: string) {
    return prisma.productImage.count({
      where: {
        productId,
      },
    });
  }

  async deleteProduct(productId: string, supplierId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        supplierId,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return null;
    }

    for (const image of product.images) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: image.key,
        }),
      );
    }

    await prisma.productImage.deleteMany({
      where: {
        productId,
      },
    });

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return product;
  }
}

export default new ProductRepository();
