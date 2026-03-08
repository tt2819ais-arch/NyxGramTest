import { db } from '../database/db';
import { Message, MessageType, MessageStatus } from '../utils/types';
import { validateMessage } from '../utils/validators';
import { toPublicUser } from '../models/User';

export class MessageService {
  async sendMessage(data: {
    chatId: string;
    senderId: string;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
    mediaThumbnail?: string;
    mediaDuration?: number;
    mediaSize?: number;
    fileName?: string;
    replyToId?: string;
  }): Promise<any> {
    if (data.type === 'text') {
      const validation = validateMessage(data.content || '');
      if (!validation.valid) {
        throw new Error(validation.error!);
      }
    }

    const message = await db.createMessage({
      chatId: data.chatId,
      senderId: data.senderId,
      type: data.type,
      content: data.content || '',
      mediaUrl: data.mediaUrl || null,
      mediaThumbnail: data.mediaThumbnail || null,
      mediaDuration: data.mediaDuration || null,
      mediaSize: data.mediaSize || null,
      fileName: data.fileName || null,
      replyToId: data.replyToId || null,
    });

    const sender = await db.findUserById(data.senderId);

    return {
      ...message,
      sender: sender ? toPublicUser(sender) : null,
    };
  }

  async getMessages(chatId: string, limit: number = 50, before?: string): Promise<any[]> {
    const messages = await db.getMessages(chatId, limit, before);
    const enriched = [];
    for (const msg of messages) {
      const sender = await db.findUserById(msg.senderId);
      enriched.push({
        ...msg,
        sender: sender ? toPublicUser(sender) : null,
      });
    }
    return enriched;
  }

  async updateMessageStatus(messageId: string, status: MessageStatus): Promise<void> {
    await db.updateMessageStatus(messageId, status);
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    await db.addReaction(messageId, userId, emoji);
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    await db.deleteMessage(messageId);
  }

  async markAsRead(chatId: string, userId: string, messageId: string): Promise<void> {
    await db.updateReadReceipt(chatId, userId, messageId);
  }
}

export const messageService = new MessageService();
