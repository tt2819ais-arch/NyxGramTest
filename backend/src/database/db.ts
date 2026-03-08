import { User, Chat, Message, Gift, GiftInstance, Transaction, Ban, ChatParticipant, Reaction, UserPublic, MessageType, MessageStatus } from '../utils/types';
import { generateId } from '../utils/helpers';
import bcrypt from 'bcryptjs';
import { DEFAULT_ADMIN, DEFAULT_GIFTS } from '../utils/constants';

// In-memory database simulating PostgreSQL
class Database {
  users: Map<string, User> = new Map();
  chats: Map<string, Chat> = new Map();
  messages: Map<string, Message> = new Map();
  gifts: Map<string, Gift> = new Map();
  giftInstances: Map<string, GiftInstance> = new Map();
  transactions: Map<string, Transaction> = new Map();
  bans: Map<string, Ban> = new Map();
  chatParticipants: Map<string, ChatParticipant> = new Map();
  reactions: Map<string, Reaction & { messageId: string; id: string }> = new Map();
  readReceipts: Map<string, { chatId: string; userId: string; lastReadMessageId: string | null; readAt: Date }> = new Map();

  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Create default admin
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
    const adminId = generateId();
    const adminUser: User = {
      id: adminId,
      username: DEFAULT_ADMIN.username,
      passwordHash,
      displayName: DEFAULT_ADMIN.displayName,
      bio: DEFAULT_ADMIN.bio,
      avatarUrl: null,
      isVerified: DEFAULT_ADMIN.isVerified,
      isAdmin: DEFAULT_ADMIN.isAdmin,
      isBanned: false,
      balance: DEFAULT_ADMIN.balance,
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminId, adminUser);

    // Create default gifts
    for (const giftData of DEFAULT_GIFTS) {
      const giftId = generateId();
      const gift: Gift = {
        id: giftId,
        name: giftData.name,
        description: giftData.description,
        imageUrl: giftData.imageUrl,
        price: giftData.price,
        rarity: giftData.rarity as Gift['rarity'],
        category: giftData.category as Gift['category'],
        isActive: true,
        createdAt: new Date(),
      };
      this.gifts.set(giftId, gift);
    }

    this.initialized = true;
    console.log('[DB] Database initialized with default data');
    console.log(`[DB] Admin account: @${DEFAULT_ADMIN.username}`);
  }

  // User operations
  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const clean = username.startsWith('@') ? username.slice(1) : username;
    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === clean.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async createUser(data: Partial<User>): Promise<User> {
    const id = generateId();
    const user: User = {
      id,
      username: data.username!,
      passwordHash: data.passwordHash!,
      displayName: data.displayName || data.username!,
      bio: data.bio || '',
      avatarUrl: data.avatarUrl || null,
      isVerified: data.isVerified || false,
      isAdmin: data.isAdmin || false,
      isBanned: false,
      balance: data.balance || 1000,
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async searchUsers(query: string): Promise<User[]> {
    const q = query.toLowerCase();
    return Array.from(this.users.values()).filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q)
    );
  }

  // Chat operations
  async findChatById(id: string): Promise<Chat | null> {
    return this.chats.get(id) || null;
  }

  async findDirectChat(userId1: string, userId2: string): Promise<Chat | null> {
    for (const chat of this.chats.values()) {
      if (chat.type !== 'direct') continue;
      const participants = chat.participants;
      if (
        participants.length === 2 &&
        participants.includes(userId1) &&
        participants.includes(userId2)
      ) {
        return chat;
      }
    }
    return null;
  }

  async createChat(data: { type: 'direct' | 'group'; participants: string[]; name?: string }): Promise<Chat> {
    const id = generateId();
    const chat: Chat = {
      id,
      type: data.type,
      name: data.name || null,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: data.participants,
      lastMessage: null,
      unreadCount: 0,
    };
    this.chats.set(id, chat);

    for (const userId of data.participants) {
      const key = `${id}:${userId}`;
      this.chatParticipants.set(key, {
        chatId: id,
        userId,
        joinedAt: new Date(),
        lastReadMessageId: null,
      });
    }

    return chat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const chatIds: string[] = [];
    for (const [, cp] of this.chatParticipants) {
      if (cp.userId === userId) {
        chatIds.push(cp.chatId);
      }
    }

    const chats: Chat[] = [];
    for (const chatId of chatIds) {
      const chat = this.chats.get(chatId);
      if (chat) {
        // Get last message
        const messages = this.getMessagesByChatIdSync(chatId);
        const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

        // Get unread count
        const receipt = this.readReceipts.get(`${chatId}:${userId}`);
        let unreadCount = 0;
        if (lastMsg) {
          if (receipt?.lastReadMessageId) {
            const lastReadMsg = this.messages.get(receipt.lastReadMessageId);
            if (lastReadMsg) {
              unreadCount = messages.filter(
                (m) => m.createdAt > lastReadMsg.createdAt && m.senderId !== userId
              ).length;
            }
          } else {
            unreadCount = messages.filter((m) => m.senderId !== userId).length;
          }
        }

        chats.push({
          ...chat,
          lastMessage: lastMsg,
          unreadCount,
        });
      }
    }

    return chats.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt?.getTime() || a.createdAt.getTime();
      const bTime = b.lastMessage?.createdAt?.getTime() || b.createdAt.getTime();
      return bTime - aTime;
    });
  }

  // Message operations
  private getMessagesByChatIdSync(chatId: string): Message[] {
    const messages: Message[] = [];
    for (const msg of this.messages.values()) {
      if (msg.chatId === chatId && !((msg as any).isDeleted)) {
        messages.push(msg);
      }
    }
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getMessages(chatId: string, limit: number = 50, before?: string): Promise<Message[]> {
    let messages = this.getMessagesByChatIdSync(chatId);

    if (before) {
      const beforeMsg = this.messages.get(before);
      if (beforeMsg) {
        messages = messages.filter((m) => m.createdAt < beforeMsg.createdAt);
      }
    }

    return messages.slice(-limit);
  }

  async createMessage(data: Partial<Message>): Promise<Message> {
    const id = generateId();
    const message: Message = {
      id,
      chatId: data.chatId!,
      senderId: data.senderId!,
      type: data.type || 'text',
      content: data.content || '',
      mediaUrl: data.mediaUrl || null,
      mediaThumbnail: data.mediaThumbnail || null,
      mediaDuration: data.mediaDuration || null,
      mediaSize: data.mediaSize || null,
      fileName: data.fileName || null,
      replyToId: data.replyToId || null,
      reactions: [],
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.messages.set(id, message);

    // Update chat
    const chat = this.chats.get(data.chatId!);
    if (chat) {
      chat.lastMessage = message;
      chat.updatedAt = new Date();
      this.chats.set(data.chatId!, chat);
    }

    return message;
  }

  async updateMessageStatus(messageId: string, status: MessageStatus): Promise<void> {
    const msg = this.messages.get(messageId);
    if (msg) {
      msg.status = status;
      msg.updatedAt = new Date();
      this.messages.set(messageId, msg);
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const msg = this.messages.get(messageId);
    if (!msg) return;

    const existingIdx = msg.reactions.findIndex(
      (r) => r.userId === userId && r.emoji === emoji
    );
    if (existingIdx >= 0) {
      msg.reactions.splice(existingIdx, 1);
    } else {
      msg.reactions.push({ userId, emoji, createdAt: new Date() });
    }
    this.messages.set(messageId, msg);
  }

  async deleteMessage(messageId: string): Promise<void> {
    const msg = this.messages.get(messageId);
    if (msg) {
      (msg as any).isDeleted = true;
      this.messages.set(messageId, msg);
    }
  }

  // Gift operations
  async getAllGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values()).filter((g) => g.isActive);
  }

  async findGiftById(id: string): Promise<Gift | null> {
    return this.gifts.get(id) || null;
  }

  async createGift(data: Partial<Gift>): Promise<Gift> {
    const id = generateId();
    const gift: Gift = {
      id,
      name: data.name!,
      description: data.description || '',
      imageUrl: data.imageUrl || '/gifts/default.svg',
      price: data.price || 0,
      rarity: data.rarity || 'common',
      category: data.category || 'card',
      isActive: true,
      createdAt: new Date(),
    };
    this.gifts.set(id, gift);
    return gift;
  }

  async updateGift(id: string, data: Partial<Gift>): Promise<Gift | null> {
    const gift = this.gifts.get(id);
    if (!gift) return null;
    const updated = { ...gift, ...data };
    this.gifts.set(id, updated);
    return updated;
  }

  async deleteGift(id: string): Promise<void> {
    const gift = this.gifts.get(id);
    if (gift) {
      gift.isActive = false;
      this.gifts.set(id, gift);
    }
  }

  async getUserGifts(userId: string): Promise<GiftInstance[]> {
    const instances: GiftInstance[] = [];
    for (const gi of this.giftInstances.values()) {
      if (gi.ownerId === userId) {
        instances.push(gi);
      }
    }
    return instances.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
  }

  async createGiftInstance(data: { giftId: string; ownerId: string; senderId: string | null }): Promise<GiftInstance> {
    const id = generateId();
    const gift = this.gifts.get(data.giftId)!;
    const instance: GiftInstance = {
      id,
      giftId: data.giftId,
      ownerId: data.ownerId,
      senderId: data.senderId,
      gift,
      receivedAt: new Date(),
    };
    this.giftInstances.set(id, instance);
    return instance;
  }

  // Transaction operations
  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const id = generateId();
    const tx: Transaction = {
      id,
      userId: data.userId!,
      type: data.type!,
      amount: data.amount!,
      giftId: data.giftId || null,
      targetUserId: data.targetUserId || null,
      description: data.description || '',
      createdAt: new Date(),
    };
    this.transactions.set(id, tx);
    return tx;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const txs: Transaction[] = [];
    for (const tx of this.transactions.values()) {
      if (tx.userId === userId) {
        txs.push(tx);
      }
    }
    return txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Ban operations
  async banUser(userId: string, adminId: string, reason: string): Promise<Ban> {
    const id = generateId();
    const ban: Ban = {
      id,
      userId,
      adminId,
      reason,
      createdAt: new Date(),
      expiresAt: null,
    };
    this.bans.set(id, ban);

    const user = this.users.get(userId);
    if (user) {
      user.isBanned = true;
      this.users.set(userId, user);
    }

    return ban;
  }

  async unbanUser(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.isBanned = false;
      this.users.set(userId, user);
    }
  }

  // Read receipts
  async updateReadReceipt(chatId: string, userId: string, messageId: string): Promise<void> {
    const key = `${chatId}:${userId}`;
    this.readReceipts.set(key, {
      chatId,
      userId,
      lastReadMessageId: messageId,
      readAt: new Date(),
    });
  }
}

export const db = new Database();
