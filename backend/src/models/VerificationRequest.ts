import mongoose, { Schema, Document } from 'mongoose';
import { VerifyTier, VERIFY_TIERS } from '../constants/roles';

export interface IVerificationRequest extends Document {
  userId: mongoose.Types.ObjectId;
  tierRequested: VerifyTier;
  evidence: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tierRequested: { type: String, enum: Object.values(VERIFY_TIERS), required: true },
    evidence: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const VerificationRequest = mongoose.model<IVerificationRequest>('VerificationRequest', VerificationRequestSchema);
