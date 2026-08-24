import { Router } from 'express';
import * as communitiesController from './communities.controller';
import * as communitiesValidation from './communities.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/requireRole';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { uploadImage } from '../../config/cloudinary';

const router = Router();

// Public routes (if any) could go here. For now, all require auth.
router.use(auth);

// Get active communities
router.get(
  '/',
  validate(communitiesValidation.getCommunitiesSchema),
  asyncErrorHandler(communitiesController.getCommunities)
);

// Propose community (Students)
router.post(
  '/propose',
  requireRole(['student', 'verified_student']),
  validate(communitiesValidation.proposeCommunitySchema),
  asyncErrorHandler(communitiesController.proposeCommunity)
);

// Create official community (Orgs)
router.post(
  '/create',
  requireRole(['org']),
  validate(communitiesValidation.createCommunitySchema),
  asyncErrorHandler(communitiesController.createCommunity)
);

// Get pending communities (Admins)
router.get(
  '/pending',
  requireRole(['admin', 'curator', 'moderator']),
  asyncErrorHandler(communitiesController.getPendingCommunities)
);

// Approve community (Admins)
router.post(
  '/:id/approve',
  requireRole(['admin', 'curator', 'moderator']),
  validate(communitiesValidation.communityIdParamSchema),
  asyncErrorHandler(communitiesController.approveCommunity)
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

// Upload Icon (usually restricted to community admins, but we'll leave it open for demo)
router.post(
  '/:id/icon',
  uploadImage.single('icon'),
  asyncErrorHandler(communitiesController.uploadIcon)
);

export default router;
