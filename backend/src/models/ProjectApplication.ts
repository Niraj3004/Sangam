import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectApplication extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  roleTitle: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectApplicationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    roleTitle: { type: String, required: true },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

// A user can only apply to a specific role in a specific project once
ProjectApplicationSchema.index({ userId: 1, projectId: 1, roleTitle: 1 }, { unique: true });
ProjectApplicationSchema.index({ projectId: 1, status: 1 });

export const ProjectApplication = mongoose.model<IProjectApplication>('ProjectApplication', ProjectApplicationSchema);
