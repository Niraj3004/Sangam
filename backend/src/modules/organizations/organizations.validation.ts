import { z } from 'zod';

export const createOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    website: z.string().url().optional(),
    logoUrl: z.string().url().optional(),
    type: z.enum(['employer', 'college']),
  }),
});

export const orgIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format'),
  }),
});

export const updateOrgSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    website: z.string().url().optional(),
    industry: z.string().optional(),
    size: z.string().optional(),
    location: z.string().optional(),
    establishedYear: z.number().optional(),
    tagline: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    programs: z.array(z.string()).optional(),
    accreditation: z.string().optional(),
    socialLinks: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
    }).optional(),
    contactEmail: z.string().email().optional(),
  }),
});
