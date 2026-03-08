export type WSConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface WSMessage<T = unknown> {
  type: WSEventType;
  payload: T;
  timestamp: number;
  requestId?: string;
}

export type WSEventType =
  // Connection events
  | 'connection:established'
  | 'connection:error'
  | 'connection:ping'
  | 'connection:pong'

  // Auth events
  | 'auth:authenticate'
  | 'auth:authenticated'
  | 'auth:error'

  // Message events
  | 'message:send'
  | 'message:sent'
  | 'message:new'
  | 'message:edit'
  | 'message:edited'
  | 'message:delete'
  | 'message:deleted'
  | 'message:read'
  | 'message:read_ack'
  | 'message:reaction'
  | 'message:reaction_update'

  // Chat events
  | 'chat:create'
  | 'chat:created'
  | 'chat:update'
  | 'chat:updated'
  | 'chat:delete'
  | 'chat:deleted'

  // Typing events
  | 'typing:start'
  | 'typing:stop'
  | 'typing:update'

  // Presence events
  | 'presence:online'
  | 'presence:offline'
  | 'presence:update'

  // Gift events
  | 'gift:sent'
  | 'gift:received'
  | 'gift:animation'

  // User events
  | 'user:updated'
  | 'user:banned'
  | 'user:unbanned'
  | 'user:verified'
  | 'user:unverified'

  // Error
  | 'error';

// Payloads for specific events

export interface WSAuthPayload {
  token: string;
}

export interface WSAuthenticatedPayload {
  userId: string;
  username: string;
  sessionId: string;
}

export interface WSMessageSendPayload {
  chatId: string;
  type: string;
  content: string;
  localId: string;
  replyToId?: string;
  mediaUrl?: string;
  mediaMeta?: Record<string, unknown>;
}

export interface WSMessageNewPayload {
  id: string;
  chatId: string;
  senderId: string;
  senderUsername: string;
  senderAvatar: string | null;
  type: string;
  content: string;
  media: unknown | null;
  replyTo: unknown | null;
  createdAt: string;
  localId?: string;
}

export interface WSMessageEditPayload {
  messageId: string;
  content: string;
}

export interface WSMessageDeletePayload {
  messageId: string;
  chatId: string;
  deleteForAll: boolean;
}

export interface WSMessageReadPayload {
  chatId: string;
  messageId: string;
  userId: string;
}

export interface WSMessageReactionPayload {
  messageId: string;
  chatId: string;
  emoji: string;
  userId: string;
  action: 'add' | 'remove';
}

export interface WSTypingPayload {
  chatId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface WSPresencePayload {
  userId: string;
  isOnline: boolean;
  lastSeen: string | null;
}

export interface WSGiftSentPayload {
  transactionId: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  giftRarity: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  chatId: string;
  message?: string;
}

export interface WSErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface WSReconnectConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_WS_RECONNECT_CONFIG: WSReconnectConfig = {
  maxRetries: 10,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 1.5,
};

export const WS_PING_INTERVAL = 25000;
export const WS_PONG_TIMEOUT = 10000;
