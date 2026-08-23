import { Router } from 'express';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
