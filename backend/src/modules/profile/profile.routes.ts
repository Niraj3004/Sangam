import { Router } from 'express';
import * as profileController from './profile.controller';
import * as profileValidation from './profile.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.get('/me', auth, asyncErrorHandler(profileController.getMyProfile));
router.patch('/me', auth, validate(profileValidation.patchProfileSchema), asyncErrorHandler(profileController.patchMyProfile));
router.get('/:handle', asyncErrorHandler(profileController.getProfileByHandle));

export default router;
