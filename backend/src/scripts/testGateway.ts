import dotenv from 'dotenv';
dotenv.config();

import { rankOpportunities } from '../modules/feed/relevance.service';
import { moderateText } from '../modules/moderation/moderation.service';
import { aiConfig } from '../config/ai';

const runTest = async () => {
  if (aiConfig.geminiApiKeys.length === 0) {
    console.log('Skipping API test: No GEMINI_API_KEYs provided in .env');
    return;
  }

  console.log('--- Testing AI Gateway (A6 Moderation) ---');

  const safeText = "I'm looking for a study buddy for my computer science algorithms class this semester.";
  const scamText = "URGENT: Work from home and earn $5000 a week! Just pay a $50 registration fee to get started. Must send crypto.";

  console.log('\n1. Moderating Safe Text...');
  const startSafe = Date.now();
  const resSafe = await moderateText(safeText);
  console.log(`Result:`, resSafe);
  console.log(`Time taken: ${Date.now() - startSafe}ms`);

  console.log('\n2. Moderating Scam Text...');
  const startScam = Date.now();
  const resScam = await moderateText(scamText);
  console.log(`Result:`, resScam);
  console.log(`Time taken: ${Date.now() - startScam}ms`);
};

runTest().catch(console.error);
