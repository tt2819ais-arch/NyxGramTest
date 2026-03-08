import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_REGEX, BIO_MAX_LENGTH, MESSAGE_MAX_LENGTH } from './constants';

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  const clean = username.startsWith('@') ? username.slice(1) : username;

  if (clean.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Username must be at least ${USERNAME_MIN_LENGTH} characters` };
  }

  if (clean.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Username must be at most ${USERNAME_MAX_LENGTH} characters` };
  }

  if (!USERNAME_REGEX.test(clean)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  return { valid: true };
}

export function validateBio(bio: string): { valid: boolean; error?: string } {
  if (bio.length > BIO_MAX_LENGTH) {
    return { valid: false, error: `Bio must be at most ${BIO_MAX_LENGTH} characters` };
  }
  return { valid: true };
}

export function validateMessage(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (content.length > MESSAGE_MAX_LENGTH) {
    return { valid: false, error: `Message must be at most ${MESSAGE_MAX_LENGTH} characters` };
  }

  return { valid: true };
}

export function validateGift(data: {
  name?: string;
  price?: number;
  rarity?: string;
  category?: string;
}): { valid: boolean; error?: string } {
  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, error: 'Gift name is required' };
  }

  if (data.price === undefined || data.price < 0) {
    return { valid: false, error: 'Valid price is required' };
  }

  const validRarities = ['common', 'rare', 'epic', 'legendary'];
  if (data.rarity && !validRarities.includes(data.rarity)) {
    return { valid: false, error: 'Invalid rarity' };
  }

  const validCategories = ['card', 'collectible', 'decoration'];
  if (data.category && !validCategories.includes(data.category)) {
    return { valid: false, error: 'Invalid category' };
  }

  return { valid: true };
}
