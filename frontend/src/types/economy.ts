export interface EconomyBalance {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastTransaction: string | null;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  relatedUserId: string | null;
  relatedUsername: string | null;
  relatedGiftId: string | null;
  relatedGiftName: string | null;
  createdAt: string;
}

export type TransactionType =
  | 'gift_purchase'
  | 'gift_send'
  | 'gift_receive'
  | 'admin_grant'
  | 'admin_deduct'
  | 'daily_bonus'
  | 'achievement_reward';

export interface TransactionFilter {
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionHistory {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
  page: number;
}

export interface EconomyStats {
  totalCurrencyInCirculation: number;
  totalTransactionsToday: number;
  totalGiftsPurchasedToday: number;
  averageBalance: number;
  topSpenders: EconomyLeaderboardEntry[];
  topEarners: EconomyLeaderboardEntry[];
}

export interface EconomyLeaderboardEntry {
  userId: string;
  username: string;
  avatar: string | null;
  isVerified: boolean;
  amount: number;
  rank: number;
}

export const DAILY_BONUS_AMOUNT = 100;
export const NEW_USER_BONUS = 500;
export const CURRENCY_NAME = 'NyxCoins';
export const CURRENCY_SYMBOL = 'NC';
