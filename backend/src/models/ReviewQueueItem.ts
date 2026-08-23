import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewQueueItem extends Document {
  entityId: mongoose.Types.ObjectId;
  entityModel: 'Opportunity' | 'User';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewQueueItemSchema: Schema = new Schema(
  {
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: { type: String, required: true, enum: ['Opportunity', 'User'] },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ReviewQueueItemSchema.index({ status: 1, createdAt: 1 });

export const ReviewQueueItem = mongoose.model<IReviewQueueItem>('ReviewQueueItem', ReviewQueueItemSchema);
