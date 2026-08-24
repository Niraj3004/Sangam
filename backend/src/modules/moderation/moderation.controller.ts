import { Request, Response } from 'express';
import * as moderationService from './moderation.service';
import { sendSuccess } from '../../utils/response';

export const getReportsQueue = async (req: Request, res: Response) => {
  const queue = await moderationService.getReportsQueue();
  sendSuccess(res, queue, 200);
};

export const resolveReport = async (req: Request, res: Response) => {
  const { action } = req.body;
  const id = req.params.id as string;
  const report = await moderationService.resolveReport(id, req.user!.userId, action);
  sendSuccess(res, report, 200);
};

export const getFlagsQueue = async (req: Request, res: Response) => {
  const queue = await moderationService.getFlagsQueue();
  sendSuccess(res, queue, 200);
};

export const actOnFlag = async (req: Request, res: Response) => {
  const { action } = req.body;
  const id = req.params.id as string;
  const flag = await moderationService.actOnFlag(id, req.user!.userId, action);
  sendSuccess(res, flag, 200);
};
