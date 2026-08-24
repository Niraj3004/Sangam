import dotenv from 'dotenv';
dotenv.config();

import { extractOpportunity } from '../modules/extraction/extraction.service';
import { aiConfig } from '../config/ai';

const runTest = async () => {
  if (aiConfig.geminiApiKeys.length === 0) {
    console.log('Skipping API test: No GEMINI_API_KEYs provided in .env');
    return;
  }

  console.log('--- Testing AI Gateway (A3 Extraction) ---');

  const text = `
    Exciting opportunity for computer science undergrads in Nepal! 
    TechCorp is hiring a part-time remote Frontend Intern to work with React and TypeScript. 
    You must apply before October 15th, 2026. 
    Check out our website at https://techcorp.example.com/apply to send your resume.
  `;

  console.log('\n1. Extracting messy text...');
  const start1 = Date.now();
  const res1 = await extractOpportunity(text);
  console.log(`Result:`, res1);
  console.log(`Time taken: ${Date.now() - start1}ms`);

  console.log('\n2. Second call (should HIT cache)...');
  const start2 = Date.now();
  const res2 = await extractOpportunity(text);
  console.log(`Result:`, res2);
  console.log(`Time taken: ${Date.now() - start2}ms`);
};

runTest().catch(console.error);
