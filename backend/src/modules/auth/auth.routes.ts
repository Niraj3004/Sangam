import { Router } from 'express';
import * as authController from './auth.controller';
import * as authValidation from './auth.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.post('/register', validate(authValidation.registerSchema), asyncErrorHandler(authController.register));
router.post('/login', validate(authValidation.loginSchema), asyncErrorHandler(authController.login));
router.post('/refresh', validate(authValidation.refreshSchema), asyncErrorHandler(authController.refresh));
router.post('/google', validate(authValidation.googleAuthSchema), asyncErrorHandler(authController.googleAuth));

router.get('/me', auth, asyncErrorHandler(authController.getMe));

export default router;
