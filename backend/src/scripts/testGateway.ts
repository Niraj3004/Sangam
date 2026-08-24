import dotenv from 'dotenv';
dotenv.config();

import { reviewProfile } from '../modules/profile/assistant.service';
import { parseNLQuery } from '../modules/search/nl-search.service';
import { getActionPlan, chatWithCopilot } from '../modules/copilot/copilot.service';
import { generateResume } from '../modules/resume/resume.service';
import { aiConfig } from '../config/ai';
import { Profile } from '../models/Profile';
import { ActionPlan } from '../models/ActionPlan';
import { Resume } from '../models/Resume';
import mongoose from 'mongoose';

const runTest = async () => {
  if (aiConfig.geminiApiKeys.length === 0) {
    console.log('Skipping API test: No GEMINI_API_KEYs provided in .env');
    return;
  }

  console.log('--- Testing AI Gateway (A7 & A8) ---');

  // Mocking a profile for A7
  (Profile as any).findOne = () => ({
    populate: () => ({
      lean: () => Promise.resolve({
        userId: new mongoose.Types.ObjectId(),
        bio: 'I like code.',
        about: 'I like code.',
        careerGoal: 'get a job',
        skills: [{ name: 'HTML' }, { name: 'JavaScript' }],
        interests: ['web'],
        projects: [{ title: 'Tic Tac Toe' }],
        education: ['BSc Computing']
      }) as any
    }),
    lean: () => Promise.resolve({
      userId: new mongoose.Types.ObjectId(),
      bio: 'I like code.',
      about: 'I like code.',
      careerGoal: 'get a job',
      skills: [{ name: 'HTML' }, { name: 'JavaScript' }],
      interests: ['web'],
      projects: [{ title: 'Tic Tac Toe' }],
      education: ['BSc Computing']
    }) as any
  });

  (ActionPlan as any).findOne = () => null;
  (ActionPlan as any).create = (data: any) => Promise.resolve(data);
  (Resume as any).create = (data: any) => Promise.resolve(data);

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
  console.log('\n3. Testing AI Copilot Action Plan (Feature 1)...');
  const startC1 = Date.now();
  const resC1 = await getActionPlan('dummyId');
  console.log(`Result:`, JSON.stringify(resC1, null, 2));
  console.log(`Time taken: ${Date.now() - startC1}ms`);

  console.log('\n4. Testing AI Copilot Chat (Feature 1)...');
  const startC2 = Date.now();
  const resC2 = await chatWithCopilot('dummyId', "I'm feeling stuck. What should I learn next?");
  console.log(`Result:`, JSON.stringify(resC2, null, 2));
  console.log(`Time taken: ${Date.now() - startC2}ms`);

  console.log('\n5. Testing AI Resume Builder (Feature 5)...');
  const startR1 = Date.now();
  const resR1 = await generateResume('dummyId');
  console.log(`Result:`, JSON.stringify(resR1, null, 2));
  console.log(`Time taken: ${Date.now() - startR1}ms`);
};

runTest().catch(console.error);
