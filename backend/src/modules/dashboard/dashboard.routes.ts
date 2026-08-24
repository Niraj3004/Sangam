import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { auth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/requireRole';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

// Only students (and verified students) need the student dashboard
router.get('/student', requireRole(['student', 'verified_student']), asyncErrorHandler(dashboardController.getStudentDashboard));

export default router;
