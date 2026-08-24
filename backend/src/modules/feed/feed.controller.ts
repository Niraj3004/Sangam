import { Request, Response } from 'express';
import * as feedService from './feed.service';
import { sendSuccess } from '../../utils/response';

export const getPersonalizedFeed = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await feedService.getPersonalizedFeed(req.user!.userId, pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const trackInteraction = async (req: Request, res: Response) => {
  const interaction = await feedService.trackInteraction(req.user!.userId, req.body);
  sendSuccess(res, interaction, 201);
};
