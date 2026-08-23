import { Router } from 'express';
import * as opportunityController from './opportunity.controller';
import * as opportunityValidation from './opportunity.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { requireVerified } from '../../middlewares/requireVerified';
import { ownership } from '../../middlewares/ownership';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { Opportunity } from '../../models/Opportunity';

const router = Router();

// Ownership fetcher for Opportunity
const getOpportunityOwnerId = async (resourceId: string) => {
  const opp = await Opportunity.findById(resourceId).select('posterId');
  return opp ? opp.posterId.toString() : null;
};

router.get('/', validate(opportunityValidation.getOpportunitiesSchema), asyncErrorHandler(opportunityController.getOpportunities));
router.get('/:id', asyncErrorHandler(opportunityController.getOpportunityById));

// Protected routes
router.use(auth);

router.post(
  '/',
  requireVerified('college'), // Requires college tier (or org via logic not implemented here yet, assuming college min)
  validate(opportunityValidation.createOpportunitySchema),
  asyncErrorHandler(opportunityController.createOpportunity)
);

router.patch(
  '/:id',
  ownership(getOpportunityOwnerId),
  validate(opportunityValidation.updateOpportunitySchema),
  asyncErrorHandler(opportunityController.updateOpportunity)
);

router.delete(
  '/:id',
  ownership(getOpportunityOwnerId),
  asyncErrorHandler(opportunityController.deleteOpportunity)
);

export default router;
