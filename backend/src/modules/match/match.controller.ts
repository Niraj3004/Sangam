import { Request, Response } from 'express';
import * as matchService from './match.service';
import { sendSuccess } from '../../utils/response';

export const getPeopleMatches = async (req: Request, res: Response) => {
  const suggestions = await matchService.getPeopleMatches(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};

export const getProjectMatches = async (req: Request, res: Response) => {
  const suggestions = await matchService.getProjectMatches(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};

export const getIdeaMatches = async (req: Request, res: Response) => {
  const suggestions = await matchService.getIdeaMatches(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};
