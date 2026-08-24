import { Request, Response } from 'express';
import * as organizationsService from './organizations.service';
import { sendSuccess } from '../../utils/response';

export const createOrganization = async (req: Request, res: Response) => {
  const org = await organizationsService.createOrganization(req.user!.userId, req.body);
  sendSuccess(res, org, 201);
};

export const getVerifiedOrganizations = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await organizationsService.getVerifiedOrganizations(pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const getOrganizationById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const org = await organizationsService.getOrganizationById(id);
  sendSuccess(res, org, 200);
};

export const uploadLogo = async (req: Request, res: Response) => {
  if (!req.file) throw new Error('No image file provided');
  const id = req.params.id as string;
  const logoUrl = req.file.path;
  const org = await organizationsService.updateOrganization(id, { logoUrl });
  sendSuccess(res, org, 200);
};
