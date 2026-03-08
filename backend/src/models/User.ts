import { User, UserPublic } from '../utils/types';

export function toPublicUser(user: User): UserPublic {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
    balance: user.balance,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
  };
}

export function toPublicUsers(users: User[]): UserPublic[] {
  return users.map(toPublicUser);
}
