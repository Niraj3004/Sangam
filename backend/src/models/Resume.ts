import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeSection {
  title: string;
  content: string; // Could be markdown or structured JSON string
  order: number;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  targetJobId?: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  sections: IResumeSection[];
  status: 'draft' | 'final';
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSectionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetJobId: { type: Schema.Types.ObjectId, ref: 'Job' }, // The job this resume was tailored for
    title: { type: String, required: true, default: 'My Resume' },
    summary: { type: String, default: '' },
    sections: [ResumeSectionSchema],
    status: { type: String, enum: ['draft', 'final'], default: 'draft' },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
