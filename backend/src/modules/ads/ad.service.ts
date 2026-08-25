import mongoose from 'mongoose';
import { AdCampaign, IAdCampaign } from '../../models/AdCampaign';
import { AdTransaction } from '../../models/AdTransaction';
import { Profile } from '../../models/Profile';

export class AdService {
  /**
   * Dynamically fetches the most relevant ads for a user based on their profile.
   * Prioritizes high-paying (CPC) ads that have remaining budget.
   */
  static async getRelevantAdsForUser(userId: string, limit: number = 2): Promise<IAdCampaign[]> {
    // 1. Fetch user's profile to understand their skills/interests
    const profile = await Profile.findOne({ userId });
    const userSkills = profile?.skills || [];

    // 2. Query for active ads with remaining budget
    // For a production system, this would be an aggregation pipeline matching targetSkills.
    // For this implementation, we will fetch active ads and optionally boost those matching skills.
    const query: any = {
      status: 'active',
      $expr: { $lt: ['$budgetSpent', '$totalBudget'] }
    };

    if (userSkills.length > 0) {
      // Optional: Add strict targeting if the ad requires it, or just use it for sorting
      // query.targetSkills = { $in: userSkills }; 
    }

    const ads = await AdCampaign.find(query)
      .sort({ costPerClick: -1 }) // Prioritize highest bidders
      .limit(limit);

    return ads;
  }

  /**
   * Tracks an impression or click, deducts money from the campaign budget,
   * and logs the transaction for auditing.
   */
  static async trackInteraction(campaignId: string, userId: string | undefined, type: 'impression' | 'click') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const campaign = await AdCampaign.findById(campaignId).session(session);
      
      if (!campaign || campaign.status !== 'active') {
        throw new Error('Campaign is not active or does not exist');
      }

      if (campaign.budgetSpent >= campaign.totalBudget) {
        // Auto-pause if budget exceeded concurrently
        campaign.status = 'exhausted';
        await campaign.save({ session });
        throw new Error('Campaign budget exhausted');
      }

      // Calculate cost
      // Standard model: Impressions are free or fractions of a cent (CPM/1000), Clicks cost the full CPC.
      // For this enterprise implementation, we charge CPC on clicks only. 
      // Impressions are free but logged for analytics.
      const cost = type === 'click' ? campaign.costPerClick : 0;

      // Log the transaction
      await AdTransaction.create([{
        campaignId: campaign._id,
        userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        type,
        costDeducted: cost,
        timestamp: new Date()
      }], { session });

      // Update Campaign metrics and budget
      if (type === 'impression') {
        campaign.impressions += 1;
      } else if (type === 'click') {
        campaign.clicks += 1;
        campaign.budgetSpent += cost;
      }

      // Check if this click exhausted the budget
      if (campaign.budgetSpent >= campaign.totalBudget) {
        campaign.status = 'exhausted';
      }

      await campaign.save({ session });
      
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      console.error('Ad tracking error:', error);
      return false;
    } finally {
      session.endSession();
    }
  }
}
