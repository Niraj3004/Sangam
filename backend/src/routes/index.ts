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
import reviewRoutes from '../modules/review/review.routes';
import communitiesRoutes from '../modules/communities/communities.routes';
import knowledgeRoutes from '../modules/knowledge/knowledge.routes';
import organizationsRoutes from '../modules/organizations/organizations.routes';
import jobsRoutes from '../modules/jobs/jobs.routes';
import mentorshipRoutes from '../modules/mentorship/mentorship.routes';
import reportsRoutes from '../modules/reports/reports.routes';
import searchRoutes from '../modules/search/search.routes';
import feedRoutes from '../modules/feed/feed.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import copilotRoutes from '../modules/copilot/copilot.routes';

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
router.use('/review', reviewRoutes);
router.use('/communities', communitiesRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/orgs', organizationsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/reports', reportsRoutes);
router.use('/search', searchRoutes);
router.use('/feed', feedRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/copilot', copilotRoutes);

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
