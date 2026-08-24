import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';
import { sendSuccess } from '../../utils/response';

export const getStudentDashboard = async (req: Request, res: Response) => {
  const result = await dashboardService.getStudentDashboard(req.user!.userId);
  sendSuccess(res, result, 200);
};
