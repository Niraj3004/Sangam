import { ActionPlan } from '../../models/ActionPlan';
import { Profile } from '../../models/Profile';
import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { copilotActionPlanSchema } from '../../models/ai-schemas/copilot.schema';

export const getActionPlan = async (userId: string) => {
  let plan = await ActionPlan.findOne({ userId });

  // If no plan exists, or it's expired, we create a placeholder (AI Seam)
  if (!plan || new Date() > plan.validUntil) {
    const profile = await Profile.findOne({ userId });
    const careerGoal = profile?.careerGoal || 'Build my professional profile';

    const textPayload = `
      Student Profile:
      - Career Goal: ${careerGoal}
      - Skills: ${(profile?.skills || []).map(s => s.name).join(', ') || 'None'}
      - Interests: ${(profile?.interests || []).join(', ') || 'None'}
      - About: ${profile?.about || 'None'}
      
      Generate a weekly action plan to help them reach their career goal.
    `;

    try {
      const aiResponse = await gateway.extract(copilotActionPlanSchema, textPayload, aiConfig.taskProfiles.explain);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      if (plan) {
        await ActionPlan.deleteOne({ _id: plan._id });
      }

      plan = await ActionPlan.create({
        userId,
        careerGoal,
        skillGaps: aiResponse.skillGaps || [],
        items: (aiResponse.items || []).map((item: any) => ({
          ...item,
          isCompleted: false
        })),
        validUntil: nextWeek,
      });
    } catch (e) {
      console.error('[CopilotService] AI Plan Generation Failed:', e);
      throw new Error('Failed to generate AI action plan.');
    }
  }

  return plan;
};

export const updatePlanItem = async (userId: string, itemId: string, isCompleted: boolean) => {
  const plan = await ActionPlan.findOneAndUpdate(
    { userId, 'items._id': itemId },
    { $set: { 'items.$.isCompleted': isCompleted } },
    { new: true }
  );

  if (!plan) throw new Error('Plan or item not found');
  return plan;
};

export const chatWithCopilot = async (userId: string, message: string) => {
  const profile = await Profile.findOne({ userId }).lean();
  
  const systemContext = `
    You are Sangam Copilot, an expert AI career coach for Nepali students.
    Student Profile:
    - Goal: ${profile?.careerGoal || 'Unknown'}
    - Skills: ${(profile?.skills || []).map(s => s.name).join(', ') || 'None'}
    
    Keep your response very concise, actionable, and encouraging.
  `;

  try {
    const reply = await gateway.chat([
      { role: 'system', content: systemContext },
      { role: 'user', content: message }
    ], aiConfig.taskProfiles.explain);

    return {
      reply,
      suggestedActions: [] // Future expansion for suggested deep links
    };
  } catch (e) {
    console.error('[CopilotService] Chat failed:', e);
    throw new Error('Copilot chat failed.');
  }
};
