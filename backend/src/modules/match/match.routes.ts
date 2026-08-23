import { Router } from 'express';
import * as matchController from './match.controller';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All match routes require authentication
router.use(auth);

// Get algorithmic suggestions with reasons (as POST to match PDF spec)
router.post('/people', asyncErrorHandler(matchController.getPeopleMatches));
router.post('/projects', asyncErrorHandler(matchController.getProjectMatches));
router.post('/ideas', asyncErrorHandler(matchController.getIdeaMatches));

export default router;
