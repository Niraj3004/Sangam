import { Router } from 'express';
import * as authController from './auth.controller';
import * as authValidation from './auth.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/requireRole';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: { message: 'Too many requests from this IP, please try again after 15 minutes' } }
});

router.post('/register', authLimiter, validate(authValidation.registerSchema), asyncErrorHandler(authController.register));
router.post('/login', authLimiter, validate(authValidation.loginSchema), asyncErrorHandler(authController.login));
router.post('/refresh', validate(authValidation.refreshSchema), asyncErrorHandler(authController.refresh));
router.post('/logout', validate(authValidation.logoutSchema), asyncErrorHandler(authController.logout));
router.post('/google', validate(authValidation.googleAuthSchema), asyncErrorHandler(authController.googleAuth));
router.post('/forgot-password', authLimiter, validate(authValidation.forgotPasswordSchema), asyncErrorHandler(authController.forgotPassword));
router.post('/reset-password', authLimiter, validate(authValidation.resetPasswordSchema), asyncErrorHandler(authController.resetPassword));

router.post('/verify-email', auth, validate(authValidation.verifyEmailSchema), asyncErrorHandler(authController.verifyEmail));

router.get('/me', auth, asyncErrorHandler(authController.getMe));
router.post('/secondary-email', auth, validate(authValidation.secondaryEmailSchema), asyncErrorHandler(authController.addSecondaryEmail));
router.post('/verify-secondary', auth, validate(authValidation.verifySecondarySchema), asyncErrorHandler(authController.verifySecondaryEmail));

// User submits verification request
router.post('/verify-request', auth, validate(authValidation.verifyRequestSchema), asyncErrorHandler(authController.submitVerificationRequest));

// Elevated roles can view and resolve
router.get('/verify-requests', auth, requireRole(['curator', 'moderator', 'admin']), asyncErrorHandler(authController.getVerificationRequests));
router.post('/verify-resolve/:id', auth, requireRole(['curator', 'moderator', 'admin']), validate(authValidation.resolveVerifySchema), asyncErrorHandler(authController.resolveVerificationRequest));

export default router;
