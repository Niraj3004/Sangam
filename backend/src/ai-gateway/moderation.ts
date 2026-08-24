import { ModerationFlag } from '../models/ModerationFlag';
import mongoose from 'mongoose';

/**
 * AI Gateway Moderation Hook (Stub for Part 2 A6)
 * This function will send content to Claude via the AI Gateway to evaluate for TOS violations,
 * spam, scams, and toxicity. If it crosses a threshold, a ModerationFlag is created.
 */
export const evaluateModeration = async (
  entityId: mongoose.Types.ObjectId | string,
  entityModel: string,
  content: string
) => {
  // TODO: Part 2 (A6) - Wire to Claude via Anthropic API
  console.log(`[AI-Gateway Stub] Evaluating moderation for ${entityModel} ${entityId}`);
  
  // Basic rule-based stub: flag if it contains "scam" or "spam"
  const text = content.toLowerCase();
  if (text.includes('scam') || text.includes('spam') || text.includes('crypto guarantee')) {
    console.log(`[AI-Gateway Stub] Flagged ${entityModel} ${entityId} for moderation review`);
    
    await ModerationFlag.create({
      entityId,
      entityModel: entityModel as any,
      confidenceScore: 0.95,
      flagReason: 'Automated flagging: Content matched banned keywords (scam/spam).',
      status: 'pending'
    });
  }
};
