import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { adminAuthMiddleware, requireRole } from '../middleware/adminAuth';
import { validateBody } from '../middleware/validate';

const router = Router();

// ─── Auth (no auth required for login) ──────────────────────────────

router.post('/auth/login', validateBody({
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
}), adminController.login);

router.get('/auth/me', adminAuthMiddleware, adminController.getMe);

router.put('/auth/password', adminAuthMiddleware, validateBody({
  oldPassword: { required: true, type: 'string' },
  newPassword: { required: true, type: 'string' },
}), adminController.changePassword);

// ─── Dashboard (super_admin only) ───────────────────────────────────

router.get('/dashboard/stats', adminAuthMiddleware, requireRole('super_admin'), adminController.getDashboardStats);
router.get('/dashboard/activity', adminAuthMiddleware, requireRole('super_admin'), adminController.getRecentActivity);

// ─── Users (super_admin only) ───────────────────────────────────────

router.get('/users/search', adminAuthMiddleware, requireRole('super_admin', 'sales'), adminController.searchUsers);
router.get('/users', adminAuthMiddleware, requireRole('super_admin'), adminController.getUsers);
router.get('/users/:id', adminAuthMiddleware, requireRole('super_admin'), adminController.getUserById);
router.put('/users/:id/status', adminAuthMiddleware, requireRole('super_admin'), validateBody({
  status: { required: true, type: 'string', enum: ['active', 'suspended', 'banned'] },
}), adminController.updateUserStatus);

// ─── Routines (both roles) ──────────────────────────────────────────

router.get('/routines', adminAuthMiddleware, requireRole('super_admin', 'sales'), adminController.getRoutines);
router.get('/routines/:id', adminAuthMiddleware, requireRole('super_admin', 'sales'), adminController.getRoutineById);
router.post('/routines', adminAuthMiddleware, requireRole('super_admin', 'sales'), validateBody({
  provider_id: { required: true, type: 'string' },
  title: { required: true, type: 'string', maxLength: 100 },
  category: { required: true, type: 'string' },
}), adminController.createRoutine);
router.put('/routines/:id', adminAuthMiddleware, requireRole('super_admin', 'sales'), adminController.updateRoutine);
router.put('/routines/:id/items', adminAuthMiddleware, requireRole('super_admin', 'sales'), adminController.updateRoutineItems);
router.put('/routines/:id/publish', adminAuthMiddleware, requireRole('super_admin', 'sales'), adminController.togglePublish);
router.delete('/routines/:id', adminAuthMiddleware, requireRole('super_admin'), adminController.deleteRoutine);

// ─── Purchases (super_admin only) ───────────────────────────────────

router.get('/purchases', adminAuthMiddleware, requireRole('super_admin'), adminController.getPurchases);
router.put('/purchases/:id/refund', adminAuthMiddleware, requireRole('super_admin'), adminController.refundPurchase);

// ─── Posts (super_admin only) ───────────────────────────────────────

router.get('/posts', adminAuthMiddleware, requireRole('super_admin'), adminController.getPosts);
router.put('/posts/:id/status', adminAuthMiddleware, requireRole('super_admin'), validateBody({
  status: { required: true, type: 'string', enum: ['active', 'hidden', 'deleted'] },
}), adminController.updatePostStatus);

// ─── Admin Management (super_admin only) ────────────────────────────

router.get('/admins', adminAuthMiddleware, requireRole('super_admin'), adminController.getAdmins);
router.post('/admins', adminAuthMiddleware, requireRole('super_admin'), validateBody({
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
  name: { required: true, type: 'string', maxLength: 50 },
  role: { required: true, type: 'string', enum: ['super_admin', 'sales'] },
}), adminController.createAdmin);
router.put('/admins/:id', adminAuthMiddleware, requireRole('super_admin'), adminController.updateAdmin);
router.delete('/admins/:id', adminAuthMiddleware, requireRole('super_admin'), adminController.deleteAdmin);

export default router;
