import { Request, Response } from 'express';
import * as communitiesService from './communities.service';
import { sendSuccess } from '../../utils/response';

export const getCommunities = async (req: Request, res: Response) => {
  const { q, type, page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await communitiesService.getCommunities(
    q as string,
    type as string,
    pageNum,
    limitNum
  );
  
  sendSuccess(res, result, 200);
};

export const joinCommunity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const membership = await communitiesService.joinCommunity(req.user!.userId, id);
  sendSuccess(res, membership, 201);
};

export const leaveCommunity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await communitiesService.leaveCommunity(req.user!.userId, id);
  sendSuccess(res, result, 200);
};

export const uploadIcon = async (req: Request, res: Response) => {
  if (!req.file) throw new Error('No image file provided');
  const id = req.params.id as string;
  const iconUrl = req.file.path;
  const community = await communitiesService.updateCommunity(id, { iconUrl });
  sendSuccess(res, community, 200);
};
