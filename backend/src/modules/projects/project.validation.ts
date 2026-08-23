import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    technologies: z.array(z.string()).optional(),
    contributors: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')).optional(),
    repositoryUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['active', 'completed']).optional(),
    openRoles: z.array(z.object({
      title: z.string().min(2),
      description: z.string().min(5),
      isFilled: z.boolean().optional(),
    })).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    technologies: z.array(z.string()).optional(),
    contributors: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')).optional(),
    repositoryUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['active', 'completed']).optional(),
    openRoles: z.array(z.object({
      title: z.string().min(2),
      description: z.string().min(5),
      isFilled: z.boolean().optional(),
    })).optional(),
  }),
});

export const getProjectsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
});

export const applyToRoleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
  }),
  body: z.object({
    roleTitle: z.string().min(2),
    message: z.string().max(500).optional(),
  }),
});

export const resolveApplicationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    appId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid application ID'),
  }),
  body: z.object({
    status: z.enum(['accepted', 'rejected']),
  }),
});
