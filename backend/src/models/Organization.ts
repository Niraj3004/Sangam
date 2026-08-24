import mongoose, { Schema, Document } from 'mongoose';

export interface IOrgMember {
  userId: mongoose.Types.ObjectId;
  role: 'admin' | 'recruiter';
}

export interface IOrganization extends Document {
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  type: 'employer' | 'college';
  verified: boolean;
  members: IOrgMember[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String },
    logoUrl: { type: String },
    type: { type: String, enum: ['employer', 'college'], required: true },
    verified: { type: Boolean, default: false },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'recruiter'], default: 'admin' },
      },
    ],
  },
  { timestamps: true }
);

OrganizationSchema.index({ name: 'text' });
OrganizationSchema.index({ verified: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
