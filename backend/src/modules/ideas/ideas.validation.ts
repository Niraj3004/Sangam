import { z } from 'zod';

export const createIdeaSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateIdeaSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Idea ID format'),
  }),
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['open', 'assembling', 'closed']).optional(),
  }),
});

export const ideaIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Idea ID format'),
  }),
});
