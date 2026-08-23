import { Router } from 'express';
import * as messagesController from './messages.controller';
import * as messagesValidation from './messages.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { Conversation } from '../../models/Conversation';
import { ownership } from '../../middlewares/ownership';

const router = Router();

// All messages routes require authentication
router.use(auth);

// Ownership fetcher to ensure user is part of the conversation
const getConversationParticipantId = async (resourceId: string, userId: string) => {
  const conversation = await Conversation.findById(resourceId);
  if (!conversation) return null;
  // If the user is a participant, we return their own userId to pass the ownership check
  const isParticipant = conversation.participants.some(p => p.toString() === userId);
  return isParticipant ? userId : null;
};

// Start a new 1:1 conversation or get existing
router.post(
  '/start',
  validate(messagesValidation.startConversationSchema),
  asyncErrorHandler(messagesController.startConversation)
);

// Get inbox (all conversations)
router.get(
  '/conversations',
  asyncErrorHandler(messagesController.getInbox)
);

// Get messages in a conversation
router.get(
  '/:conversationId',
  validate(messagesValidation.getMessagesSchema),
  async (req, res, next) => {
    // Custom ownership injection for middleware
    req.params.id = req.params.conversationId;
    next();
  },
  // We use a custom wrapper around ownership since it usually takes (resourceId) without knowing who's asking,
  // but for conversations, multiple people "own" it.
  async (req, res, next) => {
    const conversationId = req.params.conversationId as string;
    const ownerId = await getConversationParticipantId(conversationId, req.user!.userId);
    if (ownerId !== req.user!.userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  },
  asyncErrorHandler(messagesController.getMessages)
);

// Send a message
router.post(
  '/:conversationId',
  validate(messagesValidation.sendMessageSchema),
  async (req, res, next) => {
    const conversationId = req.params.conversationId as string;
    const ownerId = await getConversationParticipantId(conversationId, req.user!.userId);
    if (ownerId !== req.user!.userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  },
  asyncErrorHandler(messagesController.sendMessage)
);

// Mark conversation as read
router.patch(
  '/:conversationId/read',
  validate(messagesValidation.conversationIdParamSchema),
  async (req, res, next) => {
    const conversationId = req.params.conversationId as string;
    const ownerId = await getConversationParticipantId(conversationId, req.user!.userId);
    if (ownerId !== req.user!.userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  },
  asyncErrorHandler(messagesController.markAsRead)
);

export default router;
