import { ReviewQueueItem } from '../../models/ReviewQueueItem';
import { Opportunity } from '../../models/Opportunity';

export const getPendingReviews = async () => {
  const reviews = await ReviewQueueItem.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .populate('entityId'); // Populates either Opportunity or User
  return reviews;
};

export const approveReview = async (reviewerId: string, reviewId: string) => {
  const review = await ReviewQueueItem.findById(reviewId);
  if (!review || review.status !== 'pending') {
    const error: any = new Error('Pending review not found');
    error.statusCode = 404;
    throw error;
  }

  review.status = 'approved';
  review.reviewerId = reviewerId as any;
  await review.save();

  // If it's an opportunity, publish it
  if (review.entityModel === 'Opportunity') {
    await Opportunity.findByIdAndUpdate(review.entityId, { status: 'active' });
  }

  return review;
};

export const rejectReview = async (reviewerId: string, reviewId: string) => {
  const review = await ReviewQueueItem.findById(reviewId);
  if (!review || review.status !== 'pending') {
    const error: any = new Error('Pending review not found');
    error.statusCode = 404;
    throw error;
  }

  review.status = 'rejected';
  review.reviewerId = reviewerId as any;
  await review.save();

  if (review.entityModel === 'Opportunity') {
    await Opportunity.findByIdAndUpdate(review.entityId, { status: 'rejected' });
  }

  return review;
};
