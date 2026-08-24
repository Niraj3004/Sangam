import { Router } from 'express';
import * as portfolioController from './portfolio.controller';
import * as portfolioValidation from './portfolio.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// Public endpoint to view a portfolio
router.get('/:handle', asyncErrorHandler(portfolioController.getPortfolio));

// Authenticated endpoint to update configuration
router.patch('/config', auth, validate(portfolioValidation.updateConfigSchema), asyncErrorHandler(portfolioController.updatePortfolioConfig));

export default router;
