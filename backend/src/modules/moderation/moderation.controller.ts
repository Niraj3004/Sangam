import { Request, Response } from 'express';
import * as moderationService from './moderation.service';
import { sendSuccess } from '../../utils/response';

export const submitReport = async (req: Request, res: Response) => {
  const { reportedEntityId, entityModel, reason } = req.body;
  const report = await moderationService.submitReport(req.user!.userId, reportedEntityId, entityModel, reason);
  sendSuccess(res, report, 201);
};

export const getQueue = async (req: Request, res: Response) => {
  const queue = await moderationService.getQueue();
  sendSuccess(res, queue, 200);
};

export const resolveReport = async (req: Request, res: Response) => {
  const { action } = req.body;
  const id = req.params.id as string;
  const report = await moderationService.resolveReport(id, req.user!.userId, action);
  sendSuccess(res, report, 200);
};
