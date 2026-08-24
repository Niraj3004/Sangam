import { Request, Response } from 'express';
import * as portfolioService from './portfolio.service';
import { sendSuccess } from '../../utils/response';

export const getPortfolio = async (req: Request, res: Response) => {
  const data = await portfolioService.getPortfolio(req.params.handle as string);
  sendSuccess(res, data, 200);
};

export const updatePortfolioConfig = async (req: Request, res: Response) => {
  const config = await portfolioService.updatePortfolioConfig(req.user!.userId, req.body);
  sendSuccess(res, config, 200);
};
