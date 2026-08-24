import { z } from 'zod';

export const mentorshipIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentorship ID format'),
  }),
});

export const requestMentorshipSchema = z.object({
  body: z.object({
    mentorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentor ID format'),
    purpose: z.string().min(10).max(1000),
  }),
});

export const acceptMentorshipSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentorship ID format'),
  }),
  body: z.object({
    scheduledAt: z.string().datetime(),
    meetingLink: z.string().url().optional(),
  }),
});
