import { v4 as uuidv4 } from 'uuid';
import { PaginationParams } from './types';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';

export function generateId(): string {
  return uuidv4();
}

export function parsePagination(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(query.limit as string) || DEFAULT_PAGE_SIZE)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getChatRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join(':');
}
