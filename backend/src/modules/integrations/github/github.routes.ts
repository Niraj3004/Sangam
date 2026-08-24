import { Router } from 'express';
import * as githubController from './github.controller';
import * as githubValidation from './github.validation';
import { validate } from '../../../middlewares/validate';
import { auth } from '../../../middlewares/auth';
import { asyncErrorHandler } from '../../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

// Connect GitHub account
router.post('/connect', validate(githubValidation.connectGithubSchema), asyncErrorHandler(githubController.connectGithub));

// Fetch public repositories
router.get('/repos', asyncErrorHandler(githubController.getPublicRepos));

// Import a repository to profile
router.post('/import', validate(githubValidation.importRepoSchema), asyncErrorHandler(githubController.importRepository));

export default router;
