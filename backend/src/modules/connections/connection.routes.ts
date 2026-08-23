import { Router } from 'express';
import * as connectionController from './connection.controller';
import * as connectionValidation from './connection.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireVerified } from '../../middlewares/requireVerified';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import rateLimit from 'express-rate-limit';

const router = Router();

// Anti-spam: cap connection requests
const connectionRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20, // 20 requests per day per IP
  message: { success: false, error: 'Too many connection requests, please try again tomorrow.' }
});

// All connection routes require authentication
router.use(auth);

// Feeds
router.get('/', asyncErrorHandler(connectionController.getMyConnections));
router.get('/pending', asyncErrorHandler(connectionController.getPendingRequests));

// Actions
router.post(
  '/request/:userId',
  connectionRateLimiter,
  validate(connectionValidation.userIdParamSchema),
  asyncErrorHandler(connectionController.requestConnection)
);
router.post('/accept/:userId', validate(connectionValidation.userIdParamSchema), asyncErrorHandler(connectionController.acceptConnection));
router.post('/reject/:userId', validate(connectionValidation.userIdParamSchema), asyncErrorHandler(connectionController.rejectConnection));

export default router;
