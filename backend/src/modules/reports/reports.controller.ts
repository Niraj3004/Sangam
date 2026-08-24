import { Request, Response } from 'express';
import * as reportsService from './reports.service';
import { sendSuccess } from '../../utils/response';

export const createReport = async (req: Request, res: Response) => {
  const { entityId, entityModel, reason } = req.body;
  const report = await reportsService.createReport(req.user!.userId, entityId, entityModel, reason);
  sendSuccess(res, report, 201);
};
