import { Router } from 'express';
import * as mentorshipController from './mentorship.controller';
import * as mentorshipValidation from './mentorship.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All mentorship routes require auth
router.use(auth);

// Request mentorship
router.post(
  '/request',
  validate(mentorshipValidation.requestMentorshipSchema),
  asyncErrorHandler(mentorshipController.requestMentorship)
);

// Get my pending inbound requests
router.get('/requests', asyncErrorHandler(mentorshipController.getMyRequests));

// Get my active mentorships
router.get('/', asyncErrorHandler(mentorshipController.getMyMentorships));

// Accept
router.patch(
  '/:id/accept',
  validate(mentorshipValidation.acceptMentorshipSchema),
  asyncErrorHandler(mentorshipController.acceptMentorship)
);

// Decline
router.patch(
  '/:id/decline',
  validate(mentorshipValidation.mentorshipIdParamSchema),
  asyncErrorHandler(mentorshipController.declineMentorship)
);

export default router;
