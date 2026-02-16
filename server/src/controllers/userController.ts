import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { userService } from '../services/userService';
import { AppError } from '../middleware/errorHandler';

export const userController = {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.getProfile(req.userId!);
      res.json({ data });
    } catch (error) {
      next(error instanceof Error ? new AppError(404, '프로필을 찾을 수 없습니다') : error);
    }
  },

  async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.updateProfile(req.userId!, req.body);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  },

  async deleteMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.deleteAccount(req.userId!);
      res.json({ message: '계정이 삭제되었습니다' });
    } catch (error) {
      next(error);
    }
  },

  async updatePreferences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { preferences } = req.body;
      if (!Array.isArray(preferences)) throw new AppError(400, 'preferences 배열이 필요합니다');
      const data = await userService.updatePreferences(req.userId!, preferences);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await userService.getUserById(id);
      res.json({ data });
    } catch (error) {
      next(error instanceof Error ? new AppError(404, '사용자를 찾을 수 없습니다') : error);
    }
  },

  async follow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await userService.followUser(req.userId!, id);
      res.json({ message: '팔로우 했습니다' });
    } catch (error) {
      next(error);
    }
  },

  async unfollow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await userService.unfollowUser(req.userId!, id);
      res.json({ message: '언팔로우 했습니다' });
    } catch (error) {
      next(error);
    }
  },

  async getFollowers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.getFollowers(req.userId!);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  },

  async getFollowing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.getFollowing(req.userId!);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  },
};
