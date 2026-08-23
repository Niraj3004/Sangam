import { Opportunity } from '../models/Opportunity';
import { SavedItem } from '../models/SavedItem';
import { User } from '../models/User';
import { sendEmail } from '../config/mailer';

export const processDeadlineReminders = async () => {
  console.log('[WORKER - REMINDERS] Starting deadline scan...');
  
  try {
    const now = new Date();
    // 3 days from now
    const targetDateStart = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    targetDateStart.setHours(0, 0, 0, 0);
    const targetDateEnd = new Date(targetDateStart);
    targetDateEnd.setHours(23, 59, 59, 999);

    // Find opportunities closing in exactly 3 days
    const upcomingDeadlines = await Opportunity.find({
      endDate: { $gte: targetDateStart, $lte: targetDateEnd },
      status: 'active'
    });

    if (!upcomingDeadlines.length) {
      console.log('[WORKER - REMINDERS] No deadlines approaching in 3 days.');
      return;
    }

    for (const opp of upcomingDeadlines) {
      // Find all users who saved this opportunity
      const saves = await SavedItem.find({ entityId: opp._id, entityModel: 'Opportunity' });
      
      for (const save of saves) {
        const user = await User.findById(save.userId);
        if (user && user.notificationPrefs?.emailReminders !== false) {
          await sendEmail(
            user.email,
            `Deadline Approaching: ${opp.title}`,
            `Hi, just a reminder that the opportunity "${opp.title}" you saved is closing in 3 days! Don't forget to apply.`
          );
        }
      }
    }

    console.log('[WORKER - REMINDERS] Finished deadline scan.');
  } catch (error) {
    console.error('[WORKER - REMINDERS] Error processing reminders:', error);
  }
};
