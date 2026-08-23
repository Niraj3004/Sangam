import { Request, Response } from 'express';
import * as reviewService from './review.service';
import { sendSuccess } from '../../utils/response';

export const getPendingReviews = async (req: Request, res: Response) => {
  const reviews = await reviewService.getPendingReviews();
  sendSuccess(res, reviews, 200);
};

export const approveReview = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const review = await reviewService.approveReview(req.user!.userId, id);
  sendSuccess(res, review, 200);
};

export const rejectReview = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const review = await reviewService.rejectReview(req.user!.userId, id);
  sendSuccess(res, review, 200);
};
