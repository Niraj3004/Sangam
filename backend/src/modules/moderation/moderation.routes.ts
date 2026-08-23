import { Router } from 'express';
import * as moderationController from './moderation.controller';
import * as moderationValidation from './moderation.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/requireRole';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All moderation routes require auth
router.use(auth);

// Any authenticated user can submit a report
router.post('/report', validate(moderationValidation.reportSchema), asyncErrorHandler(moderationController.submitReport));

// Only elevated roles can view and resolve reports
const elevatedRoles = requireRole(['curator', 'moderator', 'admin']);

router.get('/queue', elevatedRoles, asyncErrorHandler(moderationController.getQueue));
router.post('/resolve/:id', elevatedRoles, validate(moderationValidation.resolveSchema), asyncErrorHandler(moderationController.resolveReport));

export default router;
