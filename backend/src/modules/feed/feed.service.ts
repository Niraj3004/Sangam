import { Opportunity } from '../../models/Opportunity';
import { UserInteraction } from '../../models/UserInteraction';
import { Profile } from '../../models/Profile';
import { rankOpportunities } from './relevance.service';

export const getPersonalizedFeed = async (userId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  // 1. Fetch user profile to understand baseline interests
  const profile = await Profile.findOne({ userId });
  const userInterests = profile?.interests || [];
  const userSkills = profile?.skills.map(s => s.name) || [];

  // 2. Fetch "not_relevant" interactions to exclude them
  const negativeInteractions = await UserInteraction.find({
    userId,
    interactionType: 'not_relevant',
  }).select('entityId');
  const excludedIds = negativeInteractions.map(i => i.entityId);

  // 3. Build a baseline query for active opportunities
  // We prioritize urgent deadlines (e.g. closing in next 7 days) and matched skills
  // Full AI semantic matching is a seam for Part 2
  
  const query: any = { 
    status: 'active',
    _id: { $nin: excludedIds }
  };

  // Basic relevance boost (Mongoose text search if we had a query, but here we just sort)
  // For MVP personalization without AI:
  // Sort by deadline ascending (urgency) and trustScore descending.
  
  const [opportunities, total] = await Promise.all([
    Opportunity.find(query)
      .sort({ endDate: 1, trustScore: -1 })
      .skip(skip)
      .limit(limit)
      .populate('posterId', 'role verifyTier')
      .lean(),
    Opportunity.countDocuments(query)
  ]);

  // 4. AI Relevance Ranking (The B6 seam)
  let rankedOpportunities: any[] = opportunities;

  if (profile && opportunities.length > 0) {
    const aiRankings = await rankOpportunities(
      {
        careerGoal: profile.careerGoal,
        skills: profile.skills.map((s: any) => s.name),
        interests: profile.interests
      },
      opportunities.map(o => ({
        id: o._id.toString(),
        title: o.title,
        type: o.type,
        description: o.description,
        tags: o.tags,
        field: o.field
      }))
    );

    // Map rankings back to opportunities
    const rankingMap = new Map(aiRankings.map(r => [r.opportunityId, r]));
    
    rankedOpportunities = opportunities.map(o => {
      const ranking = rankingMap.get(o._id.toString());
      return {
        ...o,
        relevanceScore: ranking?.relevanceScore || 0,
        relevanceReason: ranking?.reason || ''
      };
    }).sort((a: any, b: any) => b.relevanceScore - a.relevanceScore); // Sort highly relevant first
  }

  return {
    opportunities: rankedOpportunities,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const trackInteraction = async (userId: string, data: any) => {
  // Upsert the interaction. If they already viewed it, maybe update weight or timestamp.
  const interaction = await UserInteraction.findOneAndUpdate(
    { userId, entityId: data.entityId, interactionType: data.interactionType },
    { ...data, userId },
    { new: true, upsert: true }
  );

  return interaction;
};
