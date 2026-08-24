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
router.get('/ideas', asyncErrorHandler(matchController.getIdeaMatches));

// Project Team Matching (Owner looking for complementary candidates)
router.get('/teams/:projectId/candidates', asyncErrorHandler(matchController.getTeamCandidates));
router.post('/teams/:projectId/invite', asyncErrorHandler(matchController.inviteToTeam));

export default router;
