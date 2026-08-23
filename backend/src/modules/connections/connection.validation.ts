import { z } from 'zod';

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

export const requestConnectionSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
  body: z.object({
    purpose: z.enum(['collaboration', 'idea', 'startup', 'job', 'academic', 'open_source', 'networking']).optional(),
    note: z.string().max(500).optional(),
  }),
});
