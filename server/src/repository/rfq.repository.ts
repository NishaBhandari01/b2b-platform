import prisma from "../config/db.js";

export class RFQRepository {
  async createRFQ(rfqData: {
    userId: string;
    title: string;
    category: string;
    quantity: number;
    budget: number;
    deadline: Date;
    description: string;
  }) {
    return await prisma.rfq.create({
      data: rfqData,
    });
  }

  async getRFQById(
    rfqId: string,
    options: {
      includeQuotations?: boolean;
      includeMessages?: boolean;
      includeUser?: boolean;
    } = {},
  ) {
    const { includeQuotations, includeMessages, includeUser } = options;

    return await prisma.rfq.findUnique({
      where: {
        id: rfqId,
      },
      include: {
        ...(includeQuotations
          ? {
              quotations: {
                include: {
                  supplier: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  conversation: {
                    select: {
                      id: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
            }
          : {}),
        ...(includeMessages
          ? {
              messages: {
                include: {
                  sender: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  receiver: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            }
          : {}),
        ...(includeUser
          ? {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            }
          : {}),
      },
    });
  }

  async getUserRFQs(userId: string, role: string) {
    if (role === "buyer") {
      return await prisma.rfq.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              quotations: true,
            },
          },
        },
      });
    }

    return await prisma.rfq.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            quotations: true,
          },
        },
      },
    });
  }

  async createQuotation(quotationData: {
    rfqId: string;
    supplierId: string;
    price: number;
    leadTime: string;
    message: string;
  }) {
    return await prisma.quotation.create({
      data: quotationData,
    });
  }

  async updateRFQ(
    rfqId: string,
    rfqData: {
      title?: string;
      category?: string;
      quantity?: number;
      budget?: number;
      deadline?: Date;
      description?: string;
    },
  ) {
    return await prisma.rfq.update({
      where: { id: rfqId },
      data: rfqData,
    });
  }

  async deleteRFQ(rfqId: string) {
    return await prisma.rfq.delete({
      where: { id: rfqId },
    });
  }

  async getRFQMessages(rfqId: string, participantId: string) {
    return await prisma.message.findMany({
      where: {
        rfqId,
        OR: [
          {
            senderId: participantId,
          },
          {
            receiverId: participantId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async createMessage(messageData: {
    rfqId: string;
    senderId: string;
    receiverId: string;
    text: string;
  }) {
    return await prisma.message.create({
      data: messageData,
    });
  }

  async hasSupplierQuotation(rfqId: string, supplierId: string) {
    const count = await prisma.quotation.count({
      where: {
        rfqId,
        supplierId,
      },
    });
    return count > 0;
  }

  async getQuotationById(quotationId: string) {
    return await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
      include: {
        rfq: true,
      },
    });
  }

  async updateQuotationStatus(
    quotationId: string,
    status: "accepted" | "rejected",
  ) {
    return await prisma.quotation.update({
      where: {
        id: quotationId,
      },
      data: {
        status,
      },
    });
  }

  async closeRFQ(rfqId: string) {
    return await prisma.rfq.update({
      where: {
        id: rfqId,
      },
      data: {
        status: "closed",
      },
    });
  }
}

export default new RFQRepository();
