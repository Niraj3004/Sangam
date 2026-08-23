import { Request, Response } from 'express';
import { User } from '../../models/User';
import { sendSuccess } from '../../utils/response';

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
