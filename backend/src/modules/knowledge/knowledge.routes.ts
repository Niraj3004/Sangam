import { Router } from 'express';
import * as knowledgeController from './knowledge.controller';
import * as knowledgeValidation from './knowledge.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { uploadImage } from '../../config/cloudinary';

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

// Generic upload for post images (e.g. for rich text editors or attaching to a new post)
router.post(
  '/posts/image',
  uploadImage.single('image'),
  asyncErrorHandler(knowledgeController.uploadPostImage)
);

export default router;
