import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(1),
  }),
});

export const verifyRequestSchema = z.object({
  body: z.object({
    tierRequested: z.enum(['college', 'manual', 'org']),
    evidence: z.string().url(),
  }),
});

export const resolveVerifySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
  }),
  body: z.object({
    action: z.enum(['approve', 'reject']),
    notes: z.string().optional(),
  }),
});
