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
  industry?: string;
  size?: string;
  location?: string;
  establishedYear?: number;
  tagline?: string;
  benefits?: string[];
  programs?: string[];
  accreditation?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  contactEmail?: string;
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
    industry: { type: String },
    size: { type: String },
    location: { type: String },
    establishedYear: { type: Number },
    tagline: { type: String },
    benefits: [{ type: String }],
    programs: [{ type: String }],
    accreditation: { type: String },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
    },
    contactEmail: { type: String },
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
