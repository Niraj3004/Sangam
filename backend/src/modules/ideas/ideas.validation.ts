import { z } from 'zod';

export const createIdeaSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    category: z.string().min(2),
    problem: z.string().min(10),
    solution: z.string().min(10),
    stage: z.enum(['concept', 'research', 'prototype', 'building', 'prototyping', 'mvp', 'growth']).optional(),
    skillsRequired: z.array(z.string()).optional(),
    lookingFor: z.array(z.string()).optional(),
    visibility: z.enum(['public', 'private']).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateIdeaSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Idea ID format'),
  }),
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    category: z.string().min(2).optional(),
    problem: z.string().min(10).optional(),
    solution: z.string().min(10).optional(),
    stage: z.enum(['concept', 'research', 'prototype', 'building', 'prototyping', 'mvp', 'growth']).optional(),
    skillsRequired: z.array(z.string()).optional(),
    lookingFor: z.array(z.string()).optional(),
    visibility: z.enum(['public', 'private']).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['open', 'assembling', 'closed']).optional(),
  }),
});

export const ideaIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Idea ID format'),
  }),
});
