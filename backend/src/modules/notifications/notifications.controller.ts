import { Request, Response } from 'express';
import { User } from '../../models/User';
import { sendSuccess } from '../../utils/response';
import * as notificationsService from './notifications.service';

export const getPreferences = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId).select('notificationPrefs');
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  // If undefined for some old users, default will kick in via schema, but we can safely return what is there.
  sendSuccess(res, user.notificationPrefs || {}, 200);
};

export const updatePreferences = async (req: Request, res: Response) => {
  const updates = req.body;
  const user = await User.findById(req.user!.userId);
  
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.notificationPrefs = {
    ...user.notificationPrefs,
    ...updates
  };

  await user.save();
  sendSuccess(res, user.notificationPrefs, 200);
};

export const getNotifications = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await notificationsService.getNotifications(req.user!.userId, pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const markAsRead = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const notification = await notificationsService.markAsRead(req.user!.userId, id);
  sendSuccess(res, notification, 200);
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const result = await notificationsService.markAllAsRead(req.user!.userId);
  sendSuccess(res, result, 200);
};
