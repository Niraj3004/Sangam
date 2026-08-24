import { Router } from 'express';
import * as searchController from './search.controller';
import * as searchValidation from './search.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// Allow authenticated users to search globally
router.get('/', auth, validate(searchValidation.searchSchema), asyncErrorHandler(searchController.globalSearch));

export default router;
