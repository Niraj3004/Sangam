import { gateway } from '../ai-gateway';
import { aiConfig } from '../../config/ai';
import { opportunityExtractionSchema } from './schema';

export interface ExtractedOpportunity {
  type: string;
  title: string;
  org: string;
  description: string;
  field: string;
  deadline?: Date;
  location: string;
  remote: boolean;
  url: string;
  eligibility: string[];
  confidence: number;
}

export const extractOpportunity = async (rawText: string): Promise<ExtractedOpportunity> => {
  // 1. Call AI Gateway with the extraction task profile
  const rawJson = await gateway.extract(opportunityExtractionSchema, rawText, aiConfig.taskProfiles.extract);

  // 2. Normalization
  
  // Normalize Date
  let deadline: Date | undefined;
  if (rawJson.deadline && rawJson.deadline.trim() !== '') {
    const parsedDate = new Date(rawJson.deadline);
    if (!isNaN(parsedDate.getTime())) {
      deadline = parsedDate;
    }
  }

  // Normalize Location and Remote
  const location = rawJson.location || '';
  const remote = Boolean(rawJson.remote);

  // Normalize Eligibility array
  const eligibility = Array.isArray(rawJson.eligibility) ? rawJson.eligibility.map((e: any) => String(e).toLowerCase().trim()) : [];

  return {
    type: rawJson.type || 'project',
    title: rawJson.title || 'Unknown Title',
    org: rawJson.org || 'Unknown Org',
    description: rawJson.description || '',
    field: rawJson.field || 'General',
    deadline,
    location,
    remote,
    url: rawJson.url || '',
    eligibility,
    confidence: Number(rawJson.confidence) || 0,
  };
};
