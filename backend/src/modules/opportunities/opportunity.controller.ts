import { Request, Response } from 'express';
import * as opportunityService from './opportunity.service';
import { sendSuccess } from '../../utils/response';

export const createOpportunity = async (req: Request, res: Response) => {
  const opportunity = await opportunityService.createOpportunity(req.user!.userId, req.body);
  sendSuccess(res, opportunity, 201);
};

export const getOpportunities = async (req: Request, res: Response) => {
  const { q, page, limit, type } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 10;
  
  const result = await opportunityService.getOpportunities(q as string, pageNum, limitNum, type as string);
  sendSuccess(res, result, 200);
};

export const getOpportunityById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const opportunity = await opportunityService.getOpportunityById(id);
  sendSuccess(res, opportunity, 200);
};

export const updateOpportunity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const opportunity = await opportunityService.updateOpportunity(id, req.body);
  sendSuccess(res, opportunity, 200);
};

export const deleteOpportunity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const opportunity = await opportunityService.deleteOpportunity(id);
  sendSuccess(res, opportunity, 200);
};

export const saveOpportunity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const saved = await opportunityService.saveOpportunity(req.user!.userId, id);
  sendSuccess(res, saved, 201);
};

export const unsaveOpportunity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await opportunityService.unsaveOpportunity(req.user!.userId, id);
  sendSuccess(res, result, 200);
};
