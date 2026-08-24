import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { relevanceRankingSchema } from './relevance.schema';

export interface StudentProfileContext {
  careerGoal?: string;
  field?: string;
  skills: string[];
  interests: string[];
}

export interface OpportunityContext {
  id: string;
  title: string;
  type: string;
  description: string;
  tags: string[];
  field?: string;
}

export interface RankedOpportunity {
  opportunityId: string;
  relevanceScore: number;
  reason: string;
}

export const rankOpportunities = async (
  student: StudentProfileContext,
  opportunities: OpportunityContext[]
): Promise<RankedOpportunity[]> => {
  if (opportunities.length === 0) return [];

  const textPayload = `
    Student Profile:
    - Goal: ${student.careerGoal || 'None'}
    - Field: ${student.field || 'General'}
    - Skills: ${student.skills.join(', ')}
    - Interests: ${student.interests.join(', ')}

    Opportunities to rank:
    ${opportunities.map(o => `
    ID: ${o.id}
    Title: ${o.title}
    Type: ${o.type}
    Field: ${o.field || 'General'}
    Tags: ${o.tags.join(', ')}
    Description snippet: ${o.description.substring(0, 150)}...
    `).join('\n')}
  `;

  try {
    const result = await gateway.extract(relevanceRankingSchema, textPayload, aiConfig.taskProfiles.extract);
    return result.rankings || [];
  } catch (error) {
    console.error('[RelevanceService] AI Ranking failed, returning empty rankings.', error);
    return [];
  }
};
