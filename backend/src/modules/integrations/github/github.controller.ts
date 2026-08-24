import { Request, Response } from 'express';
import * as githubService from './github.service';
import { sendSuccess } from '../../../utils/response';

export const connectGithub = async (req: Request, res: Response) => {
  const result = await githubService.connectGithub(req.user!.userId, req.body.username, req.body.token);
  sendSuccess(res, result, 200);
};

export const getPublicRepos = async (req: Request, res: Response) => {
  const repos = await githubService.getPublicRepos(req.user!.userId);
  sendSuccess(res, repos, 200);
};

export const importRepository = async (req: Request, res: Response) => {
  const repos = await githubService.importRepository(req.user!.userId, req.body);
  sendSuccess(res, repos, 200);
};
