import { z } from 'zod';

export const getCommunitiesSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    type: z.enum(['country', 'university', 'college', 'skill', 'interest', 'career']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const communityIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid community ID format'),
  }),
});
