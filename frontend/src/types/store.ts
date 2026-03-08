import type { AuthUser, TokenPair } from './auth';
import type { Chat, ChatDraft, ChatFilter, ChatListItem } from './chat';
import type { Gift, GiftInventoryItem, GiftTransaction, GiftFilter } from './gift';
import type { Message, MessagesPagination, UploadProgress } from './message';
import type { VoicePlaybackState, VoiceRecordingState, VideoRecordingState, MediaPreview, DragDropState } from './media';
import type { UserMinimal, UserPresence, UserTypingState, UserProfile } from './user';
import type { WSConnectionState } from './websocket';
import type { ToastNotification, ModalState, ContextMenuState, LoadingState, ThemeConfig } from './common';
import type { EconomyBalance, Transaction } from './economy';

// --- Auth Store ---
export interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  checkUsername: (username: string) => Promise<{ isAvailable: boolean; suggestions: string[] }>;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
  hydrateFromStorage: () => void;
}

// --- Chat Store ---
export interface ChatStore {
  chats: Map<string, ChatListItem>;
  chatsList: ChatListItem[];
  activeChatId: string | null;
  activeChat: ChatListItem | null;
  chatDetails: Map<string, Chat>;
  drafts: Map<string, ChatDraft>;
  filter: ChatFilter;
  isLoading: boolean;
  error: string | null;

  setChats: (chats: ChatListItem[]) => void;
  addChat: (chat: ChatListItem) => void;
  updateChat: (chatId: string, updates: Partial<ChatListItem>) => void;
  removeChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  setChatDetails: (chatId: string, details: Chat) => void;
  setDraft: (chatId: string, content: string, replyToId?: string | null) => void;
  clearDraft: (chatId: string) => void;
  setFilter: (filter: ChatFilter) => void;
  incrementUnread: (chatId: string) => void;
  resetUnread: (chatId: string) => void;
  updateLastMessage: (chatId: string, message: Message) => void;
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
  fetchChats: () => Promise<void>;
  createChat: (participantId: string) => Promise<string>;
}

// --- Message Store ---
export interface MessageStore {
  messages: Map<string, Message[]>;
  messageMap: Map<string, Message>;
  loadingChats: Set<string>;
  hasMore: Map<string, boolean>;
  cursors: Map<string, string | null>;
  uploads: Map<string, UploadProgress>;
  replyTo: Message | null;
  editingMessage: Message | null;

  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  prependMessages: (chatId: string, messages: Message[]) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string, chatId: string) => void;
  replaceOptimisticMessage: (localId: string, message: Message) => void;
  setHasMore: (chatId: string, hasMore: boolean) => void;
  setCursor: (chatId: string, cursor: string | null) => void;
  setLoading: (chatId: string, isLoading: boolean) => void;
  setUploadProgress: (localId: string, progress: UploadProgress) => void;
  removeUpload: (localId: string) => void;
  setReplyTo: (message: Message | null) => void;
  setEditingMessage: (message: Message | null) => void;
  fetchMessages: (chatId: string, cursor?: string | null) => Promise<void>;
  sendMessage: (chatId: string, content: string, type?: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string, deleteForAll: boolean) => Promise<void>;
  markAsRead: (chatId: string, messageId: string) => void;
  clearChat: (chatId: string) => void;
}

// --- User Store ---
export interface UserStore {
  users: Map<string, UserMinimal>;
  profiles: Map<string, UserProfile>;
  presences: Map<string, UserPresence>;
  typingStates: Map<string, UserTypingState[]>;
  searchResults: UserMinimal[];
  isSearching: boolean;

  setUser: (user: UserMinimal) => void;
  setUsers: (users: UserMinimal[]) => void;
  updateUser: (userId: string, updates: Partial<UserMinimal>) => void;
  setProfile: (userId: string, profile: UserProfile) => void;
  setPresence: (userId: string, presence: UserPresence) => void;
  setTyping: (chatId: string, typing: UserTypingState) => void;
  removeTyping: (chatId: string, userId: string) => void;
  clearTyping: (chatId: string) => void;
  setSearchResults: (results: UserMinimal[]) => void;
  clearSearchResults: () => void;
  fetchProfile: (userId: string) => Promise<UserProfile>;
  searchUsers: (query: string) => Promise<void>;
  updateProfile: (updates: { displayName?: string; bio?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

// --- Gift Store ---
export interface GiftStore {
  gifts: Gift[];
  giftMap: Map<string, Gift>;
  inventory: GiftInventoryItem[];
  showcase: GiftInventoryItem[];
  transactions: GiftTransaction[];
  filter: GiftFilter;
  isLoading: boolean;
  error: string | null;

  setGifts: (gifts: Gift[]) => void;
  addGift: (gift: Gift) => void;
  updateGift: (giftId: string, updates: Partial<Gift>) => void;
  removeGift: (giftId: string) => void;
  setInventory: (items: GiftInventoryItem[]) => void;
  addToInventory: (item: GiftInventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  setShowcase: (items: GiftInventoryItem[]) => void;
  setTransactions: (transactions: GiftTransaction[]) => void;
  setFilter: (filter: Partial<GiftFilter>) => void;
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
  fetchGifts: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  buyGift: (giftId: string) => Promise<void>;
  sendGift: (inventoryId: string, recipientId: string, message?: string) => Promise<void>;
  updateShowcase: (inventoryIds: string[]) => Promise<void>;
}

// --- Economy Store ---
export interface EconomyStore {
  balance: EconomyBalance | null;
  transactions: Transaction[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;

  setBalance: (balance: EconomyBalance) => void;
  updateBalance: (amount: number) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  fetchBalance: () => Promise<void>;
  fetchTransactions: (page?: number) => Promise<void>;
}

// --- WebSocket Store ---
export interface WebSocketStore {
  connectionState: WSConnectionState;
  reconnectAttempts: number;
  lastPing: number | null;
  latency: number | null;

  setConnectionState: (state: WSConnectionState) => void;
  setReconnectAttempts: (attempts: number) => void;
  setLatency: (latency: number) => void;
  connect: () => void;
  disconnect: () => void;
  send: (type: string, payload: unknown) => void;
}

// --- UI Store ---
export interface UIStore {
  theme: ThemeConfig;
  isMobile: boolean;
  isSidebarOpen: boolean;
  isProfileOpen: boolean;
  modal: ModalState;
  contextMenu: ContextMenuState;
  toasts: ToastNotification[];
  voiceRecording: VoiceRecordingState;
  voicePlayback: VoicePlaybackState | null;
  videoRecording: VideoRecordingState;
  mediaPreviews: MediaPreview[];
  dragDrop: DragDropState;
  searchQuery: string;
  isSearchOpen: boolean;

  setTheme: (theme: Partial<ThemeConfig>) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleProfile: () => void;
  setProfileOpen: (isOpen: boolean) => void;
  openModal: (type: ModalState['type'], data?: Record<string, unknown>) => void;
  closeModal: () => void;
  openContextMenu: (x: number, y: number, type: ContextMenuState['type'], data?: Record<string, unknown>) => void;
  closeContextMenu: () => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'createdAt'>) => void;
  removeToast: (id: string) => void;
  setVoiceRecording: (state: Partial<VoiceRecordingState>) => void;
  resetVoiceRecording: () => void;
  setVoicePlayback: (state: VoicePlaybackState | null) => void;
  setVideoRecording: (state: Partial<VideoRecordingState>) => void;
  resetVideoRecording: () => void;
  addMediaPreview: (preview: MediaPreview) => void;
  removeMediaPreview: (id: string) => void;
  clearMediaPreviews: () => void;
  setDragDrop: (state: Partial<DragDropState>) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (isOpen: boolean) => void;
}
