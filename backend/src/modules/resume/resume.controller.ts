import { Request, Response } from 'express';
import * as resumeService from './resume.service';
import { sendSuccess } from '../../utils/response';

export const generateResume = async (req: Request, res: Response) => {
  const resume = await resumeService.generateResume(req.user!.userId, req.body.targetJobId, req.body.title);
  sendSuccess(res, resume, 201);
};

export const getResumes = async (req: Request, res: Response) => {
  const resumes = await resumeService.getResumes(req.user!.userId);
  sendSuccess(res, resumes, 200);
};

export const updateResume = async (req: Request, res: Response) => {
  const resume = await resumeService.updateResume(req.user!.userId, req.params.id as string, req.body);
  sendSuccess(res, resume, 200);
};

export const exportResume = async (req: Request, res: Response) => {
  const result = await resumeService.exportResume(req.user!.userId, req.params.id as string);
  sendSuccess(res, result, 200);
};
