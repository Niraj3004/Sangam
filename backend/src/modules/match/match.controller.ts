import { Request, Response } from 'express';
import * as matchService from './match.service';
import { sendSuccess } from '../../utils/response';

export const getMatchSuggestions = async (req: Request, res: Response) => {
  const suggestions = await matchService.getMatchSuggestions(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};
