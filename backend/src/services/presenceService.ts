import { TYPING_TIMEOUT_MS } from '../utils/constants';

interface PresenceInfo {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}

interface TypingInfo {
  userId: string;
  chatId: string;
  timestamp: number;
}

export class PresenceService {
  private onlineUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private typingUsers: Map<string, TypingInfo> = new Map(); // `chatId:userId` -> TypingInfo

  addOnlineUser(userId: string, socketId: string): void {
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId)!.add(socketId);
  }

  removeOnlineUser(userId: string, socketId: string): void {
    const sockets = this.onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
      }
    }
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId) && this.onlineUsers.get(userId)!.size > 0;
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  getUserSocketIds(userId: string): string[] {
    const sockets = this.onlineUsers.get(userId);
    return sockets ? Array.from(sockets) : [];
  }

  setTyping(chatId: string, userId: string): void {
    const key = `${chatId}:${userId}`;
    this.typingUsers.set(key, {
      userId,
      chatId,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      this.clearTyping(chatId, userId);
    }, TYPING_TIMEOUT_MS);
  }

  clearTyping(chatId: string, userId: string): void {
    const key = `${chatId}:${userId}`;
    this.typingUsers.delete(key);
  }

  getTypingUsers(chatId: string): string[] {
    const result: string[] = [];
    const now = Date.now();
    for (const [key, info] of this.typingUsers) {
      if (info.chatId === chatId && now - info.timestamp < TYPING_TIMEOUT_MS) {
        result.push(info.userId);
      }
    }
    return result;
  }
}

export const presenceService = new PresenceService();
