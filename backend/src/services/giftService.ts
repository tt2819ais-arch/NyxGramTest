import { db } from '../database/db';
import { Gift, GiftInstance } from '../utils/types';
import { formatGift } from '../models/Gift';
import { validateGift } from '../utils/validators';

export class GiftService {
  async getAllGifts(): Promise<any[]> {
    const gifts = await db.getAllGifts();
    return gifts.map(formatGift);
  }

  async getGiftById(id: string): Promise<any | null> {
    const gift = await db.findGiftById(id);
    return gift ? formatGift(gift) : null;
  }

  async purchaseGift(userId: string, giftId: string): Promise<GiftInstance> {
    const user = await db.findUserById(userId);
    if (!user) throw new Error('User not found');

    const gift = await db.findGiftById(giftId);
    if (!gift) throw new Error('Gift not found');
    if (!gift.isActive) throw new Error('Gift is no longer available');

    if (user.balance < gift.price) {
      throw new Error('Insufficient balance');
    }

    await db.updateUser(userId, { balance: user.balance - gift.price });

    const instance = await db.createGiftInstance({
      giftId: gift.id,
      ownerId: userId,
      senderId: null,
    });

    await db.createTransaction({
      userId,
      type: 'purchase',
      amount: -gift.price,
      giftId: gift.id,
      description: `Purchased ${gift.name}`,
    });

    return instance;
  }

  async sendGift(senderId: string, receiverId: string, giftId: string): Promise<GiftInstance> {
    const sender = await db.findUserById(senderId);
    if (!sender) throw new Error('Sender not found');

    const receiver = await db.findUserById(receiverId);
    if (!receiver) throw new Error('Receiver not found');

    const gift = await db.findGiftById(giftId);
    if (!gift) throw new Error('Gift not found');

    if (sender.balance < gift.price) {
      throw new Error('Insufficient balance');
    }

    await db.updateUser(senderId, { balance: sender.balance - gift.price });

    const instance = await db.createGiftInstance({
      giftId: gift.id,
      ownerId: receiverId,
      senderId: senderId,
    });

    await db.createTransaction({
      userId: senderId,
      type: 'gift_sent',
      amount: -gift.price,
      giftId: gift.id,
      targetUserId: receiverId,
      description: `Sent ${gift.name} to @${receiver.username}`,
    });

    await db.createTransaction({
      userId: receiverId,
      type: 'gift_received',
      amount: 0,
      giftId: gift.id,
      targetUserId: senderId,
      description: `Received ${gift.name} from @${sender.username}`,
    });

    return instance;
  }

  async getUserGifts(userId: string): Promise<GiftInstance[]> {
    return db.getUserGifts(userId);
  }

  async getUserTransactions(userId: string) {
    return db.getUserTransactions(userId);
  }

  // Admin methods
  async createGift(data: Partial<Gift>): Promise<any> {
    const validation = validateGift(data as any);
    if (!validation.valid) throw new Error(validation.error!);

    const gift = await db.createGift(data);
    return formatGift(gift);
  }

  async updateGift(id: string, data: Partial<Gift>): Promise<any> {
    const gift = await db.updateGift(id, data);
    return gift ? formatGift(gift) : null;
  }

  async deleteGift(id: string): Promise<void> {
    await db.deleteGift(id);
  }
}

export const giftService = new GiftService();
