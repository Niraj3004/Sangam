import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    entityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid entity ID format'),
    entityModel: z.enum(['User', 'Opportunity', 'Project', 'Post', 'Job', 'Comment', 'Message']),
    reason: z.string().min(10).max(1000),
  }),
});
