import { Router } from 'express';
import * as matchController from './match.controller';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All match routes require authentication
router.use(auth);

// Get algorithmic suggestions with reasons
router.get('/suggestions', asyncErrorHandler(matchController.getMatchSuggestions));

export default router;
