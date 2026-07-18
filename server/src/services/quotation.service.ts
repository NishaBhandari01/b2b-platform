// import { PrismaClient, QuotationStatus } from "@prisma/client";
// import { MessageService } from "./message.service.js";

// const prisma = new PrismaClient();
// const messageService = new MessageService();

// export class QuotationService {
//   // List all quotations for a given RFQ
//   async listByRFQ(rfqId: string) {
//     return prisma.quotation.findMany({
//       where: { rfqId },
//       include: { supplier: true },
//     });
//   }

//   // Create a new quotation (supplier side)
//   async createQuotation({
//     rfqId,
//     supplierId,
//     price,
//     leadTime,
//     message,
//   }: {
//     rfqId: string;
//     supplierId: string;
//     price: number;
//     leadTime: string;
//     message: string;
//   }) {
//     const quotation = await prisma.quotation.create({
//       data: {
//         rfqId,
//         supplierId,
//         price,
//         leadTime,
//         message,
//         status: QuotationStatus.pending,
//       },
//     });
//     // System message for new quotation
//     await messageService.createSystemMessage({
//       rfqId,
//       conversationId: null,
//       content: `Supplier submitted a quotation`,
//     });
//     return quotation;
//   }

//   // Accept a quotation (buyer side)
//   async acceptQuotation(quotationId: string, buyerId: string) {
//     // Verify buyer owns the RFQ
//     const quotation = await prisma.quotation.findUnique({
//       where: { id: quotationId },
//       include: { rfq: true },
//     });
//     if (!quotation) throw new Error("Quotation not found");
//     if (quotation.rfq.userId !== buyerId) throw new Error("Not authorized");

//     // Update this quotation to accepted
//     const accepted = await prisma.quotation.update({
//       where: { id: quotationId },
//       data: { status: QuotationStatus.accepted },
//     });

//     // Reject other quotations for the same RFQ
//     await prisma.quotation.updateMany({
//       where: { rfqId: quotation.rfqId, id: { not: quotationId } },
//       data: { status: QuotationStatus.rejected },
//     });

//     // System messages for buyer and supplier
//     await messageService.createSystemMessage({
//       rfqId: quotation.rfqId,
//       conversationId: null,
//       content: `Buyer accepted quotation ${quotationId}`,
//     });
//     return accepted;
//   }

//   // Reject a quotation (buyer side)
//   async rejectQuotation(quotationId: string, buyerId: string) {
//     const quotation = await prisma.quotation.findUnique({
//       where: { id: quotationId },
//       include: { rfq: true },
//     });
//     if (!quotation) throw new Error("Quotation not found");
//     if (quotation.rfq.userId !== buyerId) throw new Error("Not authorized");

//     const rejected = await prisma.quotation.update({
//       where: { id: quotationId },
//       data: { status: QuotationStatus.rejected },
//     });

//     await messageService.createSystemMessage({
//       rfqId: quotation.rfqId,
//       conversationId: null,
//       content: `Buyer rejected quotation ${quotationId}`,
//     });
//     return rejected;
//   }

// }

import { PrismaClient, QuotationStatus } from "@prisma/client";
import { MessageService } from "./message.service.js";
import { sendEmail } from "../utils/mail.js";
import { quotationReceivedTemplate } from "../templates/quotationReceived.js";

const prisma = new PrismaClient();
const messageService = new MessageService();

export class QuotationService {
  // List all quotations for a given RFQ
  async listByRFQ(rfqId: string) {
    return prisma.quotation.findMany({
      where: { rfqId },
      include: {
        supplier: true,
      },
    });
  }

  // Create a new quotation (supplier side)
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
    // Prevent duplicate quotation
    const existingQuotation = await prisma.quotation.findFirst({
      where: {
        rfqId,
        supplierId,
      },
    });

    // if (existingQuotation) {
    //   throw new Error("You have already submitted a quotation for this RFQ.");
    // }

    // Get RFQ + Buyer
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

    // Create quotation
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

    // Send email (don't fail quotation if email fails)
    // try {
    //   await sendEmail(
    //     rfq.user.email,
    //     "📨 New Quotation Received",
    //     quotationReceivedTemplate({
    //       buyerName: rfq.user.name,
    //       supplierName: supplier.name,
    //       rfqTitle: rfq.title,
    //       price,
    //       leadTime,
    //       message,
    //       quotationUrl: `${process.env.FRONTEND_URL}/buyer/dashboard`,
    //     }),
    //   );

    //   console.log("✅ Quotation email sent");
    // } catch (error) {
    //   console.error("❌ Failed to send quotation email:", error);
    // }

    // Send email (don't fail quotation if email fails)
    console.log("======================================");
    console.log("📧 Starting quotation email process...");
    console.log("Buyer Email:", rfq.user.email);
    console.log("Buyer Name:", rfq.user.name);
    console.log("Supplier Name:", supplier.name);
    console.log("RFQ Title:", rfq.title);

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

      console.log("✅ Email template generated");

      await sendEmail(rfq.user.email, "📨 New Quotation Received", html);

      console.log("✅ Email sent successfully!");
      console.log("======================================");
    } catch (error) {
      console.error("======================================");
      console.error("❌ EMAIL FAILED");
      console.error(error);
      console.error("======================================");
    }

    return quotation;
  }

  // Accept quotation
  async acceptQuotation(quotationId: string, buyerId: string) {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
      include: {
        rfq: true,
      },
    });

    if (!quotation) throw new Error("Quotation not found");

    if (quotation.rfq.userId !== buyerId) throw new Error("Not authorized");

    const accepted = await prisma.quotation.update({
      where: {
        id: quotationId,
      },
      data: {
        status: QuotationStatus.accepted,
      },
    });

    await prisma.quotation.updateMany({
      where: {
        rfqId: quotation.rfqId,
        id: {
          not: quotationId,
        },
      },
      data: {
        status: QuotationStatus.rejected,
      },
    });

    await messageService.createSystemMessage({
      rfqId: quotation.rfqId,
      conversationId: null,
      content: `Buyer accepted quotation ${quotationId}`,
    });

    return accepted;
  }

  // Reject quotation
  async rejectQuotation(quotationId: string, buyerId: string) {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
      include: {
        rfq: true,
      },
    });

    if (!quotation) throw new Error("Quotation not found");

    if (quotation.rfq.userId !== buyerId) throw new Error("Not authorized");

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
      content: `Buyer rejected quotation ${quotationId}`,
    });

    return rejected;
  }
}
