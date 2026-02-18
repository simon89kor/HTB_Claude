import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateBody } from '../middleware/validate';

const router = Router();

router.post('/signup', validateBody({
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
  nickname: { required: true, type: 'string', maxLength: 12 },
}), authController.signUp);

router.post('/login', validateBody({
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
}), authController.signIn);

router.post('/logout', authController.signOut);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);

export default router;
