import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * A helper middleware factory to verify ownership.
 * Expects the route parameter containing the resource ID to be named `id`, or as passed in `resourceIdParam`.
 * `fetchOwnerId` is a callback that fetches the owner's userId for a given resourceId.
 */
export const ownership = (fetchOwnerId: (resourceId: string) => Promise<string | null>, resourceIdParam = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
      }

      const resourceId = req.params[resourceIdParam] as string;
      if (!resourceId) {
        return sendError(res, 'BAD_REQUEST', `Missing route param ${resourceIdParam}`, 400);
      }

      const ownerId = await fetchOwnerId(resourceId);
      
      if (!ownerId) {
        return sendError(res, 'NOT_FOUND', 'Resource not found', 404);
      }

      // Admins bypass ownership checks
      if (req.user.role === 'admin' || ownerId.toString() === req.user.userId) {
        return next();
      }

      return sendError(res, 'FORBIDDEN', 'You do not own this resource', 403);
    } catch (error) {
      next(error);
    }
  };
};
