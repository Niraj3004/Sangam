import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdCampaign } from '../src/models/AdCampaign';
import { Organization } from '../src/models/Organization';
import { connectDB } from '../src/config/db';

dotenv.config();

const seedInternalAds = async () => {
  try {
    await connectDB();
    console.log('Connected to DB...');

    // 1. Create or find the Sangam Official Platform Org
    let sangamOrg = await Organization.findOne({ name: 'Sangam Official' });
    if (!sangamOrg) {
      sangamOrg = await Organization.create({
        name: 'Sangam Official',
        description: 'The official platform account for Sangam.',
        type: 'employer',
        verified: true,
        industry: 'Technology',
      });
      console.log('Created Sangam Official Organization.');
    }

    // 2. Clear any existing internal ads to prevent duplicates
    await AdCampaign.deleteMany({ organizationId: sangamOrg._id });

    // 3. Create Internal "Fallback" Promos
    // These have a CPC of $0.10, meaning ANY real paying company (CPC > 0.10) will outbid them and take their slot!
    const internalAds = [
      {
        organizationId: sangamOrg._id,
        title: 'Complete Your Profile & Get Hired!',
        description: 'Did you know students with complete profiles get 3x more interview requests? Take 5 minutes to add your skills and projects now.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
        callToActionUrl: '/settings/profile',
        type: 'Platform Tip',
        isRemote: false,
        totalBudget: 999999, // Infinite budget
        costPerClick: 0.10, // Lowest possible bid, ensuring real ads win first
        status: 'active',
        budgetSpent: 0
      },
      {
        organizationId: sangamOrg._id,
        title: 'Try the AI Copilot Resume Builder',
        description: 'Struggling to write your resume? Let Sangam Copilot analyze your profile and generate a professional, ATS-friendly resume for free.',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
        callToActionUrl: '/copilot',
        type: 'New Feature',
        isRemote: false,
        totalBudget: 999999,
        costPerClick: 0.11, // Second lowest bid
        status: 'active',
        budgetSpent: 0
      }
    ];

    await AdCampaign.insertMany(internalAds);
    console.log(`Successfully seeded ${internalAds.length} Internal Fallback Ads!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedInternalAds();
