import { Router } from 'express';
import { AdController } from './ad.controller';
import { protect } from '../../middleware/auth';

const router = Router();

// Tracking (Public or Auth, depends on if we want strict user auth for impressions)
// We'll use protect but allow it to fail gracefully if no user? 
// For now, let's just make it a public endpoint but extract user if token provided.
// Since Sangam uses protect middleware that errors on no token, and we need ads for guests possibly:
// Assuming protect is required for feed, we'll just use it here.
router.post('/:id/track', protect, AdController.trackInteraction);

// Admin Portal Routes (In a real app, use an isAdmin middleware here)
router.get('/admin/pending', protect, AdController.getPendingCampaigns);
router.put('/admin/:id/status', protect, AdController.updateCampaignStatus);

export default router;
