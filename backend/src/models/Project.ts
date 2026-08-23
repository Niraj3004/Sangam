import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  contributors: mongoose.Types.ObjectId[];
  technologies: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  openRoles: {
    title: string;
    description: string;
    isFilled: boolean;
  }[];
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    technologies: [{ type: String }],
    repositoryUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    openRoles: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        isFilled: { type: Boolean, default: false },
      }
    ],
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

// Search indexes for discovering projects
ProjectSchema.index({ title: 'text', description: 'text', technologies: 'text' });
ProjectSchema.index({ ownerId: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
