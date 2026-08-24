import { Request, Response } from 'express';
import * as copilotService from './copilot.service';
import { sendSuccess } from '../../utils/response';

export const getActionPlan = async (req: Request, res: Response) => {
  const plan = await copilotService.getActionPlan(req.user!.userId);
  sendSuccess(res, plan, 200);
};

export const updatePlanItem = async (req: Request, res: Response) => {
  const plan = await copilotService.updatePlanItem(req.user!.userId, req.params.itemId as string, req.body.isCompleted);
  sendSuccess(res, plan, 200);
};

export const chatWithCopilot = async (req: Request, res: Response) => {
  const response = await copilotService.chatWithCopilot(req.user!.userId, req.body.message);
  sendSuccess(res, response, 200);
};
