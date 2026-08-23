import { Router } from 'express';
import { sendSuccess } from '../utils/response';
import authRoutes from '../modules/auth/auth.routes';
import profileRoutes from '../modules/profile/profile.routes';
import opportunityRoutes from '../modules/opportunities/opportunity.routes';
import connectionRoutes from '../modules/connections/connection.routes';
import projectRoutes from '../modules/projects/project.routes';
import moderationRoutes from '../modules/moderation/moderation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/connections', connectionRoutes);
router.use('/projects', projectRoutes);
router.use('/moderation', moderationRoutes);

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
