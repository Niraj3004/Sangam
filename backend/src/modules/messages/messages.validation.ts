import { z } from 'zod';

export const startConversationSchema = z.object({
  body: z.object({
    recipientId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

export const sendMessageSchema = z.object({
  params: z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation ID format'),
  }),
  body: z.object({
    content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
  }),
});

export const conversationIdParamSchema = z.object({
  params: z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation ID format'),
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation ID format'),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
