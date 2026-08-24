import { Router } from 'express';
import * as profileController from './profile.controller';
import * as profileValidation from './profile.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { uploadImage } from '../../config/cloudinary';

const router = Router();

router.get('/me', auth, asyncErrorHandler(profileController.getMyProfile));
router.patch('/me', auth, validate(profileValidation.patchProfileSchema), asyncErrorHandler(profileController.patchMyProfile));
router.post('/me/avatar', auth, uploadImage.single('avatar'), asyncErrorHandler(profileController.uploadAvatar));
router.get('/:handle', asyncErrorHandler(profileController.getProfileByHandle));

export default router;
