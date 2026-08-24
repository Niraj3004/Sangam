import mongoose, { Schema, Document } from 'mongoose';

export interface IUserInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  entityId: mongoose.Types.ObjectId;
  entityModel: 'Opportunity' | 'Project' | 'Post';
  interactionType: 'view' | 'save' | 'apply' | 'like' | 'dislike' | 'more_like_this' | 'not_relevant';
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserInteractionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: { type: String, required: true, enum: ['Opportunity', 'Project', 'Post'] },
    interactionType: { 
      type: String, 
      required: true, 
      enum: ['view', 'save', 'apply', 'like', 'dislike', 'more_like_this', 'not_relevant'] 
    },
    weight: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Indexes to quickly aggregate a user's preferences
UserInteractionSchema.index({ userId: 1, interactionType: 1 });
UserInteractionSchema.index({ userId: 1, entityId: 1, interactionType: 1 }, { unique: true });

export const UserInteraction = mongoose.model<IUserInteraction>('UserInteraction', UserInteractionSchema);
