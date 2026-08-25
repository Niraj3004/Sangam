import { Router } from 'express';
import { AdController } from './ad.controller';
import { auth } from '../../middlewares/auth';

const router = Router();

// Tracking (Public or Auth, depends on if we want strict user auth for impressions)
// We'll use auth but allow it to fail gracefully if no user? 
// For now, let's just make it a public endpoint but extract user if token provided.
// Since Sangam uses auth middleware that errors on no token, and we need ads for guests possibly:
// Assuming auth is required for feed, we'll just use it here.
router.post('/:id/track', auth, AdController.trackInteraction);

// Admin Portal Routes (In a real app, use an isAdmin middleware here)
router.get('/admin/pending', auth, AdController.getPendingCampaigns);
router.put('/admin/:id/status', auth, AdController.updateCampaignStatus);

export default router;
