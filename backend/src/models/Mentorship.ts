import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorship extends Document {
  mentorId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  purpose: string;
  scheduledAt?: Date;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipSchema: Schema = new Schema(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed'], default: 'pending' },
    purpose: { type: String, required: true },
    scheduledAt: { type: Date },
    meetingLink: { type: String },
  },
  { timestamps: true }
);

MentorshipSchema.index({ mentorId: 1, status: 1 });
MentorshipSchema.index({ menteeId: 1 });

export const Mentorship = mongoose.model<IMentorship>('Mentorship', MentorshipSchema);
