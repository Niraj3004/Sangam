import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  description: string;
  type: 'country' | 'university' | 'college' | 'skill' | 'interest' | 'career';
  iconUrl: string;
  bannerUrl: string;
  memberCount: number;
  status: 'pending' | 'active' | 'archived';
  creatorId?: mongoose.Types.ObjectId;
  creatorType?: 'student' | 'org';
  isOfficial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['country', 'university', 'college', 'skill', 'interest', 'career'], required: true },
    iconUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    memberCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'active', 'archived'], default: 'active' },
    creatorId: { type: Schema.Types.ObjectId, refPath: 'creatorType' },
    creatorType: { type: String, enum: ['User', 'Organization'] },
    isOfficial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CommunitySchema.index({ name: 'text', description: 'text' });
CommunitySchema.index({ type: 1, status: 1 });

export const Community = mongoose.model<ICommunity>('Community', CommunitySchema);
