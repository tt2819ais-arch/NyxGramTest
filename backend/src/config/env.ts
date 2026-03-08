import { config } from 'dotenv';

config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  WS_PORT: parseInt(process.env.WS_PORT || '3002', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'nyxgram_secret_key_2024_production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: process.env.DB_NAME || 'nyxgram',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || 'postgres',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: 50 * 1024 * 1024,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
