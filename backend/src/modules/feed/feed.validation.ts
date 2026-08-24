import { z } from 'zod';

export const trackInteractionSchema = z.object({
  body: z.object({
    entityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid entity ID format'),
    entityModel: z.enum(['Opportunity', 'Project', 'Post']),
    interactionType: z.enum(['view', 'save', 'apply', 'like', 'dislike', 'more_like_this', 'not_relevant']),
    weight: z.number().optional().default(1),
  }),
});
