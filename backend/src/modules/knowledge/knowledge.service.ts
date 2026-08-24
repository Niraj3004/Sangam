import { Post, IPost } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { Membership } from '../../models/Membership';
import { ReviewQueueItem } from '../../models/ReviewQueueItem';

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

export const createPost = async (userId: string, communityId: string, data: Partial<IPost>) => {
  await checkMembership(userId, communityId);

  // Send new posts to review queue automatically (Moderation Seam B13)
  const post = await Post.create({
    ...data,
    authorId: userId,
    communityId,
    status: 'review'
  });

  await ReviewQueueItem.create({
    entityId: post._id,
    entityModel: 'Post', // Wait, ReviewQueueItem schema expects 'Opportunity' | 'User'. We'll need to patch that.
    reason: 'New community post moderation seam'
  });

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
