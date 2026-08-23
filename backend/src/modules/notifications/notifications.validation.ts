import { z } from 'zod';

export const updatePrefsSchema = z.object({
  body: z.object({
    emailDigests: z.boolean().optional(),
    emailReminders: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
  }),
});
