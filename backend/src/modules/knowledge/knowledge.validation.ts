import { z } from 'zod';

export const communityIdParamSchema = z.object({
  params: z.object({
    communityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid community ID format'),
  }),
});

export const postIdParamSchema = z.object({
  params: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID format'),
  }),
});

export const createPostSchema = z.object({
  params: z.object({
    communityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid community ID format'),
  }),
  body: z.object({
    title: z.string().min(5).max(150),
    content: z.string().min(20).max(20000), // Markdown
    tags: z.array(z.string()).optional(),
  }),
});

export const getPostsSchema = z.object({
  params: z.object({
    communityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid community ID format'),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const createCommentSchema = z.object({
  params: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID format'),
  }),
  body: z.object({
    content: z.string().min(2).max(1000),
  }),
});

export const getCommentsSchema = z.object({
  params: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID format'),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
