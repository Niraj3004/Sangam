import { z } from 'zod';

export const updateConfigSchema = z.object({
  body: z.object({
    theme: z.string().optional(),
    visibleSections: z.array(z.string()).optional(),
    customUrlSlug: z.string().min(3).max(30).optional(),
  }),
});
