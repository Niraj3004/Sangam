import { Router } from 'express';
import { sendSuccess } from '../utils/response';
import authRoutes from '../modules/auth/auth.routes';
import profileRoutes from '../modules/profile/profile.routes';
import opportunityRoutes from '../modules/opportunities/opportunity.routes';
import connectionRoutes from '../modules/connections/connection.routes';
import projectRoutes from '../modules/projects/project.routes';
import moderationRoutes from '../modules/moderation/moderation.routes';
import notificationsRoutes from '../modules/notifications/notifications.routes';
import discoverRoutes from '../modules/discover/discover.routes';
import ideasRoutes from '../modules/ideas/ideas.routes';
import matchRoutes from '../modules/match/match.routes';
import messagesRoutes from '../modules/messages/messages.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/connections', connectionRoutes);
router.use('/projects', projectRoutes);
router.use('/moderation', moderationRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/discover', discoverRoutes);
router.use('/ideas', ideasRoutes);
router.use('/match', matchRoutes);
router.use('/messages', messagesRoutes);

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
