import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';

export const authController = {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, nickname, preferences } = req.body;
      const data = await authService.signUp(email, password, { email, nickname, preferences });
      res.status(201).json({ data });
    } catch (error) {
      next(error instanceof Error ? new AppError(400, error.message) : error);
    }
  },

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await authService.signIn(email, password);
      res.json({ data });
    } catch (error) {
      next(error instanceof Error ? new AppError(401, error.message) : error);
    }
  },

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';
      await authService.signOut(token);
      res.json({ message: '로그아웃 되었습니다' });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) throw new AppError(400, 'refresh_token이 필요합니다');
      const data = await authService.refreshToken(refresh_token);
      res.json({ data });
    } catch (error) {
      next(error instanceof Error ? new AppError(401, error.message) : error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw new AppError(400, '이메일이 필요합니다');
      await authService.forgotPassword(email);
      res.json({ message: '비밀번호 재설정 이메일을 발송했습니다' });
    } catch (error) {
      next(error instanceof Error ? new AppError(400, error.message) : error);
    }
  },
};
