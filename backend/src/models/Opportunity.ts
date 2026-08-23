import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  description: string;
  type: 'job' | 'internship' | 'project' | 'hackathon' | 'scholarship';
  posterId: mongoose.Types.ObjectId;
  status: 'active' | 'closed' | 'draft';
  tags: string[];
  location?: string;
  isExternal: boolean;
  externalLink?: string;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['job', 'internship', 'project', 'hackathon', 'scholarship'], required: true },
    posterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    tags: [{ type: String }],
    location: { type: String, default: '' },
    isExternal: { type: Boolean, default: false },
    externalLink: { type: String, default: '' },
    endDate: { type: Date },
  },
  { timestamps: true }
);

// Search index for robust queries
OpportunitySchema.index({ title: 'text', description: 'text', tags: 'text' });
// Sorting and filtering index
OpportunitySchema.index({ createdAt: -1, status: 1, type: 1 });
OpportunitySchema.index({ endDate: 1 });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
