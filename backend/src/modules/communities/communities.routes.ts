import { Router } from 'express';
import * as communitiesController from './communities.controller';
import * as communitiesValidation from './communities.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// Public routes (if any) could go here. For now, all require auth.
router.use(auth);

// Get communities
router.get(
  '/',
  validate(communitiesValidation.getCommunitiesSchema),
  asyncErrorHandler(communitiesController.getCommunities)
);

// Join a community
router.post(
  '/:id/join',
  validate(communitiesValidation.communityIdParamSchema),
  asyncErrorHandler(communitiesController.joinCommunity)
);

// Leave a community
router.post(
  '/:id/leave',
  validate(communitiesValidation.communityIdParamSchema),
  asyncErrorHandler(communitiesController.leaveCommunity)
);

export default router;
