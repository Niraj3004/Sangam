import mongoose from 'mongoose';
import { env } from '../config/env.config';
import { Community } from '../models/Community';

const seedCommunities = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected.');

    const communities = [
      {
        name: 'Kathmandu Valley Tech',
        description: 'A community for tech enthusiasts, developers, and founders in the Kathmandu Valley to share knowledge, host meetups, and collaborate.',
        type: 'interest' as const,
      },
      {
        name: 'Nepali students in Australia',
        description: 'A dedicated space for Nepali students studying in Australia to share guides on scholarships, housing, and life.',
        type: 'country' as const,
      },
      {
        name: 'MERN Stack Developers',
        description: 'Roadmaps, best practices, and code reviews for MongoDB, Express, React, and Node.js developers.',
        type: 'skill' as const,
      }
    ];

    console.log('Seeding communities...');
    for (const data of communities) {
      const exists = await Community.findOne({ name: data.name });
      if (!exists) {
        await Community.create(data);
        console.log(`Created: ${data.name}`);
      } else {
        console.log(`Skipped (already exists): ${data.name}`);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedCommunities();
