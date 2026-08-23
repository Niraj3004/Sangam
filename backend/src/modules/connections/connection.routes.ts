import { Router } from 'express';
import * as connectionController from './connection.controller';
import * as connectionValidation from './connection.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All connection routes require authentication
router.use(auth);

// Feeds
router.get('/', asyncErrorHandler(connectionController.getMyConnections));
router.get('/pending', asyncErrorHandler(connectionController.getPendingRequests));
router.get('/suggestions', asyncErrorHandler(connectionController.getSuggestions));

// Actions
router.post('/request/:userId', validate(connectionValidation.userIdParamSchema), asyncErrorHandler(connectionController.requestConnection));
router.post('/accept/:userId', validate(connectionValidation.userIdParamSchema), asyncErrorHandler(connectionController.acceptConnection));
router.post('/reject/:userId', validate(connectionValidation.userIdParamSchema), asyncErrorHandler(connectionController.rejectConnection));

export default router;
