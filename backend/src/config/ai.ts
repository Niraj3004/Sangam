// This is a stub for the AI Gateway (Anthropic API wrapper).
// To be implemented in Part 2.
import { env } from './env.config';

export const extractStructuredData = async (text: string) => {
  console.log('[AI STUB] Extracting data from text...');
  return {
    title: 'Stub Opportunity',
    description: 'Extracted description stub.',
    confidence: 0.9,
  };
};

export const moderateContent = async (text: string) => {
  console.log('[AI STUB] Moderating content...');
  return { isSafe: true, reason: 'Stub reason' };
};
