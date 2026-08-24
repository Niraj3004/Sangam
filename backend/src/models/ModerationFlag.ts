import mongoose, { Schema, Document } from 'mongoose';

export interface IModerationFlag extends Document {
  entityId: mongoose.Types.ObjectId;
  entityModel: 'Opportunity' | 'User' | 'Post' | 'Job' | 'Comment' | 'Project';
  confidenceScore: number;
  flagReason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ModerationFlagSchema: Schema = new Schema(
  {
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: { type: String, required: true, enum: ['Opportunity', 'User', 'Post', 'Job', 'Comment', 'Project'] },
    confidenceScore: { type: Number, required: true },
    flagReason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

ModerationFlagSchema.index({ status: 1 });
ModerationFlagSchema.index({ entityId: 1, entityModel: 1 });

export const ModerationFlag = mongoose.model<IModerationFlag>('ModerationFlag', ModerationFlagSchema);
