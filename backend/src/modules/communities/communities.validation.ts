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

const baseCommunityBody = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  type: z.enum(['country', 'university', 'college', 'skill', 'interest', 'career']),
});

export const proposeCommunitySchema = z.object({
  body: baseCommunityBody,
});

export const createCommunitySchema = z.object({
  body: baseCommunityBody,
});
