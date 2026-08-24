import { Router } from 'express';
import * as feedController from './feed.controller';
import * as feedValidation from './feed.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

// Get personalized opportunity feed
router.get('/personalized', asyncErrorHandler(feedController.getPersonalizedFeed));

// Track user interaction (more like this, not relevant, click, save)
router.post('/interactions', validate(feedValidation.trackInteractionSchema), asyncErrorHandler(feedController.trackInteraction));

export default router;
