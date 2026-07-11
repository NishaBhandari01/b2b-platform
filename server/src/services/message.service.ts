import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MessageService {
  // Get all messages for a conversation ordered by time
  async getMessages(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        receiver: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  // Create a regular user message
  async createMessage({
    rfqId,
    conversationId,
    senderId,
    senderRole,
    receiverId,
    text,
  }: {
    rfqId: string;
    conversationId: string;
    senderId: string;
    senderRole: string;
    receiverId: string;
    text: string;
  }) {
    return prisma.message.create({
      data: {
        rfqId,
        conversationId,
        senderId,
        senderRole,
        receiverId,
        text,
        system: false,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        receiver: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  // Mark a message as delivered
  async markDelivered(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { deliveredAt: new Date() },
    });
  }

  // Mark a message as read
  async markRead(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  // Mark all unread messages in a conversation as read for a specific receiver
  async markAllReadInConversation(conversationId: string, receiverId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId,
        receiverId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }

  // Count unread messages for a receiver in all conversations
  async countUnread(receiverId: string) {
    return prisma.message.count({
      where: {
        receiverId,
        readAt: null,
        system: false,
      },
    });
  }

  // Create a system message (no sender/receiver needed)
  async createSystemMessage({
    rfqId,
    conversationId,
    content,
  }: {
    rfqId: string;
    conversationId: string | null;
    content: string;
  }) {
    return prisma.message.create({
      data: {
        rfqId,
        conversationId: conversationId ?? undefined,
        text: content,
        system: true,
      },
    });
  }
}
