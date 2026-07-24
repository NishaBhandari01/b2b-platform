import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { MessageService } from "../services/message.service.js";
import { ConversationService } from "../services/conversation.service.js";
import { success } from "zod";

const messageService = new MessageService();
const conversationService = new ConversationService();

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const conversationId = req.params.conversationId as string;
    const { cursor, limit } = req.query;

    const result = await messageService.getMessagesPaginated(
      conversationId,
      cursor as string | undefined,
      limit ? parseInt(limit as string, 10) : 20,
    );

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// POST /api/messages
// Creates a message, auto-creates the conversation if it doesn't exist
export const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { rfqId, supplierId, text } = req.body;
    const senderId = req.user!.id;
    const senderRole = req.user!.role;

    const actualSupplierId = senderRole === "supplier" ? senderId : supplierId;

    if (!actualSupplierId) {
      return res
        .status(400)
        .json({ success: false, message: "supplierId is required" });
    }

    // Get or create the one shared conversation for this quotation
    const conversation = await conversationService.getOrCreateConversation(
      rfqId,
      actualSupplierId,
    );

    // receiverId is the other party
    const receiverId =
      senderRole === "supplier" ? conversation.buyerId : actualSupplierId;

    if (!receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Could not determine receiverId" });
    }

    const message = await messageService.createMessage({
      rfqId,
      conversationId: conversation.id,
      senderId,
      senderRole,
      receiverId,
      text,
    });

    // Emit to the shared conversation room so both parties receive it instantly
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation:${conversation.id}`).emit("message:new", message);
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// PATCH /api/messages/:id/delivered
export const markDelivered = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const message = await messageService.markDelivered(id);

    const io = req.app.get("io");
    if (io && message.conversationId) {
      io.to(`conversation:${message.conversationId}`).emit(
        "message:delivered",
        message,
      );
    }

    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// PATCH /api/messages/:id/read
export const markRead = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const message = await messageService.markRead(id);

    const io = req.app.get("io");
    if (io && message.conversationId) {
      io.to(`conversation:${message.conversationId}`).emit(
        "message:read",
        message,
      );
    }

    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// PATCH /api/messages/conversation/:conversationId/read-all
// Marks all messages in a conversation as read for the authenticated user
export const markAllRead = async (
  req: AuthRequest & Request<{ conversationId: string }>,
  res: Response,
) => {
  try {
    const { conversationId } = req.params;
    const receiverId = req.user!.id;
    await messageService.markAllReadInConversation(conversationId, receiverId);

    const io = req.app.get("io");
    if (io) {
      io.to(`conversation:${conversationId}`).emit("messages:all-read", {
        conversationId,
        receiverId,
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

// GET /api/messages/unread-count
// Returns total unread message count for the authenticated user
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const receiverId = req.user!.id;
    const count = await messageService.countUnread(receiverId);
    res.json({ success: true, data: { count } });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};
