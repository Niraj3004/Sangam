import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  organizationId: mongoose.Types.ObjectId;
  type: 'job' | 'internship' | 'freelance' | 'part_time';
  location?: string;
  remote: boolean;
  salaryRange?: string;
  skillsRequired: string[];
  status: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    type: { type: String, enum: ['job', 'internship', 'freelance', 'part_time'], required: true },
    location: { type: String },
    remote: { type: Boolean, default: false },
    salaryRange: { type: String },
    skillsRequired: [{ type: String }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ organizationId: 1, status: 1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);
