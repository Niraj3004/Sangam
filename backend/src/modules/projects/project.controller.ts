import { Request, Response } from 'express';
import * as projectService from './project.service';
import { sendSuccess } from '../../utils/response';

export const createProject = async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.user!.userId, req.body);
  sendSuccess(res, project, 201);
};

export const getProjects = async (req: Request, res: Response) => {
  const { q, page, limit, userId } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 10;
  
  const result = await projectService.getProjects(q as string, pageNum, limitNum, userId as string);
  sendSuccess(res, result, 200);
};

export const getProjectById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const project = await projectService.getProjectById(id);
  sendSuccess(res, project, 200);
};

export const updateProject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const project = await projectService.updateProject(id, req.body);
  sendSuccess(res, project, 200);
};

export const deleteProject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const project = await projectService.deleteProject(id);
  sendSuccess(res, project, 200);
};
