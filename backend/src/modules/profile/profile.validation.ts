import { z } from 'zod';

export const patchProfileSchema = z.object({
  body: z.object({
    about: z.string().optional(),
    education: z.array(z.string()).optional(),
    skills: z.array(z.object({
      name: z.string(),
      level: z.string().optional(),
    })).optional(),
    interests: z.array(z.string()).optional(),
    lookingFor: z.array(z.string()).optional(),
    availability: z.string().optional(),
    location: z.string().optional(),
    studyDestination: z.string().optional(),
    languages: z.array(z.string()).optional(),
    links: z.object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      portfolio: z.string().optional(),
    }).optional(),
    achievements: z.array(z.string()).optional(),
  }),
});
