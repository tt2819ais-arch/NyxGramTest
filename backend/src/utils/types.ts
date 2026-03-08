export interface User {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  balance: number;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  balance: number;
  lastSeen: Date;
  createdAt: Date;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  mediaUrl: string | null;
  mediaThumbnail: string | null;
  mediaDuration: number | null;
  mediaSize: number | null;
  fileName: string | null;
  replyToId: string | null;
  reactions: Reaction[];
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'video_note' | 'file';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'card' | 'collectible' | 'decoration';
  isActive: boolean;
  createdAt: Date;
}

export interface GiftInstance {
  id: string;
  giftId: string;
  ownerId: string;
  senderId: string | null;
  gift: Gift;
  receivedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'gift_sent' | 'gift_received' | 'admin_grant';
  amount: number;
  giftId: string | null;
  targetUserId: string | null;
  description: string;
  createdAt: Date;
}

export interface Ban {
  id: string;
  userId: string;
  adminId: string;
  reason: string;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface ChatParticipant {
  chatId: string;
  userId: string;
  joinedAt: Date;
  lastReadMessageId: string | null;
}

export interface WSMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface AuthPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
