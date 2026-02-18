import { Request, Response, NextFunction } from 'express';
import { routineService } from '../services/routineService';
import { AppError } from '../middleware/errorHandler';

export const routineController = {
  async getRoutines(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await routineService.getRoutines({
        category: req.query.category as string,
        search: req.query.search as string,
        sort: req.query.sort as 'latest' | 'popular' | 'rating',
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getTopRoutines(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await routineService.getTopRoutines();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  },

  async getRoutineById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await routineService.getRoutineById(id);
      res.json({ data });
    } catch (error) {
      next(error instanceof Error ? new AppError(404, '루틴을 찾을 수 없습니다') : error);
    }
  },

  async getRoutineItems(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await routineService.getRoutineItems(id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  },
};
