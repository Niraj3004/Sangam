import { z } from 'zod';

export const reportSchema = z.object({
  body: z.object({
    reportedEntityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid entity ID'),
    entityModel: z.enum(['User', 'Opportunity', 'Project']),
    reason: z.string().min(5).max(500),
  }),
});

export const resolveSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid report ID'),
  }),
  body: z.object({
    action: z.enum(['delete', 'ignore']),
  }),
});
