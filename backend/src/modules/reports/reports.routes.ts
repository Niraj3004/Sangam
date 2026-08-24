import { Router } from 'express';
import * as reportsController from './reports.controller';
import * as reportsValidation from './reports.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All report routes require auth
router.use(auth);

router.post(
  '/',
  validate(reportsValidation.createReportSchema),
  asyncErrorHandler(reportsController.createReport)
);

export default router;
