import { Request, Response } from 'express';
import * as ideasService from './ideas.service';
import { sendSuccess } from '../../utils/response';
import { Idea } from '../../models/Idea';

export const getIdeaOwnerId = async (resourceId: string) => {
  const idea = await Idea.findById(resourceId);
  return idea ? idea.authorId.toString() : null;
};

export const createIdea = async (req: Request, res: Response) => {
  const idea = await ideasService.createIdea(req.user!.userId, req.body);
  sendSuccess(res, idea, 201);
};

export const getIdeas = async (req: Request, res: Response) => {
  const { query, status } = req.query;
  const ideas = await ideasService.getIdeas(query as string, status as string);
  sendSuccess(res, ideas, 200);
};

export const getIdeaById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const idea = await ideasService.getIdeaById(id);
  sendSuccess(res, idea, 200);
};

export const updateIdea = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const idea = await ideasService.updateIdea(id, req.body);
  sendSuccess(res, idea, 200);
};

export const deleteIdea = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const idea = await ideasService.deleteIdea(id);
  sendSuccess(res, idea, 200);
};
