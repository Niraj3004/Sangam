import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Opportunity } from '../models/Opportunity';
import { Community } from '../models/Community';
import { Organization } from '../models/Organization';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sangam';

const seedFull = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // 1. Create Demo Student
    let demoStudent = await User.findOne({ email: 'demo@student.com' });
    if (!demoStudent) {
      demoStudent = await User.create({
        email: 'demo@student.com',
        password: 'password123',
        role: 'student',
        verifyTier: 'college', // verified
      } as any);
      console.log('Created Demo Student.');
    }

    // 2. Create Sample Opportunities
    const oppCount = await Opportunity.countDocuments();
    if (oppCount === 0) {
      await Opportunity.create({
        title: 'Software Engineering Intern',
        description: 'Join our team for the summer to work on cool stuff.',
        type: 'internship',
        field: 'engineering',
        status: 'active',
        location: 'San Francisco, CA',
        isRemote: true,
        posterId: demoStudent._id,
      } as any);
      await Opportunity.create({
        title: 'AI Researcher',
        description: 'Looking for a student to help with an AI research paper.',
        type: 'project',
        field: 'engineering',
        status: 'active',
        location: 'New York, NY',
        isRemote: false,
        posterId: demoStudent._id,
      } as any);
      console.log('Created Sample Opportunities.');
    }

    // 3. Create Sample Community
    let community = await Community.findOne({ name: 'Machine Learning Enthusiasts' });
    if (!community) {
      community = await Community.create({
        name: 'Machine Learning Enthusiasts',
        description: 'A community for ML researchers and students.',
        type: 'interest'
      } as any);
      console.log('Created Sample Community.');
    }

    // 4. Create Sample Organization
    let org = await Organization.findOne({ name: 'Tech Innovators Inc' });
    if (!org) {
      org = await Organization.create({
        name: 'Tech Innovators Inc',
        website: 'https://techinnovators.com',
        description: 'A leading tech company.',
        type: 'employer',
        verified: true, // Auto-verified for demo
        members: [{ userId: demoStudent._id, role: 'admin' }],
      } as any);
      console.log('Created Sample Organization.');
    }

    console.log('\n--- SEED SUCCESS ---');
    console.log('You can now log in with:');
    console.log('Email: demo@student.com');
    console.log('Password: password123');
    console.log('--------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedFull();
