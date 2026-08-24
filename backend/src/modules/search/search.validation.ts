import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query cannot be empty'),
    type: z.enum(['all', 'users', 'opportunities', 'projects']).default('all'),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
