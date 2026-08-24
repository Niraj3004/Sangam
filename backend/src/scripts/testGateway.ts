import dotenv from 'dotenv';
dotenv.config();

import { gateway } from '../modules/ai-gateway';
import { aiConfig } from '../config/ai';

const runTest = async () => {
  if (!aiConfig.anthropicApiKey) {
    console.log('Skipping API test: No ANTHROPIC_API_KEY provided in .env');
    return;
  }

  console.log('--- Testing AI Gateway ---');

  const schema = {
    title: 'string',
    confidence: 'number (0-1)'
  };
  const text = 'Looking for a React developer for a part-time remote gig.';

  console.log('\n1. First call (should MISS cache and hit API)...');
  const start1 = Date.now();
  const res1 = await gateway.extract(schema, text, aiConfig.taskProfiles.extract);
  console.log(`Result:`, res1);
  console.log(`Time taken: ${Date.now() - start1}ms`);

  console.log('\n2. Second call (should HIT cache)...');
  const start2 = Date.now();
  const res2 = await gateway.extract(schema, text, aiConfig.taskProfiles.extract);
  console.log(`Result:`, res2);
  console.log(`Time taken: ${Date.now() - start2}ms`);
};

runTest().catch(console.error);
