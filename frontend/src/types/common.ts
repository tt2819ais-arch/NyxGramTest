export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CursorPaginationParams {
  cursor: string | null;
  limit: number;
  direction?: 'forward' | 'backward';
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: Record<string, string | number | boolean>;
  pagination?: PaginationParams;
  sort?: SortParams;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  createdAt: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: Record<string, unknown> | null;
}

export type ModalType =
  | 'profile'
  | 'settings'
  | 'gift_shop'
  | 'gift_send'
  | 'gift_animation'
  | 'media_preview'
  | 'user_profile'
  | 'confirm_action'
  | 'voice_recorder'
  | 'video_recorder'
  | 'file_picker'
  | 'forward_message';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: ContextMenuType | null;
  data: Record<string, unknown> | null;
}

export type ContextMenuType =
  | 'message'
  | 'chat'
  | 'user'
  | 'media';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  isDanger?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  accentColor: string;
}

export interface AppConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  uploadMaxSize: number;
  theme: ThemeConfig;
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

export const BREAKPOINTS: BreakpointConfig = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};

export const DEFAULT_PAGE_SIZE = 30;
export const DEFAULT_MESSAGES_PAGE_SIZE = 50;
export const MAX_SEARCH_RESULTS = 100;
export const TOAST_DEFAULT_DURATION = 4000;
export const DEBOUNCE_DELAY = 300;
export const THROTTLE_DELAY = 100;
