import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  url?: string;
  bannerUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    url: { type: String },
    bannerUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

EventSchema.index({ title: 'text', description: 'text' });
EventSchema.index({ startDate: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
