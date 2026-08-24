import { z } from 'zod';

export const updatePlanItemSchema = z.object({
  body: z.object({
    isCompleted: z.boolean(),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(500),
  }),
});
