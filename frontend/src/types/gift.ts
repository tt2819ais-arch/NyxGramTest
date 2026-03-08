import type { GiftRarity } from './user';

export interface Gift {
  id: string;
  name: string;
  description: string;
  image: string;
  thumbnailImage: string;
  animationUrl: string | null;
  price: number;
  rarity: GiftRarity;
  category: GiftCategory;
  isAvailable: boolean;
  isLimited: boolean;
  totalSupply: number | null;
  remainingSupply: number | null;
  createdAt: string;
  updatedAt: string;
}

export type GiftCategory =
  | 'card'
  | 'collectible'
  | 'decoration'
  | 'trophy'
  | 'special';

export interface GiftInventoryItem {
  id: string;
  giftId: string;
  gift: Gift;
  ownerId: string;
  receivedFrom: string | null;
  receivedFromUsername: string | null;
  isShowcased: boolean;
  acquiredAt: string;
  acquiredMethod: GiftAcquireMethod;
}

export type GiftAcquireMethod = 'purchase' | 'received' | 'admin_grant' | 'event';

export interface GiftTransaction {
  id: string;
  type: GiftTransactionType;
  giftId: string;
  giftName: string;
  giftImage: string;
  giftRarity: GiftRarity;
  fromUserId: string | null;
  fromUsername: string | null;
  toUserId: string;
  toUsername: string;
  price: number;
  createdAt: string;
}

export type GiftTransactionType = 'purchase' | 'send' | 'receive';

export interface BuyGiftPayload {
  giftId: string;
}

export interface SendGiftPayload {
  giftInventoryId: string;
  recipientId: string;
  message?: string;
}

export interface GiftShowcaseUpdate {
  giftInventoryIds: string[];
}

export interface GiftFilter {
  category?: GiftCategory;
  rarity?: GiftRarity;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: GiftSortField;
  sortDirection?: 'asc' | 'desc';
}

export type GiftSortField = 'price' | 'name' | 'rarity' | 'createdAt';

export interface GiftAnimationConfig {
  giftId: string;
  giftImage: string;
  giftName: string;
  rarity: GiftRarity;
  fromUsername: string;
  toUsername: string;
}

export interface AdminCreateGiftPayload {
  name: string;
  description: string;
  image: File;
  animationUrl?: string;
  price: number;
  rarity: GiftRarity;
  category: GiftCategory;
  isLimited: boolean;
  totalSupply?: number;
}

export interface AdminEditGiftPayload {
  id: string;
  name?: string;
  description?: string;
  image?: File;
  price?: number;
  rarity?: GiftRarity;
  category?: GiftCategory;
  isAvailable?: boolean;
  isLimited?: boolean;
  totalSupply?: number;
}

export const GIFT_RARITY_ORDER: Record<GiftRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export const GIFT_RARITY_COLORS: Record<GiftRarity, string> = {
  common: '#9e9e9e',
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

export const MAX_SHOWCASE_ITEMS = 8;
