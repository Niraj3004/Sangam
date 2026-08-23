import { Router } from 'express';
import { sendSuccess } from '../utils/response';
import authRoutes from '../modules/auth/auth.routes';
import profileRoutes from '../modules/profile/profile.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
