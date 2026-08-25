import { Request, Response } from 'express';
import { AdService } from './ad.service';
import { AdCampaign } from '../../models/AdCampaign';

export class AdController {
  
  // POST /ads/:id/track
  static async trackInteraction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { actionType } = req.body; // 'impression' or 'click'
      
      const userId = req.user ? (req.user as any)._id.toString() : undefined;

      if (!['impression', 'click'].includes(actionType)) {
        return res.status(400).json({ success: false, message: 'Invalid actionType' });
      }

      const success = await AdService.trackInteraction(id, userId, actionType as 'impression' | 'click');
      
      if (!success) {
        return res.status(400).json({ success: false, message: 'Failed to track interaction or budget exhausted' });
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /organizations/:orgId/ads (For the Sponsor Portal)
  static async getOrgCampaigns(req: Request, res: Response) {
    try {
      const { orgId } = req.params;
      const campaigns = await AdCampaign.find({ organizationId: orgId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: campaigns });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /organizations/:orgId/ads (Create campaign from Sponsor Portal)
  static async createCampaign(req: Request, res: Response) {
    try {
      const { orgId } = req.params;
      const payload = { ...req.body, organizationId: orgId, status: 'pending_payment' };
      
      const newCampaign = await AdCampaign.create(payload);
      res.status(201).json({ success: true, data: newCampaign });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /admin/ads/pending (Admin Portal)
  static async getPendingCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await AdCampaign.find({ status: 'pending_payment' })
        .populate('organizationId', 'name')
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: campaigns });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // PUT /admin/ads/:id/status (Admin Portal)
  static async updateCampaignStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, approvedBudget } = req.body;

      if (!['active', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const updateData: any = { status };
      if (status === 'active' && approvedBudget) {
        updateData.totalBudget = approvedBudget;
      }

      const campaign = await AdCampaign.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      res.status(200).json({ success: true, data: campaign });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
