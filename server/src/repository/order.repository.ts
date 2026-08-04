import prisma from "../config/db.js";

class OrderRepository {
  async create(data: any) {
    return prisma.order.create({
      data,

      include: {
        quotation: {
          include: {
            rfq: true,
          },
        },
        buyer: true,
        supplier: true,
      },
    });
  }

  async getBuyerOrders(userId: string) {
    return prisma.order.findMany({
      where: {
        buyerId: userId,
      },

      include: {
        rfq: true,
        quotation: {
          include: {
            rfq: true,
          },
        },
        supplier: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findSupplierOrders(userId: string) {
    return prisma.order.findMany({
      where: {
        supplierId: userId,
      },
      include: {
        rfq: true,
        quotation: {
          include: {
            rfq: true,
          },
        },
        buyer: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        rfq: true,
        quotation: {
          include: {
            rfq: true,
          },
        },
        buyer: true,
        supplier: true,
      },
    });
  }

  async updateStatus(id: string, status: any) {
    return prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async getSupplierOrderStats(userId: string) {
    const [
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
    ] = await Promise.all([
      prisma.order.count({
        where: { supplierId: userId },
      }),

      prisma.order.count({
        where: {
          supplierId: userId,
          status: "pending",
        },
      }),

      prisma.order.count({
        where: {
          supplierId: userId,
          status: "confirmed",
        },
      }),

      prisma.order.count({
        where: {
          supplierId: userId,
          status: "processing",
        },
      }),

      prisma.order.count({
        where: {
          supplierId: userId,
          status: "shipped",
        },
      }),

      prisma.order.count({
        where: {
          supplierId: userId,
          status: "delivered",
        },
      }),

      prisma.order.count({
        where: {
          supplierId: userId,
          status: "cancelled",
        },
      }),
    ]);

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
    };
  }

  async getSupplierOrdersByStatus(userId: string, status?: string) {
    return prisma.order.findMany({
      where: {
        supplierId: userId,

        ...(status
          ? {
              status,
            }
          : {}),
      },

      include: {
        rfq: true,
        quotation: {
          include: {
            rfq: true,
          },
        },
        buyer: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSupplierOrders(userId: string, page = 1, limit = 10) {
    return prisma.order.findMany({
      where: {
        supplierId: userId,
      },

      include: {
        quotation: {
          include: {
            rfq: true,
          },
        },

        buyer: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

export default new OrderRepository();
