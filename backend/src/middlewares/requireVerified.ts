import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { VerifyTier, VERIFY_TIERS } from '../constants/roles';

// Hierarchical definition
const TIER_LEVELS: Record<VerifyTier, number> = {
  [VERIFY_TIERS.EMAIL]: 1,
  [VERIFY_TIERS.COLLEGE]: 2,
  [VERIFY_TIERS.MANUAL]: 3,
};

export const requireVerified = (minTier: VerifyTier) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
    }

    const userLevel = TIER_LEVELS[req.user.verifyTier];
    const requiredLevel = TIER_LEVELS[minTier];

    if (userLevel < requiredLevel) {
      return sendError(res, 'FORBIDDEN', `Requires ${minTier} verification or higher`, 403);
    }

    next();
  };
};
