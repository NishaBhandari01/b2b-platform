import { PrismaClient, QuotationStatus } from '@prisma/client';
import { MessageService } from './message.service';

const prisma = new PrismaClient();
const messageService = new MessageService();

export class QuotationService {
  // List all quotations for a given RFQ
  async listByRFQ(rfqId: string) {
    return prisma.quotation.findMany({
      where: { rfqId },
      include: { supplier: true },
    });
  }

  // Create a new quotation (supplier side)
  async createQuotation({ rfqId, supplierId, price, leadTime, message }: {
    rfqId: string;
    supplierId: string;
    price: number;
    leadTime: string;
    message: string;
  }) {
    const quotation = await prisma.quotation.create({
      data: {
        rfqId,
        supplierId,
        price,
        leadTime,
        message,
        status: QuotationStatus.PENDING,
      },
    });
    // System message for new quotation
    await messageService.createSystemMessage({
      rfqId,
      conversationId: null,
      content: `Supplier submitted a quotation`,
    });
    return quotation;
  }

  // Accept a quotation (buyer side)
  async acceptQuotation(quotationId: string, buyerId: string) {
    // Verify buyer owns the RFQ
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { rfq: true },
    });
    if (!quotation) throw new Error('Quotation not found');
    if (quotation.rfq.userId !== buyerId) throw new Error('Not authorized');

    // Update this quotation to accepted
    const accepted = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: QuotationStatus.ACCEPTED },
    });

    // Reject other quotations for the same RFQ
    await prisma.quotation.updateMany({
      where: { rfqId: quotation.rfqId, id: { not: quotationId } },
      data: { status: QuotationStatus.REJECTED },
    });

    // System messages for buyer and supplier
    await messageService.createSystemMessage({
      rfqId: quotation.rfqId,
      conversationId: null,
      content: `Buyer accepted quotation ${quotationId}`,
    });
    return accepted;
  }

  // Reject a quotation (buyer side)
  async rejectQuotation(quotationId: string, buyerId: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { rfq: true },
    });
    if (!quotation) throw new Error('Quotation not found');
    if (quotation.rfq.userId !== buyerId) throw new Error('Not authorized');

    const rejected = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: QuotationStatus.REJECTED },
    });

    await messageService.createSystemMessage({
      rfqId: quotation.rfqId,
      conversationId: null,
      content: `Buyer rejected quotation ${quotationId}`,
    });
    return rejected;
  }
}
