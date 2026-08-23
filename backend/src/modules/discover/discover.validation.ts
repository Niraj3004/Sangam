import { z } from 'zod';

export const discoverPeopleSchema = z.object({
  query: z.object({
    skill: z.string().optional(),
    college: z.string().optional(),
    country: z.string().optional(),
    interest: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
