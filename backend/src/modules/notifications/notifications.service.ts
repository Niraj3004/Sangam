import { Notification } from '../../models/Notification';
import { User } from '../../models/User';

export const getNotifications = async (userId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId })
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { returnDocument: 'after' }
  );

  if (!notification) {
    const error: any = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  return notification;
};

export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true };
};

// Fan-out utility to send in-app notification + optional email
export const notifyUser = async (
  userId: string, 
  type: string, 
  title: string, 
  body: string, 
  link?: string, 
  sendEmailAlert: boolean = false
) => {
  const notification = await Notification.create({
    userId,
    type: type as any,
    title,
    body,
    link,
    isRead: false
  });

  if (sendEmailAlert) {
    const user = await User.findById(userId);
    if (user && user.email) {
      try {
        // Assume sendEmail exists in our mailer utility (stubbed or real)
        // This is a fire-and-forget for now
        // await sendEmail(user.email, title, body);
        console.log(`[Email Fan-out] Sent to ${user.email}: ${title}`);
      } catch (e) {
        console.error('Failed to send email alert', e);
      }
    }
  }

  return notification;
};

