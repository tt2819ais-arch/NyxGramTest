import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { db } from '../database/db';
import { toPublicUser } from '../models/User';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, displayName } = req.body;
      const result = await authService.register(username, password, displayName);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await db.findUserById(req.user!.userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.json({ success: true, data: { user: toPublicUser(user) } });
    } catch (error: any) {
      
