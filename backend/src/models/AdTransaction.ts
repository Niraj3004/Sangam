import mongoose, { Schema, Document } from 'mongoose';

export interface IAdTransaction extends Document {
  campaignId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Optional in case of anonymous traffic
  type: 'impression' | 'click';
  costDeducted: number; // The amount deducted from the campaign budget
  timestamp: Date;
}

const AdTransactionSchema: Schema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'AdCampaign', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['impression', 'click'], required: true },
    costDeducted: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false } // We just need timestamp, no need for updatedAt
);

// Indexes for fast reporting and deduplication
AdTransactionSchema.index({ campaignId: 1, type: 1, timestamp: -1 });
AdTransactionSchema.index({ campaignId: 1, userId: 1, type: 1 }); // Useful for preventing double-billing for the same user

export const AdTransaction = mongoose.model<IAdTransaction>('AdTransaction', AdTransactionSchema);
