import { ENV } from './env';

export interface RedisConfig {
  host: string;
  port: number;
  retryDelayMs: number;
  maxRetries: number;
}

export const redisConfig: RedisConfig = {
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
  retryDelayMs: 1000,
  maxRetries: 5,
};
