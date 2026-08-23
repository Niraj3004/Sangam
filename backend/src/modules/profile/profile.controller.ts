import { Request, Response } from 'express';
import * as profileService from './profile.service';
import { sendSuccess } from '../../utils/response';

export const getMyProfile = async (req: Request, res: Response) => {
  const profile = await profileService.getMyProfile(req.user!.userId);
  sendSuccess(res, profile, 200);
};

export const patchMyProfile = async (req: Request, res: Response) => {
  const profile = await profileService.patchMyProfile(req.user!.userId, req.body);
  sendSuccess(res, profile, 200);
};

export const getProfileByHandle = async (req: Request, res: Response) => {
  const handle = req.params.handle as string;
  const profile = await profileService.getProfileByHandle(handle);
  sendSuccess(res, profile, 200);
};
