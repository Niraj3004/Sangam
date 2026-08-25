import { z } from 'zod';

export const patchProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    about: z.string().optional(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    })).optional(),
    experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      issueDate: z.string().optional(),
      credentialId: z.string().optional(),
    })).optional(),
    skills: z.array(z.object({
      name: z.string(),
      level: z.string().optional(),
    })).optional(),
    achievements: z.array(z.string()).optional(),
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
    careerGoal: z.enum(['internship', 'job', 'startup', 'scholarship', 'higher_study', 'hackathon', 'freelance', 'networking']).optional(),
  }),
});
