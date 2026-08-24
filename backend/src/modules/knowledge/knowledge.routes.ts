import { Router } from 'express';
import * as knowledgeController from './knowledge.controller';
import * as knowledgeValidation from './knowledge.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

// All knowledge routes require auth
router.use(auth);

// Posts
router.post(
  '/:communityId/posts',
  validate(knowledgeValidation.createPostSchema),
  asyncErrorHandler(knowledgeController.createPost)
);

router.get(
  '/:communityId/posts',
  validate(knowledgeValidation.getPostsSchema),
  asyncErrorHandler(knowledgeController.getCommunityPosts)
);

router.get(
  '/posts/:postId',
  validate(knowledgeValidation.postIdParamSchema),
  asyncErrorHandler(knowledgeController.getPost)
);

// Comments
router.post(
  '/posts/:postId/comments',
  validate(knowledgeValidation.createCommentSchema),
  asyncErrorHandler(knowledgeController.createComment)
);

router.get(
  '/posts/:postId/comments',
  validate(knowledgeValidation.getCommentsSchema),
  asyncErrorHandler(knowledgeController.getComments)
);

export default router;
