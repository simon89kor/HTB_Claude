import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminUser } from '../types/admin';

export interface AdminRequest extends Request {
  adminUser?: AdminUser;
}

export interface AdminJwtPayload {
  id: string;
  email: string;
  role: 'super_admin' | 'sales';
}

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, env.adminJwtSecret, { expiresIn: '24h' });
}

export function adminAuthMiddleware(req: AdminRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: '관리자 인증 토큰이 필요합니다' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.adminJwtSecret) as AdminJwtPayload;
    req.adminUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: '',
      is_active: true,
      last_login_at: null,
      created_at: '',
      updated_at: '',
    };
    next();
  } catch {
    res.status(401).json({ error: '유효하지 않은 관리자 토큰입니다' });
  }
}

export function requireRole(...roles: Array<'super_admin' | 'sales'>) {
  return (req: AdminRequest, res: Response, next: NextFunction): void => {
    if (!req.adminUser) {
      res.status(401).json({ error: '관리자 인증이 필요합니다' });
      return;
    }

    if (!roles.includes(req.adminUser.role)) {
      res.status(403).json({ error: '해당 기능에 대한 권한이 없습니다' });
      return;
    }

    next();
  };
}
