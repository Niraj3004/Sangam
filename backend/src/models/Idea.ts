import mongoose, { Schema, Document } from 'mongoose';

export interface IIdeaReaction {
  userId: mongoose.Types.ObjectId;
  type: 'interested' | 'join' | 'discuss';
}

export interface IIdea extends Document {
  title: string;
  category: string;
  problem: string;
  solution: string;
  bannerUrl: string;
  stage: 'concept' | 'research' | 'prototype' | 'building';
  skillsRequired: string[];
  lookingFor: string[];
  visibility: 'public' | 'private';
  collaborationStatus: 'open' | 'closed';
  authorId: mongoose.Types.ObjectId;
  tags: string[];
  reactions: IIdeaReaction[];
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    bannerUrl: { type: String, default: '' },
    stage: { type: String, enum: ['concept', 'research', 'prototype', 'building'], default: 'concept' },
    skillsRequired: [{ type: String }],
    lookingFor: [{ type: String }],
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    collaborationStatus: { type: String, enum: ['open', 'closed'], default: 'open' },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['interested', 'join', 'discuss'], required: true },
      },
    ],
  },
  { timestamps: true }
);

IdeaSchema.index({ title: 'text', problem: 'text', solution: 'text', tags: 'text' });
IdeaSchema.index({ authorId: 1, collaborationStatus: 1 });

export const Idea = mongoose.model<IIdea>('Idea', IdeaSchema);
