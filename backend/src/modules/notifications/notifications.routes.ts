import { Router } from 'express';
import * as notificationsController from './notifications.controller';
import * as notificationsValidation from './notifications.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.get('/prefs', auth, asyncErrorHandler(notificationsController.getPreferences));
router.patch('/prefs', auth, validate(notificationsValidation.updatePrefsSchema), asyncErrorHandler(notificationsController.updatePreferences));

router.get('/', auth, asyncErrorHandler(notificationsController.getNotifications));
router.patch('/read-all', auth, asyncErrorHandler(notificationsController.markAllAsRead));
router.patch('/:id/read', auth, asyncErrorHandler(notificationsController.markAsRead));

export default router;
