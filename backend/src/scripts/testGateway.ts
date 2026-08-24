import dotenv from 'dotenv';
dotenv.config();

import { rankOpportunities } from '../modules/feed/relevance.service';
import { aiConfig } from '../config/ai';

const runTest = async () => {
  if (aiConfig.geminiApiKeys.length === 0) {
    console.log('Skipping API test: No GEMINI_API_KEYs provided in .env');
    return;
  }

  console.log('--- Testing AI Gateway (A4 Relevance Ranking) ---');

  const student = {
    careerGoal: 'Become a Senior Frontend Engineer at a fast-paced startup.',
    field: 'Software Engineering',
    skills: ['React', 'TypeScript', 'Tailwind'],
    interests: ['Startups', 'Web Development', 'Open Source']
  };

  const opportunities = [
    {
      id: 'opp_1',
      title: 'Backend Node.js Intern',
      type: 'internship',
      description: 'Looking for a backend intern to write APIs in Node and Express. Heavy focus on database optimization.',
      tags: ['Node.js', 'Express', 'MongoDB'],
      field: 'Software Engineering'
    },
    {
      id: 'opp_2',
      title: 'Frontend React Developer (Remote Startup)',
      type: 'job',
      description: 'Fast-paced startup looking for a React expert to build our new UI in TypeScript and Tailwind.',
      tags: ['React', 'TypeScript', 'Remote'],
      field: 'Software Engineering'
    },
    {
      id: 'opp_3',
      title: 'Marketing Specialist',
      type: 'job',
      description: 'Help us grow our brand presence on social media.',
      tags: ['Marketing', 'Social Media'],
      field: 'Marketing'
    }
  ];

  console.log('\n1. Ranking 3 opportunities...');
  const start1 = Date.now();
  const res1 = await rankOpportunities(student, opportunities);
  console.log(`Result:`, JSON.stringify(res1, null, 2));
  console.log(`Time taken: ${Date.now() - start1}ms`);
};

runTest().catch(console.error);
