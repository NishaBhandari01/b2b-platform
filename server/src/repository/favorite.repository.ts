import { includes } from "zod";
import prisma from "../config/db.js";

class FavoriteRepository {
  async addFavorite(buyerId: string, companyId: string) {
    return prisma.favoriteSupplier.create({
      data: {
        buyerId,
        companyId,
      },
    });
  }

  async removeFavorite(buyerId: string, companyId: string) {
    return prisma.favoriteSupplier.delete({
      where: {
        buyerId_companyId: {
          buyerId,
          companyId,
        },
      },
    });
  }

  async getFavorites(buyerId: string) {
    return prisma.favoriteSupplier.findMany({
      where: {
        buyerId,
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getFavorite(buyerId: string, companyId: string) {
    return prisma.favoriteSupplier.findUnique({
      where: {
        buyerId_companyId: {
          buyerId,
          companyId,
        },
      },
    });
  }
}

export default new FavoriteRepository();
