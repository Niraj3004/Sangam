import { Router } from 'express';
import * as resumeController from './resume.controller';
import * as resumeValidation from './resume.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

// Generate new resume draft
router.post('/generate', validate(resumeValidation.generateResumeSchema), asyncErrorHandler(resumeController.generateResume));

// Get all saved resumes
router.get('/', asyncErrorHandler(resumeController.getResumes));

// Update a resume draft
router.patch('/:id', validate(resumeValidation.updateResumeSchema), asyncErrorHandler(resumeController.updateResume));

// Export resume
router.post('/:id/export', asyncErrorHandler(resumeController.exportResume));

export default router;
