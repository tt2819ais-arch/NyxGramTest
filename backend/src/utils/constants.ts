export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 11;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
export const BIO_MAX_LENGTH = 200;
export const DISPLAY_NAME_MAX_LENGTH = 50;
export const MESSAGE_MAX_LENGTH = 4000;
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;
export const TYPING_TIMEOUT_MS = 5000;
export const PRESENCE_INTERVAL_MS = 30000;
export const MAX_REACTIONS_PER_MESSAGE = 20;

export const DEFAULT_ADMIN = {
  username: 'MaksimXyila',
  password: '@MaksimXyila',
  displayName: 'MaksimXyila',
  bio: 'Nyxgram Administrator',
  isVerified: true,
  isAdmin: true,
  balance: 99999999,
};

export const DEFAULT_GIFTS: Array<{
  name: string;
  description: string;
  price: number;
  rarity: string;
  category: string;
  imageUrl: string;
}> = [
  {
    name: 'Bronze Star',
    description: 'A simple bronze star decoration',
    price: 50,
    rarity: 'common',
    category: 'decoration',
    imageUrl: '/gifts/bronze-star.svg',
  },
  {
    name: 'Silver Shield',
    description: 'A shiny silver shield card',
    price: 150,
    rarity: 'common',
    category: 'card',
    imageUrl: '/gifts/silver-shield.svg',
  },
  {
    name: 'Golden Crown',
    description: 'A majestic golden crown',
    price: 500,
    rarity: 'rare',
    category: 'collectible',
    imageUrl: '/gifts/golden-crown.svg',
  },
  {
    name: 'Diamond Heart',
    description: 'A sparkling diamond heart',
    price: 1000,
    rarity: 'rare',
    category: 'decoration',
    imageUrl: '/gifts/diamond-heart.svg',
  },
  {
    name: 'Phoenix Card',
    description: 'A legendary phoenix trading card',
    price: 2500,
    rarity: 'epic',
    category: 'card',
    imageUrl: '/gifts/phoenix-card.svg',
  },
  {
    name: 'Dragon Emblem',
    description: 'An epic dragon emblem collectible',
    price: 5000,
    rarity: 'epic',
    category: 'collectible',
    imageUrl: '/gifts/dragon-emblem.svg',
  },
  {
    name: 'Celestial Aura',
    description: 'The rarest celestial aura decoration',
    price: 10000,
    rarity: 'legendary',
    category: 'decoration',
    imageUrl: '/gifts/celestial-aura.svg',
  },
  {
    name: 'Void Crystal',
    description: 'A mysterious void crystal from deep space',
    price: 25000,
    rarity: 'legendary',
    category: 'collectible',
    imageUrl: '/gifts/void-crystal.svg',
  },
];

export const REACTIONS = ['like', 'dislike', 'fire', 'heart', 'laugh', 'sad', 'wow'];
