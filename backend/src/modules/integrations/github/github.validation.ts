import { z } from 'zod';

export const connectGithubSchema = z.object({
  body: z.object({
    username: z.string().min(1),
    token: z.string().optional(), // PAT
  }),
});

export const importRepoSchema = z.object({
  body: z.object({
    repoName: z.string().min(1),
    description: z.string().optional(),
    url: z.string().url(),
    language: z.string().optional(),
    stars: z.number().optional().default(0),
  }),
});
