import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  resumeUrl?: string;
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['applied', 'reviewing', 'interview', 'offer', 'rejected'], default: 'applied' },
    resumeUrl: { type: String },
    coverLetter: { type: String },
  },
  { timestamps: true }
);

ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });
ApplicationSchema.index({ applicantId: 1 });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
