import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Opportunity } from '../models/Opportunity';
import { sendEmail } from '../config/mailer';
import { rankOpportunities } from '../modules/feed/relevance.service';
import { env } from '../config/env.config';

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

      // Find new opportunities matching their profile loosely
      const matchedOpportunities = await Opportunity.find(
        {
          createdAt: { $gte: oneWeekAgo },
          status: 'active',
          $text: { $search: searchTerms }
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } } as any)
      .limit(10); // Fetch a slightly larger pool for AI to rank

      if (matchedOpportunities.length > 0) {
        // AI Ranking Pass
        const aiRankings = await rankOpportunities(
          {
            careerGoal: profile.careerGoal,
            skills: profile.skills.map((s: any) => s.name),
            interests: profile.interests
          },
          matchedOpportunities.map(o => ({
            id: o._id.toString(),
            title: o.title,
            type: o.type,
            description: o.description,
            tags: o.tags,
            field: o.field
          }))
        );

        // Sort by AI relevance and take top 3
        const top3 = aiRankings
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 3);

        const emailBodyHtml = top3.map(ranking => {
          const opp = matchedOpportunities.find(o => o._id.toString() === ranking.opportunityId);
          return `<p><strong>${opp?.title} (${opp?.type})</strong><br/>${ranking.reason}</p>`;
        }).join('');
        
        await sendEmail(
          user.email,
          'Your Weekly Sangam Digest 📬',
          'Your Curated Opportunities',
          `<p>Based on your profile, here are the top opportunities matching your goals this week:</p>
           ${emailBodyHtml}`,
          `${env.CLIENT_URL}/discover`,
          'View More on Sangam'
        );
      }
    }

    console.log('[WORKER - DIGEST] Finished weekly digest generation.');
  } catch (error) {
    console.error('[WORKER - DIGEST] Error processing digests:', error);
  }
};
