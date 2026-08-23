import { Router } from 'express';
import * as ideasController from './ideas.controller';
import * as ideasValidation from './ideas.validation';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { ownership } from '../../middlewares/ownership';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

const router = Router();

router.use(auth);

router.post('/', validate(ideasValidation.createIdeaSchema), asyncErrorHandler(ideasController.createIdea));
router.get('/', asyncErrorHandler(ideasController.getIdeas));
router.get('/:id', validate(ideasValidation.ideaIdParamSchema), asyncErrorHandler(ideasController.getIdeaById));
router.patch('/:id', validate(ideasValidation.updateIdeaSchema), ownership(ideasController.getIdeaOwnerId), asyncErrorHandler(ideasController.updateIdea));
router.delete('/:id', validate(ideasValidation.ideaIdParamSchema), ownership(ideasController.getIdeaOwnerId), asyncErrorHandler(ideasController.deleteIdea));

export default router;
