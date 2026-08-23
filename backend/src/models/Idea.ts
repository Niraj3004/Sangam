import mongoose, { Schema, Document } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  authorId: mongoose.Types.ObjectId;
  tags: string[];
  status: 'open' | 'assembling' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['open', 'assembling', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

IdeaSchema.index({ title: 'text', description: 'text', tags: 'text' });
IdeaSchema.index({ authorId: 1, status: 1 });

export const Idea = mongoose.model<IIdea>('Idea', IdeaSchema);
