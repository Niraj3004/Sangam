import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  description: string;
  type: 'job' | 'internship' | 'project' | 'hackathon' | 'scholarship';
  posterId?: mongoose.Types.ObjectId; // Optional now, since AI ingest might not have a poster
  org?: string;
  field?: string;
  isRemote?: boolean;
  sourceId?: string;
  relevanceScore?: number;
  confidence?: number;
  status: 'active' | 'closed' | 'draft' | 'review' | 'rejected' | 'published';
  tags: string[];
  location?: string;
  isExternal: boolean;
  externalLink?: string;
  endDate?: Date; // Maps to 'deadline'
  trustScore: number;
  verifiedSource: boolean;
  deadlineConfirmed: boolean;
  eligibilityConfirmed: boolean;
  lastCheckedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['job', 'internship', 'project', 'hackathon', 'scholarship'], required: true },
    posterId: { type: Schema.Types.ObjectId, ref: 'User' },
    org: { type: String },
    field: { type: String },
    isRemote: { type: Boolean, default: false },
    sourceId: { type: String },
    relevanceScore: { type: Number },
    confidence: { type: Number },
    status: { type: String, enum: ['active', 'closed', 'draft', 'review', 'rejected', 'published'], default: 'active' },
    tags: [{ type: String }],
    location: { type: String, default: '' },
    isExternal: { type: Boolean, default: false },
    externalLink: { type: String, default: '' },
    endDate: { type: Date },
    trustScore: { type: Number, default: 0 },
    verifiedSource: { type: Boolean, default: false },
    deadlineConfirmed: { type: Boolean, default: false },
    eligibilityConfirmed: { type: Boolean, default: false },
    lastCheckedAt: { type: Date },
  },
  { timestamps: true }
);

// Search index for robust queries
OpportunitySchema.index({ title: 'text', description: 'text', tags: 'text' });
// Sorting and filtering index
OpportunitySchema.index({ createdAt: -1, status: 1, type: 1 });
OpportunitySchema.index({ type: 1, endDate: 1 });
OpportunitySchema.index({ field: 1, location: 1 });
OpportunitySchema.index({ endDate: 1 });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
