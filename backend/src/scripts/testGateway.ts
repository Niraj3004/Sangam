import dotenv from 'dotenv';
dotenv.config();

import { reviewProfile } from '../modules/profile/assistant.service';
import { parseNLQuery } from '../modules/search/nl-search.service';
import { aiConfig } from '../config/ai';
import { Profile } from '../models/Profile';
import mongoose from 'mongoose';

const runTest = async () => {
  if (aiConfig.geminiApiKeys.length === 0) {
    console.log('Skipping API test: No GEMINI_API_KEYs provided in .env');
    return;
  }

  console.log('--- Testing AI Gateway (A7 & A8) ---');

  // Mocking a profile for A7
  (Profile as any).findOne = () => ({
    lean: () => Promise.resolve({
      userId: new mongoose.Types.ObjectId(),
      bio: 'I like code.',
      careerGoal: 'get a job',
      skills: [{ name: 'HTML' }],
      interests: ['web']
    })
  });

  console.log('\n1. Testing Profile Assistant (A7)...');
  const startA7 = Date.now();
  const resA7 = await reviewProfile('dummyId');
  console.log(`Result:`, JSON.stringify(resA7, null, 2));
  console.log(`Time taken: ${Date.now() - startA7}ms`);

  console.log('\n2. Testing Natural-Language Search Parsing (A8)...');
  const query = "Nepali React developers open to a part-time remote project";
  const startA8 = Date.now();
  const resA8 = await parseNLQuery(query);
  console.log(`Result:`, JSON.stringify(resA8, null, 2));
  console.log(`Time taken: ${Date.now() - startA8}ms`);
};

runTest().catch(console.error);
