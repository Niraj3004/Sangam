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

// Only elevated roles can view and resolve reports and flags
const elevatedRoles = requireRole(['curator', 'moderator', 'admin']);

// User Reports Queue
router.get('/reports', elevatedRoles, asyncErrorHandler(moderationController.getReportsQueue));
router.post('/reports/:id/resolve', elevatedRoles, validate(moderationValidation.resolveSchema), asyncErrorHandler(moderationController.resolveReport));

// AI Moderation Flags Queue
router.get('/flags', elevatedRoles, asyncErrorHandler(moderationController.getFlagsQueue));
router.post('/flags/:id/act', elevatedRoles, asyncErrorHandler(moderationController.actOnFlag));

export default router;
