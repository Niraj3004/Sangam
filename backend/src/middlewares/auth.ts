import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { sendError } from '../utils/response';
import { Role, VerifyTier } from '../constants/roles';

export interface JwtPayload {
  userId: string;
  role: Role;
  verifyTier: VerifyTier;
  orgId?: string;
  orgType?: 'employer' | 'college';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'UNAUTHORIZED', 'Missing or invalid token', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired token', 401);
  }
};
