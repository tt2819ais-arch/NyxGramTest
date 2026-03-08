import type { Gift, GiftCategory, GiftRarity } from './gift';
import type { User, UserBanInfo } from './user';

export interface AdminDashboard {
  totalUsers: number;
  onlineUsers: number;
  totalMessages: number;
  totalChats: number;
  totalGifts: number;
  totalTransactions: number;
  bannedUsers: number;
  verifiedUsers: number;
  recentRegistrations: AdminUserListItem[];
  recentTransactions: AdminTransactionItem[];
}

export interface AdminUserListItem {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  banInfo: UserBanInfo | null;
  currencyBalance: number;
  messageCount: number;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
}

export interface AdminUserListFilters {
  search: string;
  status: 'all' | 'online' | 'offline' | 'banned' | 'verified';
  sortBy: 'username' | 'createdAt' | 'lastSeen' | 'currencyBalance';
  sortDirection: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface AdminBanUserPayload {
  userId: string;
  reason: string;
  duration: AdminBanDuration;
}

export type AdminBanDuration =
  | 'hours_1'
  | 'hours_24'
  | 'days_7'
  | 'days_30'
  | 'permanent';

export interface AdminUnbanUserPayload {
  userId: string;
}

export interface AdminVerifyUserPayload {
  userId: string;
  isVerified: boolean;
}

export interface AdminSetBalancePayload {
  userId: string;
  amount: number;
}

export interface AdminAdjustBalancePayload {
  userId: string;
  amount: number;
  reason: string;
}

export interface AdminGiftListFilters {
  search: string;
  category: GiftCategory | 'all';
  rarity: GiftRarity | 'all';
  availability: 'all' | 'available' | 'unavailable';
  sortBy: 'name' | 'price' | 'createdAt' | 'rarity';
  sortDirection: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface AdminTransactionItem {
  id: string;
  type: string;
  amount: number;
  fromUserId: string | null;
  fromUsername: string | null;
  toUserId: string;
  toUsername: string;
  giftId: string | null;
  giftName: string | null;
  description: string;
  createdAt: string;
}

export interface AdminTransactionFilters {
  search: string;
  type: 'all' | 'purchase' | 'send' | 'receive' | 'admin_grant' | 'admin_deduct';
  dateFrom: string | null;
  dateTo: string | null;
  page: number;
  limit: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: AdminAction;
  targetType: 'user' | 'gift' | 'chat' | 'system';
  targetId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export type AdminAction =
  | 'user_ban'
  | 'user_unban'
  | 'user_verify'
  | 'user_unverify'
  | 'user_set_balance'
  | 'user_adjust_balance'
  | 'gift_create'
  | 'gift_edit'
  | 'gift_delete'
  | 'gift_grant'
  | 'system_announcement';

export interface AdminRoute {
  path: string;
  label: string;
  icon: string;
  component: string;
}

export const ADMIN_ROUTES: AdminRoute[] = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard', component: 'AdminDashboard' },
  { path: '/admin/users', label: 'Users', icon: 'people', component: 'AdminUsers' },
  { path: '/admin/gifts', label: 'Gifts', icon: 'gift', component: 'AdminGifts' },
  { path: '/admin/economy', label: 'Economy', icon: 'currency', component: 'AdminEconomy' },
  { path: '/admin/logs', label: 'Logs', icon: 'log', component: 'AdminLogs' },
];
