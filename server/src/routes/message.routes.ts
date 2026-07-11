import express from 'express';
import {
  getMessages,
  createMessage,
  markDelivered,
  markRead,
  markAllRead,
  getUnreadCount,
} from '../controller/message.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createMessageSchema } from '../validator/message.validator.js';

const router = express.Router();

// All message routes require authentication
router.use(authenticate);

// GET /api/messages/unread-count
// Must be before /:conversationId to avoid route conflict
router.get('/unread-count', async (req, res) => {
  await getUnreadCount(req as AuthRequest, res);
});

// GET /api/messages/:conversationId
// Returns all messages for a conversation ordered by createdAt
router.get('/:conversationId', async (req, res) => {
  await getMessages(req, res);
});

// POST /api/messages
// Creates a new message (auto-creates conversation if needed)
router.post('/', validate(createMessageSchema), async (req, res) => {
  await createMessage(req as AuthRequest, res);
});

// PATCH /api/messages/:id/delivered
router.patch('/:id/delivered', async (req, res) => {
  await markDelivered(req, res);
});

// PATCH /api/messages/:id/read
router.patch('/:id/read', async (req, res) => {
  await markRead(req, res);
});

// PATCH /api/messages/conversation/:conversationId/read-all
router.patch('/conversation/:conversationId/read-all', async (req, res) => {
  await markAllRead(req as AuthRequest, res);
});

export default router;
