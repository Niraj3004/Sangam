import { z } from 'zod';

export const jobIdParamSchema = z.object({
  params: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format'),
  }),
});

export const appIdParamSchema = z.object({
  params: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format'),
    appId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid application ID format'),
  }),
});

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(20).max(10000),
    organizationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format'),
    type: z.enum(['job', 'internship', 'freelance', 'part_time']),
    location: z.string().optional(),
    remote: z.boolean().default(false),
    salaryRange: z.string().optional(),
    skillsRequired: z.array(z.string()).default([]),
  }),
});

export const applyJobSchema = z.object({
  params: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format'),
  }),
  body: z.object({
    resumeUrl: z.string().url().optional(),
    coverLetter: z.string().max(5000).optional(),
  }),
});

export const updateAppSchema = z.object({
  params: z.object({
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid job ID format'),
    appId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid application ID format'),
  }),
  body: z.object({
    status: z.enum(['applied', 'reviewing', 'interview', 'offer', 'rejected']),
  }),
});
