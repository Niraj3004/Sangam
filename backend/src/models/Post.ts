import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  tags: string[];
  upvotes: number;
  status: 'published' | 'review' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
    tags: [{ type: String }],
    upvotes: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'review', 'archived'], default: 'published' },
  },
  { timestamps: true }
);

PostSchema.index({ communityId: 1, createdAt: -1 });
PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const Post = mongoose.model<IPost>('Post', PostSchema);
