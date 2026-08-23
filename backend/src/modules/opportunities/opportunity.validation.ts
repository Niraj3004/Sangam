import { z } from 'zod';

export const createOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    type: z.enum(['job', 'internship', 'project', 'hackathon', 'scholarship']),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    isExternal: z.boolean().optional(),
    externalLink: z.string().url().optional().or(z.literal('')),
  }),
});

export const updateOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(20).optional(),
    type: z.enum(['job', 'internship', 'project', 'hackathon', 'scholarship']).optional(),
    status: z.enum(['active', 'closed', 'draft']).optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    isExternal: z.boolean().optional(),
    externalLink: z.string().url().optional().or(z.literal('')),
  }),
});

export const getOpportunitiesSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    type: z.enum(['job', 'internship', 'project', 'hackathon', 'scholarship']).optional(),
  }),
});
