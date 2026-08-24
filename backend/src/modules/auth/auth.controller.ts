import { Request, Response } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export const register = async (req: Request, res: Response) => {
  const { email, password, handle } = req.body;
  const result = await authService.register(email, password, handle);
  sendSuccess(res, { message: 'OTP sent to email', ...result }, 201);
};

export const registerOrg = async (req: Request, res: Response) => {
  const { email, password, handle, orgName, orgType, orgWebsite, orgDescription } = req.body;
  const result = await authService.registerOrganization(email, password, handle, orgName, orgType, orgWebsite, orgDescription);
  sendSuccess(res, { message: 'OTP sent to email', ...result }, 201);
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.body;
  const user = await authService.verifyEmailOTP(req.user!.userId, code);
  sendSuccess(res, { message: 'Email verified successfully', user }, 200);
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

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  sendSuccess(res, { message: 'Logged out successfully' }, 200);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  sendSuccess(res, { message: 'If an account exists, a reset link has been sent' }, 200);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  sendSuccess(res, { message: 'Password reset successful' }, 200);
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

export const submitVerificationRequest = async (req: Request, res: Response) => {
  const { evidence, tierRequested } = req.body;
  const request = await authService.submitVerificationRequest(req.user!.userId, evidence, tierRequested);
  sendSuccess(res, request, 201);
};

export const getVerificationRequests = async (req: Request, res: Response) => {
  const requests = await authService.getVerificationRequests();
  sendSuccess(res, requests, 200);
};

export const resolveVerificationRequest = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { action, notes } = req.body;
  const request = await authService.resolveVerificationRequest(id, action, notes);
  sendSuccess(res, request, 200);
};

export const addSecondaryEmail = async (req: Request, res: Response) => {
  const { secondaryEmail } = req.body;
  await authService.addSecondaryEmail(req.user!.userId, secondaryEmail);
  sendSuccess(res, { message: 'OTP sent to secondary email' }, 200);
};

export const verifySecondaryEmail = async (req: Request, res: Response) => {
  const { secondaryEmail, code } = req.body;
  const user = await authService.verifySecondaryEmailOTP(req.user!.userId, secondaryEmail, code);
  sendSuccess(res, { message: 'Secondary email linked successfully', user }, 200);
};
