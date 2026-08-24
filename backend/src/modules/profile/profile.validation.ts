import { z } from 'zod';

export const patchProfileSchema = z.object({
  body: z.object({
    about: z.string().optional(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    })).optional(),
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
