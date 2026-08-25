import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Opportunity } from '../src/models/Opportunity';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sangam';

const seedAds = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const ads = [
      {
        title: 'Full-Stack Web Development Bootcamp',
        description: 'Master full-stack development with our comprehensive 12-week bootcamp. Includes mentorship, career coaching, and a job guarantee. Apply now to kickstart your tech career.',
        type: 'job',
        isRemote: true,
        org: 'CodeAcademy',
        tags: ['React', 'Node.js', 'Full-Stack', 'Web Development'],
        status: 'published',
        isSponsored: true,
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
        externalLink: 'https://example.com/bootcamp',
        isExternal: true,
        trustScore: 100,
        verifiedSource: true
      },
      {
        title: 'Product Design Fellowship 2026',
        description: 'Join the top design fellowship in the industry. Learn UX/UI design from experts at Google, Apple, and Figma. Scholarships available for underrepresented students.',
        type: 'scholarship',
        isRemote: true,
        org: 'DesignBridge',
        tags: ['UX Design', 'UI Design', 'Figma', 'Product Design'],
        status: 'published',
        isSponsored: true,
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000',
        externalLink: 'https://example.com/design-fellowship',
        isExternal: true,
        trustScore: 100,
        verifiedSource: true
      }
    ];

    console.log('Inserting ads...');
    for (const ad of ads) {
      await Opportunity.findOneAndUpdate(
        { title: ad.title },
        ad,
        { upsert: true, new: true }
      );
    }

    console.log('Successfully seeded ads.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding ads:', error);
    process.exit(1);
  }
};

seedAds();
