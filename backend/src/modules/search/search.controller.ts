import { Request, Response } from 'express';
import * as searchService from './search.service';
import { sendSuccess } from '../../utils/response';

export const globalSearch = async (req: Request, res: Response) => {
  const { q, type, page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await searchService.globalSearch(q as string, type as string, pageNum, limitNum);
  sendSuccess(res, result, 200);
};
