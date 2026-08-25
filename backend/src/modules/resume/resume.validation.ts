import { z } from 'zod';

export const generateResumeSchema = z.object({
  body: z.object({
    targetJobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format').optional(),
    targetRole: z.string().optional(),
    title: z.string().optional(),
    additionalContext: z.string().optional(),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string(),
      order: z.number().optional()
    })).optional(),
    status: z.enum(['draft', 'final']).optional(),
  }),
});
