import { Request, Response } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.register(email, password);
  sendSuccess(res, tokens, 201);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.login(email, password);
  sendSuccess(res, tokens, 200);
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh(refreshToken);
  sendSuccess(res, tokens, 200);
};

export const googleAuth = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  const tokens = await authService.googleAuth(idToken);
  sendSuccess(res, tokens, 200);
};

export const getMe = async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId);
  sendSuccess(res, user, 200);
};
