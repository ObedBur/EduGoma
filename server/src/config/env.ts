import { config } from 'dotenv';
import {
  validateSecret,
  validateUrl,
  isProduction,
  validateRateLimit,
  validateRateLimitTtl,
} from './validation';
config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '4000',
  DATABASE_URL: validateUrl('DATABASE_URL', process.env.DATABASE_URL),
  JWT_ACCESS_SECRET: validateSecret('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET, isProduction()),
  JWT_REFRESH_SECRET: validateSecret('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET, isProduction()),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  COOKIE_SECRET: validateSecret('COOKIE_SECRET', process.env.COOKIE_SECRET, isProduction()),
  CLIENT_URL: validateUrl('CLIENT_URL', process.env.CLIENT_URL),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Auth rate limiting
  AUTH_LOGIN_LIMIT: validateRateLimit('AUTH_LOGIN_LIMIT', process.env.AUTH_LOGIN_LIMIT, 5),
  AUTH_LOGIN_TTL: validateRateLimitTtl('AUTH_LOGIN_TTL', process.env.AUTH_LOGIN_TTL, 60000),
  AUTH_REGISTER_LIMIT: validateRateLimit('AUTH_REGISTER_LIMIT', process.env.AUTH_REGISTER_LIMIT, 3),
  AUTH_REGISTER_TTL: validateRateLimitTtl('AUTH_REGISTER_TTL', process.env.AUTH_REGISTER_TTL, 3600000),
};

export { isProduction };