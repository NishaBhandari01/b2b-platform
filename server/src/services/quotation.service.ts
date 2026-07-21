import prisma from "../config/db.js";
import { OrderStatus, QuotationStatus } from "@prisma/client";
import { MessageService } from "./message.service.js";
import { sendEmail } from "../utils/mail.js";
import { quotationReceivedTemplate } from "../templates/quotationReceived.js";
import { quotationAcceptedTemplate } from "../templates/quotationAccepted.js";

const messageService = new MessageService();

export class QuotationService {
  async listByRFQ(rfqId: string) {
    return prisma.quotation.findMany({
      where: {
        rfqId,
      },

      include: {
        supplier: true,
        order: true,
      },
    });
  }

  async createQuotation({
    rfqId,
    supplierId,
    price,
    leadTime,
    message,
  }: {
    rfqId: string;
    supplierId: string;
    price: number;
    leadTime: string;
    message: string;
  }) {
    const existingQuotation = await prisma.quotation.findFirst({
      where: {
        rfqId,
        supplierId,
      },
    });

    if (existingQuotation) {
      throw new Error("You have already submitted quotation for this RFQ.");
    }

    // Get RFQ Buyer

    const rfq = await prisma.rfq.findUnique({
      where: {
        id: rfqId,
      },

      include: {
        user: true,
      },
    });

    if (!rfq) {
      throw new Error("RFQ not found");
    }

    // Get Supplier

    const supplier = await prisma.user.findUnique({
      where: {
        id: supplierId,
      },
    });

    if (!supplier) {
      throw new Error("Supplier not found");
    }

    const quotation = await prisma.quotation.create({
      data: {
        rfqId,

        supplierId,

        price,

        leadTime,

        message,

        status: QuotationStatus.pending,
      },
    });

    // System message

    await messageService.createSystemMessage({
      rfqId,

      conversationId: null,

      content: "Supplier submitted a quotation",
    });

    // Email notification

    try {
      const html = quotationReceivedTemplate({
        buyerName: rfq.user.name,

        supplierName: supplier.name,

        rfqTitle: rfq.title,

        price,

        leadTime,

        message,

        quotationUrl: `${process.env.FRONTEND_URL}/buyer/dashboard`,
      });

      await sendEmail(
        rfq.user.email,

        "📨 New Quotation Received",

        html,
      );

      console.log("Quotation email sent");
    } catch (error) {
      console.log("Email failed", error);
    }

    return quotation;
  }

  async acceptQuotation(
    quotationId: string,

    buyerId: string,
  ) {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },

      include: {
        rfq: true,

        order: true,
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    if (quotation.rfq.userId !== buyerId) {
      throw new Error("Not authorized");
    }

    if (quotation.order) {
      throw new Error("Order already exists");
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const acceptedQuotation = await tx.quotation.update({
        where: {
          id: quotationId,
        },

        data: {
          status: QuotationStatus.accepted,
        },
      });

      await tx.quotation.updateMany({
        where: {
          rfqId: quotation.rfqId,
          id: {
            not: quotationId,
          },
          status: QuotationStatus.pending,
        },
        data: {
          status: QuotationStatus.rejected,
        },
      });

      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-${Date.now()}`,

          quotationId: quotation.id,

          rfqId: quotation.rfqId,

          buyerId,

          supplierId: quotation.supplierId,

          amount: quotation.price,

          status: OrderStatus.pending,
        },

        include: {
          buyer: true,
          supplier: true,
          quotation: true,
          rfq: true,
        },
      });
      return {
        acceptedQuotation,

        order,
      };
    });

    await messageService.createSystemMessage({
      rfqId: quotation.rfqId,

      conversationId: null,

      content: "Buyer accepted quotation and order was created",
    });

    try {
      const supplier = await prisma.user.findUnique({
        where: {
          id: quotation.supplierId,
        },
      });

      if (supplier) {
        const html = quotationAcceptedTemplate({
          supplierName: supplier.name,
          buyerName: result.order.buyer.name,
          orderNumber: result.order.orderNumber,
          amount: result.order.amount,
          orderUrl: `${process.env.FRONTEND_URL}/supplier/orders`,
        });

        await sendEmail(
          supplier.email,
          "🎉 Quotation Accepted - New Order Received",
          html,
        );
      }
    } catch (error) {
      console.log("Supplier email failed", error);
    }

    return result;
  }

  async rejectQuotation(
    quotationId: string,

    buyerId: string,
  ) {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },

      include: {
        rfq: true,
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    if (quotation.rfq.userId !== buyerId) {
      throw new Error("Not authorized");
    }

    const rejected = await prisma.quotation.update({
      where: {
        id: quotationId,
      },

      data: {
        status: QuotationStatus.rejected,
      },
    });

    await messageService.createSystemMessage({
      rfqId: quotation.rfqId,

      conversationId: null,

      content: "Buyer rejected quotation",
    });

    return rejected;
  }
}
