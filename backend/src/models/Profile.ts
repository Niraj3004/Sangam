import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill {
  name: string;
  level?: string;
}

export interface IEducation {
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  handle: string;
  avatarUrl: string;
  about: string;
  education: IEducation[];
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
  githubRepositories: {
    name: string;
    description?: string;
    url: string;
    language?: string;
    stars?: number;
  }[];
  portfolioConfig: {
    theme: string;
    visibleSections: string[];
    customUrlSlug?: string;
  };
  careerGoal?: 'internship' | 'job' | 'startup' | 'scholarship' | 'higher_study' | 'hackathon' | 'freelance' | 'networking';
  completionScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String },
    handle: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: '' },
    about: { type: String, default: '' },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
      }
    ],
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
    githubRepositories: [
      {
        name: { type: String, required: true },
        description: { type: String },
        url: { type: String, required: true },
        language: { type: String },
        stars: { type: Number, default: 0 },
      }
    ],
    portfolioConfig: {
      theme: { type: String, default: 'light' },
      visibleSections: [{ type: String }],
      customUrlSlug: { type: String, unique: true, sparse: true },
    },
    careerGoal: { 
      type: String, 
      enum: ['internship', 'job', 'startup', 'scholarship', 'higher_study', 'hackathon', 'freelance', 'networking'] 
    },
    completionScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
ProfileSchema.index({ 'skills.name': 'text', interests: 'text', about: 'text' });
ProfileSchema.index({ location: 1, 'skills.name': 1 });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
