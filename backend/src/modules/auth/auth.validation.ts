import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    handle: z.string().min(3).optional(),
    name: z.string().min(2).max(50).optional(),
  }),
});

export const registerOrgSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    handle: z.string().min(3),
    orgName: z.string().min(2),
    orgType: z.enum(['employer', 'college']),
    orgWebsite: z.string().url().optional(),
    orgDescription: z.string().min(10),
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

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    code: z.string().length(6),
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

export const secondaryEmailSchema = z.object({
  body: z.object({
    secondaryEmail: z.string().email(),
  }),
});

export const verifySecondarySchema = z.object({
  body: z.object({
    secondaryEmail: z.string().email(),
    code: z.string().length(6),
  }),
});
