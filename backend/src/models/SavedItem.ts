import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedItem extends Document {
  userId: mongoose.Types.ObjectId;
  entityId: mongoose.Types.ObjectId;
  entityModel: 'Opportunity' | 'Event';
  createdAt: Date;
  updatedAt: Date;
}

const SavedItemSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: { type: String, required: true, enum: ['Opportunity', 'Event'] },
  },
  { timestamps: true }
);

// Prevent saving the same item twice
SavedItemSchema.index({ userId: 1, entityId: 1 }, { unique: true });
SavedItemSchema.index({ userId: 1, createdAt: -1 });

export const SavedItem = mongoose.model<ISavedItem>('SavedItem', SavedItemSchema);
