import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ConversationService {
  /**
   * Get an existing conversation for a quotation or create a new one.
   * The conversation is identified by (rfqId + supplierId), which maps to
   * exactly one Quotation. This ensures one shared thread per quotation.
   */
  async getOrCreateConversation(rfqId: string, supplierId: string) {
    // Find the quotation for this rfq and supplier
    const quotation = await prisma.quotation.findFirst({
      where: { rfqId, supplierId },
      include: { rfq: { select: { userId: true } } },
    });

    if (!quotation) {
      throw new Error('Quotation not found for this RFQ and supplier');
    }

    // Try to find a conversation linked to this quotation
    let conversation = await prisma.conversation.findUnique({
      where: { quotationId: quotation.id },
    });

    // If none exists, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { quotationId: quotation.id },
      });
    }

    // Attach derived fields needed by the message controller
    return {
      ...conversation,
      buyerId: quotation.rfq.userId,
      supplierId: quotation.supplierId,
    };
  }

  /**
   * List all conversations where the user is a participant (buyer or supplier).
   * Returns conversations enriched with the latest message and unread count.
   */
  async listConversationsForUser(userId: string) {
    // Get all quotations where the user is the buyer (via rfq.userId)
    const buyerConversations = await prisma.conversation.findMany({
      where: {
        quotation: {
          rfq: { userId },
        },
      },
      include: {
        quotation: {
          include: {
            rfq: { select: { id: true, title: true } },
            supplier: { select: { id: true, name: true, email: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Get all quotations where the user is the supplier
    const supplierConversations = await prisma.conversation.findMany({
      where: {
        quotation: { supplierId: userId },
      },
      include: {
        quotation: {
          include: {
            rfq: {
              select: {
                id: true,
                title: true,
                user: { select: { id: true, name: true, email: true } },
              },
            },
            supplier: { select: { id: true, name: true, email: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });

    const all = [...buyerConversations, ...supplierConversations];

    // For each conversation, compute unread count for this user
    const withUnread = await Promise.all(
      all.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: userId,
            readAt: null,
            system: false,
          },
        });
        return { ...conv, unreadCount };
      }),
    );

    return withUnread;
  }
}
