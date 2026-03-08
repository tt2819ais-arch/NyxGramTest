import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';
import { ENV } from '../config/env';
import { validateUsername, validatePassword } from '../utils/validators';
import { toPublicUser } from '../models/User';
import { UserPublic, AuthPayload } from '../utils/types';

export interface AuthResult {
  user: UserPublic;
  token: string;
}

export class AuthService {
  async register(username: string, password: string, displayName?: string): Promise<AuthResult> {
    const usernameClean = username.startsWith('@') ? username.slice(1) : username;

    const usernameValidation = validateUsername(usernameClean);
    if (!usernameValidation.valid) {
      throw new Error(usernameValidation.error!);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error!);
    }

    const existing = await db.findUserByUsername(usernameClean);
    if (existing) {
      throw new Error('Username already taken');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.createUser({
      username: usernameClean,
      passwordHash,
      displayName: displayName || usernameClean,
      balance: 1000,
    });

    const token = this.generateToken(user.id, user.username, user.isAdmin);

    return {
      user: toPublicUser(user),
      token,
    };
  }

  async login(username: string, password: string): Promise<AuthResult> {
    const usernameClean = username.startsWith('@') ? username.slice(1) : username;

    const user = await db.findUserByUsername(usernameClean);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (user.isBanned) {
      throw new Error('Account is banned');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    await db.updateUser(user.id, { lastSeen: new Date() });

    const token = this.generateToken(user.id, user.username, user.isAdmin);

    return {
      user: toPublicUser(user),
      token,
    };
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const usernameClean = username.startsWith('@') ? username.slice(1) : username;
    const validation = validateUsername(usernameClean);
    if (!validation.valid) return false;

    const existing = await db.findUserByUsername(usernameClean);
    return !existing;
  }

  private generateToken(userId: string, username: string, isAdmin: boolean): string {
    const payload: AuthPayload = { userId, username, isAdmin };
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRY } as any);
  }
}

export const authService = new AuthService();
