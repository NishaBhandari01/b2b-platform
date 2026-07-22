// import { Prisma, Product } from "@prisma/client";
// import prisma from "../config/db.js";

// class ProductRepository {
//   /**
//    * Create Product
//    */
//   async createProduct(
//     productData: Prisma.ProductCreateInput,
//   ): Promise<Product> {
//     return await prisma.product.create({
//       data: productData,
//       include: {
//         images: true,
//         documents: true,
//       },
//     });
//   }

//   /**
//    * Find Product By ID
//    */
//   async findProductById(productId: string): Promise<Product | null> {
//     return await prisma.product.findUnique({
//       where: {
//         id: productId,
//       },
//       include: {
//         images: true,
//         documents: true,
//       },
//     });
//   }

//   /**
//    * Find Product By Slug
//    */
//   async findProductBySlug(slug: string): Promise<Product | null> {
//     return await prisma.product.findUnique({
//       where: {
//         slug,
//       },
//     });
//   }

//   /**
//    * Find All Products Of A Supplier
//    */
//   async findSupplierProducts(supplierId: string): Promise<Product[]> {
//     return await prisma.product.findMany({
//       where: {
//         supplierId,
//         deletedAt: null,
//       },
//       include: {
//         images: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   }

//   /**
//    * Update Product
//    */
//   async updateProduct(
//     productId: string,
//     productUpdateData: Prisma.ProductUpdateInput,
//   ): Promise<Product> {
//     return await prisma.product.update({
//       where: {
//         id: productId,
//       },
//       data: productUpdateData,
//       include: {
//         images: true,
//         documents: true,
//       },
//     });
//   }

//   /**
//    * Soft Delete Product
//    */
//   async softDeleteProduct(productId: string): Promise<Product> {
//     return await prisma.product.update({
//       where: {
//         id: productId,
//       },
//       data: {
//         deletedAt: new Date(),
//         status: "archived",
//       },
//     });
//   }

//   async findSupplierProduct(
//     productId: string,
//     supplierId: string,
//   ): Promise<Product | null> {
//     return await prisma.product.findFirst({
//       where: {
//         id: productId,
//         supplierId,
//         deletedAt: null,
//       },
//       include: {
//         images: true,
//         documents: true,
//       },
//     });
//   }
// }

// export default new ProductRepository();
import prisma from "../config/db.js";

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
}

export default new ProductRepository();
