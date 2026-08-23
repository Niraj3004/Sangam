import { Router } from 'express';
import * as projectController from './project.controller';
import * as projectValidation from './project.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { ownership } from '../../middlewares/ownership';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { Project } from '../../models/Project';

const router = Router();

// Ownership fetcher for Project
const getProjectOwnerId = async (resourceId: string) => {
  const proj = await Project.findById(resourceId).select('ownerId');
  return proj ? proj.ownerId.toString() : null;
};

router.get('/', validate(projectValidation.getProjectsSchema), asyncErrorHandler(projectController.getProjects));
router.get('/:id', asyncErrorHandler(projectController.getProjectById));

// Protected routes
router.use(auth);

router.post(
  '/',
  validate(projectValidation.createProjectSchema),
  asyncErrorHandler(projectController.createProject)
);

router.patch(
  '/:id',
  ownership(getProjectOwnerId),
  validate(projectValidation.updateProjectSchema),
  asyncErrorHandler(projectController.updateProject)
);

router.delete(
  '/:id',
  ownership(getProjectOwnerId),
  asyncErrorHandler(projectController.deleteProject)
);

// Applications
router.post(
  '/:id/apply',
  validate(projectValidation.applyToRoleSchema),
  asyncErrorHandler(projectController.applyToRole)
);

router.get(
  '/:id/applications',
  ownership(getProjectOwnerId),
  asyncErrorHandler(projectController.getApplications)
);

router.post(
  '/:id/applications/:appId/resolve',
  ownership(getProjectOwnerId),
  validate(projectValidation.resolveApplicationSchema),
  asyncErrorHandler(projectController.resolveApplication)
);

export default router;
