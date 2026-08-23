import { Router } from 'express';
import * as discoverController from './discover.controller';
import * as discoverValidation from './discover.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

// Search and filter people
router.get('/people', validate(discoverValidation.discoverPeopleSchema), asyncErrorHandler(discoverController.getDiscoverPeople));

export default router;
