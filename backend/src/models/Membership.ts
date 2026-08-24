import mongoose, { Schema, Document } from 'mongoose';

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: Date;
}

const MembershipSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
    role: { type: String, enum: ['member', 'moderator', 'admin'], default: 'member' },
  },
  { timestamps: { createdAt: 'joinedAt', updatedAt: false } }
);

MembershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });
MembershipSchema.index({ communityId: 1, role: 1 });

export const Membership = mongoose.model<IMembership>('Membership', MembershipSchema);
