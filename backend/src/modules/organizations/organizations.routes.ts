import { Router } from 'express';
import * as organizationsController from './organizations.controller';
import * as organizationsValidation from './organizations.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All organization routes require auth
router.use(auth);

// Get verified organizations
router.get(
  '/',
  asyncErrorHandler(organizationsController.getVerifiedOrganizations)
);

// Create an organization (requires manual verification later)
router.post(
  '/',
  validate(organizationsValidation.createOrgSchema),
  asyncErrorHandler(organizationsController.createOrganization)
);

// Get specific organization
router.get(
  '/:id',
  validate(organizationsValidation.orgIdParamSchema),
  asyncErrorHandler(organizationsController.getOrganizationById)
);

export default router;
