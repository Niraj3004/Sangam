import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { Profile } from '../../models/Profile';
import { profileAssistantSchema } from '../../models/ai-schemas/assistant.schema';

export interface ProfileReviewResult {
  suggestions: string[];
  generatedSummary: string;
}

export const reviewProfile = async (userId: string): Promise<ProfileReviewResult> => {
  const profile = await Profile.findOne({ userId }).lean();
  
  if (!profile) {
    throw new Error('Profile not found for this user.');
  }

  const textPayload = `
    Student Profile Analysis:
    - About: ${profile.about || 'Not provided'}
    - Career Goal: ${profile.careerGoal || 'Not provided'}
    - Skills: ${(profile.skills || []).map(s => s.name).join(', ') || 'None'}
    - Interests: ${(profile.interests || []).join(', ') || 'None'}
    - Looking For: ${(profile.lookingFor || []).join(', ') || 'None'}

    Please act as an expert career coach and review this profile. Provide suggestions for improvement and generate a strong professional summary for a CV.
  `;

  try {
    // We use 'explain' profile because we want creative/coaching text, but we use the gateway's 'extract' method to force it into our JSON schema.
    const result = await gateway.extract(profileAssistantSchema, textPayload, aiConfig.taskProfiles.explain);
    
    return {
      suggestions: result.suggestions || [],
      generatedSummary: result.generatedSummary || ''
    };
  } catch (error) {
    console.error('[AssistantService] AI Review failed:', error);
    throw new Error('Failed to generate profile review.');
  }
};
