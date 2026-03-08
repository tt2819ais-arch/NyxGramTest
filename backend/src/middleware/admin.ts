import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
}
