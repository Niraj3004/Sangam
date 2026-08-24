import { Request, Response } from 'express';
import * as jobsService from './jobs.service';
import { sendSuccess } from '../../utils/response';

export const createJob = async (req: Request, res: Response) => {
  const job = await jobsService.createJob(req.user!.userId, req.body);
  sendSuccess(res, job, 201);
};

export const getJobs = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await jobsService.getJobs(pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const getJobById = async (req: Request, res: Response) => {
  const id = req.params.jobId as string;
  const job = await jobsService.getJobById(id);
  sendSuccess(res, job, 200);
};

export const applyForJob = async (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const { resumeUrl, coverLetter } = req.body;
  
  const application = await jobsService.applyForJob(req.user!.userId, jobId, resumeUrl, coverLetter);
  sendSuccess(res, application, 201);
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  const appId = req.params.appId as string;
  const { status } = req.body;

  const app = await jobsService.updateApplicationStatus(req.user!.userId, jobId, appId, status);
  sendSuccess(res, app, 200);
};
