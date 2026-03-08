import { db } from '../database/db';
import { toPublicUser, toPublicUsers } from '../models/User';
import { UserPublic } from '../utils/types';
import { validateBio } from '../utils/validators';

export class UserService {
  async getUserById(id: string): Promise<UserPublic | null> {
    const user = await db.findUserById(id);
    return user ? toPublicUser(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserPublic | null> {
    const user = await db.findUserByUsername(username);
    return user ? toPublicUser(user) : null;
  }

  async updateProfile(userId: string, data: { displayName?: string; bio?: string; avatarUrl?: string }): Promise<UserPublic | null> {
    if (data.bio !== undefined) {
      const bioValidation = validateBio(data.bio);
      if (!bioValidation.valid) {
        throw new Error(bioValidation.error!);
      }
    }

    const updated = await db.updateUser(userId, {
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    });

    return updated ? toPublicUser(updated) : null;
  }

  async searchUsers(query: string): Promise<UserPublic[]> {
    const users = await db.searchUsers(query);
    return toPublicUsers(users);
  }

  async getAllUsers(): Promise<UserPublic[]> {
    const users = await db.getAllUsers();
    return toPublicUsers(users);
  }

  async updateLastSeen(userId: string): Promise<void> {
    await db.updateUser(userId, { lastSeen: new Date() });
  }

  async getUserBalance(userId: string): Promise<number> {
    const user = await db.findUserById(userId);
    return user?.balance || 0;
  }
}

export const userService = new UserService();
