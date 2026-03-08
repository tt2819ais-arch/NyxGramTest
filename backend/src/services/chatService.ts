import { db } from '../database/db';
import { enrichChat } from '../models/Chat';
import { Chat } from '../utils/types';

export class ChatService {
  async getOrCreateDirectChat(userId1: string, userId2: string): Promise<any> {
    let chat = await db.findDirectChat(userId1, userId2);

    if (!chat) {
      chat = await db.createChat({
        type: 'direct',
        participants: [userId1, userId2],
      });
    }

    return enrichChat(chat, userId1);
  }

  async getUserChats(userId: string): Promise<any[]> {
    const chats = await db.getUserChats(userId);
    const enriched = [];
    for (const chat of chats) {
      enriched.push(await enrichChat(chat, userId));
    }
    return enriched;
  }

  async getChatById(chatId: string, userId: string): Promise<any | null> {
    const chat = await db.findChatById(chatId);
    if (!chat) return null;

    if (!chat.participants.includes(userId)) {
      throw new Error('Access denied');
    }

    return enrichChat(chat, userId);
  }

  async isChatParticipant(chatId: string, userId: string): Promise<boolean> {
    const chat = await db.findChatById(chatId);
    if (!chat) return false;
    return chat.participants.includes(userId);
  }
}

export const chatService = new ChatService();
