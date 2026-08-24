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

export const applyToRole = async (req: Request, res: Response) => {
  const projectId = req.params.id as string;
  const { roleTitle, message } = req.body;
  const application = await projectService.applyToRole(req.user!.userId, projectId, roleTitle, message);
  sendSuccess(res, application, 201);
};

export const getApplications = async (req: Request, res: Response) => {
  const projectId = req.params.id as string;
  const applications = await projectService.getApplications(projectId);
  sendSuccess(res, applications, 200);
};

export const resolveApplication = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const appId = req.params.appId as string;
  const { status } = req.body;
  const application = await projectService.resolveApplication(id, appId, status);
  sendSuccess(res, application, 200);
};

export const uploadCover = async (req: Request, res: Response) => {
  if (!req.file) throw new Error('No image file provided');
  const id = req.params.id as string;
  const coverUrl = req.file.path;
  const project = await projectService.updateProject(id, { coverUrl });
  sendSuccess(res, project, 200);
};
