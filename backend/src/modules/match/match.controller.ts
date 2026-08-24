import { Request, Response } from 'express';
import * as matchService from './match.service';
import { sendSuccess } from '../../utils/response';

export const getPeopleMatches = async (req: Request, res: Response) => {
  const suggestions = await matchService.getPeopleMatches(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};

export const getProjectMatches = async (req: Request, res: Response) => {
  const suggestions = await matchService.getProjectMatches(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};

export const getIdeaMatches = async (req: Request, res: Response) => {
  const matches = await matchService.getIdeaMatches(req.user!.userId);
  sendSuccess(res, matches, 200);
};

export const getTeamCandidates = async (req: Request, res: Response) => {
  const matches = await matchService.getTeamCandidates(req.user!.userId, req.params.projectId as string);
  sendSuccess(res, matches, 200);
};

export const inviteToTeam = async (req: Request, res: Response) => {
  const result = await matchService.inviteToTeam(req.user!.userId, req.params.projectId as string, req.body.candidateId as string);
  sendSuccess(res, result, 200);
};
