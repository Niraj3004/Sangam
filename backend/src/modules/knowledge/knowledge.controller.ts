import { Request, Response } from 'express';
import * as knowledgeService from './knowledge.service';
import { sendSuccess } from '../../utils/response';

export const createPost = async (req: Request, res: Response) => {
  const communityId = req.params.communityId as string;
  const post = await knowledgeService.createPost(req.user!.userId, communityId, req.body);
  sendSuccess(res, post, 201);
};

export const getCommunityPosts = async (req: Request, res: Response) => {
  const communityId = req.params.communityId as string;
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await knowledgeService.getCommunityPosts(req.user!.userId, communityId, pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const getPost = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;
  const post = await knowledgeService.getPost(req.user!.userId, postId);
  sendSuccess(res, post, 200);
};

export const createComment = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;
  const { content } = req.body;
  const comment = await knowledgeService.createComment(req.user!.userId, postId, content);
  sendSuccess(res, comment, 201);
};

export const getComments = async (req: Request, res: Response) => {
  const postId = req.params.postId as string;
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 50;

  const result = await knowledgeService.getComments(req.user!.userId, postId, pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const uploadPostImage = async (req: Request, res: Response) => {
  if (!req.file) throw new Error('No image file provided');
  // Just return the uploaded URL so the frontend can embed it into a post payload or markdown text
  sendSuccess(res, { imageUrl: req.file.path }, 200);
};
