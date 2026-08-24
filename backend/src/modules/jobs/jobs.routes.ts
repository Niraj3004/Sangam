import { Router } from 'express';
import * as jobsController from './jobs.controller';
import * as jobsValidation from './jobs.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All job routes require auth
router.use(auth);

// Get list of open jobs
router.get('/', asyncErrorHandler(jobsController.getJobs));

// Get specific job
router.get(
  '/:jobId',
  validate(jobsValidation.jobIdParamSchema),
  asyncErrorHandler(jobsController.getJobById)
);

// Create a new job (must be verified org owner)
router.post(
  '/',
  validate(jobsValidation.createJobSchema),
  asyncErrorHandler(jobsController.createJob)
);

// Apply for a job
router.post(
  '/:jobId/apply',
  validate(jobsValidation.applyJobSchema),
  asyncErrorHandler(jobsController.applyForJob)
);

// Update an application status (must be verified org owner)
router.patch(
  '/:jobId/applications/:appId',
  validate(jobsValidation.updateAppSchema),
  asyncErrorHandler(jobsController.updateApplicationStatus)
);

export default router;
