import { Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../middleware/adminAuth';
import { AppError } from '../middleware/errorHandler';
import { adminAuthService } from '../services/adminAuthService';
import { adminDashboardService } from '../services/adminDashboardService';
import { adminUserService } from '../services/adminUserService';
import { adminRoutineService } from '../services/adminRoutineService';
import { adminPurchaseService } from '../services/adminPurchaseService';
import { adminPostService } from '../services/adminPostService';
import { adminManageService } from '../services/adminManageService';

export const adminController = {
  // ─── Auth ──────────────────────────────────────────────────────────

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await adminAuthService.login(email, password);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(401, '로그인에 실패했습니다'));
    }
  },

  async getMe(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminAuthService.getProfile(req.adminUser!.id);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(404, '관리자 정보를 찾을 수 없습니다'));
    }
  },

  async changePassword(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        throw new AppError(400, '현재 비밀번호와 새 비밀번호가 필요합니다');
      }
      await adminAuthService.changePassword(req.adminUser!.id, oldPassword, newPassword);
      res.json({ message: '비밀번호가 변경되었습니다' });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '비밀번호 변경에 실패했습니다'));
    }
  },

  // ─── Dashboard ─────────────────────────────────────────────────────

  async getDashboardStats(_req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminDashboardService.getStats();
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '대시보드 통계를 가져오는데 실패했습니다'));
    }
  },

  async getRecentActivity(_req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminDashboardService.getRecentActivity();
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '최근 활동을 가져오는데 실패했습니다'));
    }
  },

  // ─── Users ─────────────────────────────────────────────────────────

  async getUsers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const data = await adminUserService.getUsers(page, limit, search, status);
      res.json(data);
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '사용자 목록을 가져오는데 실패했습니다'));
    }
  },

  async getUserById(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await adminUserService.getUserById(id);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(404, '사용자를 찾을 수 없습니다'));
    }
  },

  async updateUserStatus(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      if (!status || !['active', 'suspended', 'banned'].includes(status)) {
        throw new AppError(400, '유효한 상태 값이 필요합니다 (active, suspended, banned)');
      }
      const data = await adminUserService.updateUserStatus(id, status);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '사용자 상태 변경에 실패했습니다'));
    }
  },

  async searchUsers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      if (!search) {
        throw new AppError(400, '검색어가 필요합니다');
      }
      const limit = Number(req.query.limit) || 20;
      const data = await adminUserService.searchUsers(search, limit);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '사용자 검색에 실패했습니다'));
    }
  },

  // ─── Routines ──────────────────────────────────────────────────────

  async getRoutines(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const isPublished = req.query.is_published !== undefined
        ? req.query.is_published === 'true'
        : undefined;
      const data = await adminRoutineService.getRoutines(page, limit, search, category, isPublished);
      res.json(data);
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '루틴 목록을 가져오는데 실패했습니다'));
    }
  },

  async getRoutineById(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await adminRoutineService.getRoutineById(id);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(404, '루틴을 찾을 수 없습니다'));
    }
  },

  async createRoutine(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminRoutineService.createRoutine(req.body, req.adminUser!.id);
      res.status(201).json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '루틴 생성에 실패했습니다'));
    }
  },

  async updateRoutine(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await adminRoutineService.updateRoutine(id, req.body);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '루틴 수정에 실패했습니다'));
    }
  },

  async updateRoutineItems(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { items } = req.body;
      if (!Array.isArray(items)) {
        throw new AppError(400, 'items 배열이 필요합니다');
      }
      const data = await adminRoutineService.updateRoutineItems(id, items);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '루틴 항목 수정에 실패했습니다'));
    }
  },

  async togglePublish(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await adminRoutineService.togglePublish(id);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '루틴 공개 상태 변경에 실패했습니다'));
    }
  },

  async deleteRoutine(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await adminRoutineService.deleteRoutine(id);
      res.json({ message: '루틴이 삭제되었습니다' });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '루틴 삭제에 실패했습니다'));
    }
  },

  // ─── Purchases ─────────────────────────────────────────────────────

  async getPurchases(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const data = await adminPurchaseService.getPurchases(page, limit, search, status);
      res.json(data);
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '구매 목록을 가져오는데 실패했습니다'));
    }
  },

  async refundPurchase(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await adminPurchaseService.refundPurchase(id);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '환불 처리에 실패했습니다'));
    }
  },

  // ─── Posts ─────────────────────────────────────────────────────────

  async getPosts(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const data = await adminPostService.getPosts(page, limit, search, status);
      res.json(data);
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '게시글 목록을 가져오는데 실패했습니다'));
    }
  },

  async updatePostStatus(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      if (!status || !['active', 'hidden', 'deleted'].includes(status)) {
        throw new AppError(400, '유효한 상태 값이 필요합니다 (active, hidden, deleted)');
      }
      const data = await adminPostService.updatePostStatus(id, status);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '게시글 상태 변경에 실패했습니다'));
    }
  },

  // ─── Admin Management ─────────────────────────────────────────────

  async getAdmins(_req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminManageService.getAdmins();
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '관리자 목록을 가져오는데 실패했습니다'));
    }
  },

  async createAdmin(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name || !role) {
        throw new AppError(400, '이메일, 비밀번호, 이름, 역할이 필요합니다');
      }
      if (!['super_admin', 'sales'].includes(role)) {
        throw new AppError(400, '유효한 역할이 필요합니다 (super_admin, sales)');
      }
      const data = await adminManageService.createAdmin({ email, password, name, role });
      res.status(201).json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '관리자 생성에 실패했습니다'));
    }
  },

  async updateAdmin(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await adminManageService.updateAdmin(id, req.body);
      res.json({ data });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '관리자 정보 수정에 실패했습니다'));
    }
  },

  async deleteAdmin(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await adminManageService.deleteAdmin(id, req.adminUser!.id);
      res.json({ message: '관리자가 삭제되었습니다' });
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, '관리자 삭제에 실패했습니다'));
    }
  },
};
