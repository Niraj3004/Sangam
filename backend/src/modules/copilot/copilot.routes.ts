import { Router } from 'express';
import * as copilotController from './copilot.controller';
import * as copilotValidation from './copilot.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

// Get or generate action plan
router.get('/plan', asyncErrorHandler(copilotController.getActionPlan));

// Update plan item status
router.patch('/plan/:itemId', validate(copilotValidation.updatePlanItemSchema), asyncErrorHandler(copilotController.updatePlanItem));

// Chat with copilot
router.post('/chat', validate(copilotValidation.chatSchema), asyncErrorHandler(copilotController.chatWithCopilot));

export default router;
