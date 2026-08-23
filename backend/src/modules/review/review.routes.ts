import { Router } from 'express';
import * as reviewController from './review.controller';
import * as reviewValidation from './review.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/requireRole';
import { ROLES } from '../../constants/roles';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All review routes require curator or admin role
router.use(auth, requireRole([ROLES.CURATOR, ROLES.ADMIN]));

router.get('/', asyncErrorHandler(reviewController.getPendingReviews));

router.post(
  '/:id/approve',
  validate(reviewValidation.reviewIdParamSchema),
  asyncErrorHandler(reviewController.approveReview)
);

router.post(
  '/:id/reject',
  validate(reviewValidation.reviewIdParamSchema),
  asyncErrorHandler(reviewController.rejectReview)
);

export default router;
