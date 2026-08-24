import { Post, IPost } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { Membership } from '../../models/Membership';
import { ReviewQueueItem } from '../../models/ReviewQueueItem';
import { runModerationHook } from '../moderation/moderation.service';

// Helper to ensure user is a member of the community
const checkMembership = async (userId: string, communityId: string) => {
  const membership = await Membership.findOne({ userId, communityId });
  if (!membership) {
    const error: any = new Error('You must be a member of the community to do this.');
    error.statusCode = 403;
    throw error;
  }
  return membership;
};

export const createPost = async (authorId: string, communityId: string, data: Partial<IPost>) => {
  await checkMembership(authorId, communityId);

  const post = await Post.create({
    ...data,
    authorId,
    communityId,
    status: 'review'
  });

  await ReviewQueueItem.create({
    entityId: post._id,
    entityModel: 'Post',
    reason: 'New community post moderation seam'
  });

  runModerationHook(post._id as unknown as string, 'Post', `${post.title} ${post.content}`).catch(console.error);

  return post;
};

export const getCommunityPosts = async (userId: string, communityId: string, page: number = 1, limit: number = 20) => {
  await checkMembership(userId, communityId);

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ communityId, status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'email role verifyTier'),
    Post.countDocuments({ communityId, status: 'published' })
  ]);

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const getPost = async (userId: string, postId: string) => {
  const post = await Post.findById(postId).populate('authorId', 'email role verifyTier');
  if (!post) {
    const error: any = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  await checkMembership(userId, post.communityId.toString());

  return post;
};

export const createComment = async (userId: string, postId: string, content: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error: any = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  await checkMembership(userId, post.communityId.toString());

  const comment = await Comment.create({
    postId,
    authorId: userId,
    content
  });

  runModerationHook(comment._id as unknown as string, 'Comment', content).catch(console.error);

  return await comment.populate('authorId', 'email role verifyTier');
};

export const getComments = async (userId: string, postId: string, page: number = 1, limit: number = 50) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error: any = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  await checkMembership(userId, post.communityId.toString());

  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find({ postId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'email role verifyTier'),
    Comment.countDocuments({ postId })
  ]);

  return {
    comments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};
