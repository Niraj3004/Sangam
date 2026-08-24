import { Router } from 'express';
import * as organizationsController from './organizations.controller';
import * as organizationsValidation from './organizations.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { uploadImage } from '../../config/cloudinary';

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

// Update specific organization
router.patch(
  '/:id',
  validate(organizationsValidation.updateOrgSchema),
  asyncErrorHandler(organizationsController.updateOrganization)
);

// Upload Logo
router.post(
  '/:id/logo',
  uploadImage.single('logo'),
  asyncErrorHandler(organizationsController.uploadLogo)
);

export default router;
