import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill {
  name: string;
  level?: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  handle: string;
  about?: string;
  education: string[];
  skills: ISkill[];
  interests: string[];
  lookingFor: string[];
  availability?: string;
  location?: string;
  studyDestination?: string;
  languages: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  achievements: string[];
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    handle: { type: String, required: true, unique: true },
    about: { type: String, default: '' },
    education: [{ type: String }],
    skills: [
      {
        name: { type: String, required: true },
        level: { type: String },
      },
    ],
    interests: [{ type: String }],
    lookingFor: [{ type: String }], // e.g., co-founder, internship, mentor, project, networking
    availability: { type: String, default: '' },
    location: { type: String, default: '' },
    studyDestination: { type: String, default: '' },
    languages: [{ type: String }],
    links: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    achievements: [{ type: String }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

// Indexes
ProfileSchema.index({ 'skills.name': 'text', interests: 'text', about: 'text' });
ProfileSchema.index({ location: 1, 'skills.name': 1 });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
