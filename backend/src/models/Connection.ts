import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
  requesterId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  purpose?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    purpose: { type: String, enum: ['collaboration', 'idea', 'startup', 'job', 'academic', 'open_source', 'networking'] },
    note: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate requests between the same two users
ConnectionSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });
// Optimize querying for pending requests or a user's connections
ConnectionSchema.index({ recipientId: 1, status: 1 });
ConnectionSchema.index({ requesterId: 1, status: 1 });

export const Connection = mongoose.model<IConnection>('Connection', ConnectionSchema);
