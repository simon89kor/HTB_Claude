import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);
router.delete('/me', authMiddleware, userController.deleteMe);
router.put('/me/preference', authMiddleware, userController.updatePreferences);
router.get('/me/followers', authMiddleware, userController.getFollowers);
router.get('/me/following', authMiddleware, userController.getFollowing);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/:id/follow', authMiddleware, userController.follow);
router.delete('/:id/follow', authMiddleware, userController.unfollow);

export default router;
