import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reportedEntityId: mongoose.Types.ObjectId;
  entityModel: 'User' | 'Opportunity' | 'Project' | 'Post' | 'Job' | 'Comment' | 'Message';
  reason: string;
  screenshotUrl: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedEntityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: { type: String, required: true, enum: ['User', 'Opportunity', 'Project', 'Post', 'Job', 'Comment', 'Message'] },
    reason: { type: String, required: true },
    screenshotUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Index for efficiently fetching the queue
ReportSchema.index({ status: 1, createdAt: 1 });
// Index to prevent spam (one user reporting the same thing multiple times)
ReportSchema.index({ reporterId: 1, reportedEntityId: 1 }, { unique: true });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
