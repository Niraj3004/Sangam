import { ActionPlan } from '../../models/ActionPlan';
import { Profile } from '../../models/Profile';

export const getActionPlan = async (userId: string) => {
  let plan = await ActionPlan.findOne({ userId });

  // If no plan exists, or it's expired, we create a placeholder (AI Seam)
  if (!plan || new Date() > plan.validUntil) {
    const profile = await Profile.findOne({ userId });
    const careerGoal = profile?.careerGoal || 'Build my professional profile';

    // AI GATEWAY SEAM: In Part 2, this calls the Claude API passing the profile and careerGoal
    // const aiResponse = await callAiGateway(profile, 'generate_action_plan');
    
    // For now, we generate a static placeholder plan based on the goal
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Idempotent replace if expired
    if (plan) {
      await ActionPlan.deleteOne({ _id: plan._id });
    }

    plan = await ActionPlan.create({
      userId,
      careerGoal,
      skillGaps: ['Advanced React', 'System Design'],
      items: [
        {
          title: 'Update Portfolio',
          description: 'Add your latest academic project to your profile.',
          type: 'general',
          reasoning: `Essential for your goal: ${careerGoal}`,
          isCompleted: false,
        },
        {
          title: 'Learn React Hooks',
          description: 'Complete a tutorial on useEffect and useContext.',
          type: 'skill',
          reasoning: 'Fills a direct skill gap identified in your profile.',
          isCompleted: false,
        }
      ],
      validUntil: nextWeek,
    });
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
  // AI GATEWAY SEAM: In Part 2, this passes the message + user profile context to Claude
  // const reply = await callAiGateway(profile, 'chat', message);
  
  return {
    reply: `This is a placeholder AI response to: "${message}". In Part 2, I will be a fully functional career copilot aware of your profile and goals!`,
    suggestedActions: []
  };
};
