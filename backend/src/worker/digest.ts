import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Opportunity } from '../models/Opportunity';
import { sendEmail } from '../config/mailer';

export const processWeeklyDigests = async () => {
  console.log('[WORKER - DIGEST] Starting weekly digest generation...');

  try {
    const users = await User.find({ 'notificationPrefs.emailDigests': { $ne: false } });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const user of users) {
      const profile = await Profile.findOne({ userId: user._id });
      if (!profile) continue;

      // Create a search string from user's skills and interests
      const searchTerms = [
        ...profile.skills.map(s => s.name),
        ...profile.interests,
        ...profile.lookingFor
      ].join(' ');

      if (!searchTerms.trim()) continue;

      // Find new opportunities matching their profile
      const matchedOpportunities = await Opportunity.find(
        {
          createdAt: { $gte: oneWeekAgo },
          status: 'active',
          $text: { $search: searchTerms }
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } } as any)
      .limit(3);

      if (matchedOpportunities.length > 0) {
        const emailBody = matchedOpportunities.map(opp => `- ${opp.title} (${opp.type})`).join('\n');
        
        await sendEmail(
          user.email,
          'Your Weekly Sangam Digest',
          `Here are the top opportunities matching your profile this week:\n\n${emailBody}`
        );
      }
    }

    console.log('[WORKER - DIGEST] Finished weekly digest generation.');
  } catch (error) {
    console.error('[WORKER - DIGEST] Error processing digests:', error);
  }
};
