import { Ban } from '../utils/types';

export function isBanActive(ban: Ban): boolean {
  if (!ban.expiresAt) return true;
  return new Date() < ban.expiresAt;
}
