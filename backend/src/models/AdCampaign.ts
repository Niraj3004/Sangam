import mongoose, { Schema, Document } from 'mongoose';

export interface IAdCampaign extends Document {
  organizationId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  callToActionUrl: string;
  type: string;
  isRemote: boolean;
  
  targetRoles: string[];
  targetSkills: string[];
  targetLocations: string[];
  
  totalBudget: number;
  costPerClick: number;
  budgetSpent: number;
  paymentReceiptUrl?: string;
  status: 'pending_payment' | 'active' | 'paused' | 'exhausted' | 'rejected';
  
  impressions: number;
  clicks: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const AdCampaignSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    callToActionUrl: { type: String, required: true },
    type: { type: String, default: 'Sponsored' },
    isRemote: { type: Boolean, default: false },
    
    targetRoles: [{ type: String }],
    targetSkills: [{ type: String }],
    targetLocations: [{ type: String }],
    
    totalBudget: { type: Number, required: true, min: 10 },
    costPerClick: { type: Number, required: true, min: 0.1 },
    budgetSpent: { type: Number, default: 0 },
    paymentReceiptUrl: { type: String },
    status: { type: String, enum: ['pending_payment', 'active', 'paused', 'exhausted', 'rejected'], default: 'pending_payment' },
    
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AdCampaignSchema.index({ status: 1, budgetSpent: 1 });
AdCampaignSchema.index({ targetSkills: 1 });

export const AdCampaign = mongoose.model<IAdCampaign>('AdCampaign', AdCampaignSchema);
