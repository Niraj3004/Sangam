import { Request, Response } from 'express';
import * as mentorshipService from './mentorship.service';
import { sendSuccess } from '../../utils/response';

export const requestMentorship = async (req: Request, res: Response) => {
  const { mentorId, purpose } = req.body;
  const mentorship = await mentorshipService.requestMentorship(req.user!.userId, mentorId, purpose);
  sendSuccess(res, mentorship, 201);
};

export const getMyRequests = async (req: Request, res: Response) => {
  const requests = await mentorshipService.getMyRequests(req.user!.userId);
  sendSuccess(res, requests, 200);
};

export const getMyMentorships = async (req: Request, res: Response) => {
  const mentorships = await mentorshipService.getMyMentorships(req.user!.userId);
  sendSuccess(res, mentorships, 200);
};

export const acceptMentorship = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { scheduledAt, meetingLink } = req.body;
  
  const mentorship = await mentorshipService.acceptMentorship(req.user!.userId, id, new Date(scheduledAt), meetingLink);
  sendSuccess(res, mentorship, 200);
};

export const declineMentorship = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const mentorship = await mentorshipService.declineMentorship(req.user!.userId, id);
  sendSuccess(res, mentorship, 200);
};
