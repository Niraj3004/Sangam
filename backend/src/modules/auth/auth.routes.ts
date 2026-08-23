import { Router } from 'express';
import * as authController from './auth.controller';
import * as authValidation from './auth.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/requireRole';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.post('/register', validate(authValidation.registerSchema), asyncErrorHandler(authController.register));
router.post('/login', validate(authValidation.loginSchema), asyncErrorHandler(authController.login));
router.post('/refresh', validate(authValidation.refreshSchema), asyncErrorHandler(authController.refresh));
router.post('/google', validate(authValidation.googleAuthSchema), asyncErrorHandler(authController.googleAuth));

router.get('/me', auth, asyncErrorHandler(authController.getMe));

// User submits verification request
router.post('/verify-request', auth, validate(authValidation.verifyRequestSchema), asyncErrorHandler(authController.submitVerificationRequest));

// Elevated roles can view and resolve
router.get('/verify-requests', auth, requireRole(['curator', 'moderator', 'admin']), asyncErrorHandler(authController.getVerificationRequests));
router.post('/verify-resolve/:id', auth, requireRole(['curator', 'moderator', 'admin']), validate(authValidation.resolveVerifySchema), asyncErrorHandler(authController.resolveVerificationRequest));

export default router;
