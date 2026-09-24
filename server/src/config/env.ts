import { config } from 'dotenv';
import {
  isProduction,
  validateBrevoConfig,
  validateHttpsUrl,
  validateLockoutConfig,
  validateMonitorThreshold,
  validatePasswordHistoryLimit,
  validateRateLimit,
  validateRateLimitTtl,
  validateSecret,
  validateTokenExpiry,
  validateUrl,
} from './validation';
config();

const isProd = isProduction();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '4000',
  DATABASE_URL: validateUrl('DATABASE_URL', process.env.DATABASE_URL),
  JWT_ACCESS_SECRET: validateSecret('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET, isProd),
  JWT_REFRESH_SECRET: validateSecret('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET, isProd),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  COOKIE_SECRET: validateSecret('COOKIE_SECRET', process.env.COOKIE_SECRET, isProd),
  CLIENT_URL: validateHttpsUrl('CLIENT_URL', process.env.CLIENT_URL, isProd),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Auth rate limiting
  AUTH_LOGIN_LIMIT: validateRateLimit('AUTH_LOGIN_LIMIT', process.env.AUTH_LOGIN_LIMIT, 5),
  AUTH_LOGIN_TTL: validateRateLimitTtl('AUTH_LOGIN_TTL', process.env.AUTH_LOGIN_TTL, 60000),
  AUTH_REGISTER_LIMIT: validateRateLimit('AUTH_REGISTER_LIMIT', process.env.AUTH_REGISTER_LIMIT, 3),
  AUTH_REGISTER_TTL: validateRateLimitTtl(
    'AUTH_REGISTER_TTL',
    process.env.AUTH_REGISTER_TTL,
    3600000,
  ),
  AUTH_FORGOT_PASSWORD_LIMIT: validateRateLimit(
    'AUTH_FORGOT_PASSWORD_LIMIT',
    process.env.AUTH_FORGOT_PASSWORD_LIMIT,
    3,
  ),
  AUTH_FORGOT_PASSWORD_TTL: validateRateLimitTtl(
    'AUTH_FORGOT_PASSWORD_TTL',
    process.env.AUTH_FORGOT_PASSWORD_TTL,
    3600000,
  ),
  AUTH_RESET_PASSWORD_LIMIT: validateRateLimit(
    'AUTH_RESET_PASSWORD_LIMIT',
    process.env.AUTH_RESET_PASSWORD_LIMIT,
    5,
  ),
  AUTH_RESET_PASSWORD_TTL: validateRateLimitTtl(
    'AUTH_RESET_PASSWORD_TTL',
    process.env.AUTH_RESET_PASSWORD_TTL,
    60000,
  ),
  AUTH_CHANGE_PASSWORD_LIMIT: validateRateLimit(
    'AUTH_CHANGE_PASSWORD_LIMIT',
    process.env.AUTH_CHANGE_PASSWORD_LIMIT,
    10,
  ),
  AUTH_CHANGE_PASSWORD_TTL: validateRateLimitTtl(
    'AUTH_CHANGE_PASSWORD_TTL',
    process.env.AUTH_CHANGE_PASSWORD_TTL,
    60000,
  ),

  // Account lockout
  AUTH_LOCKOUT_THRESHOLD: validateLockoutConfig(
    'AUTH_LOCKOUT_THRESHOLD',
    process.env.AUTH_LOCKOUT_THRESHOLD,
    5,
  ),
  AUTH_LOCKOUT_DURATION: validateLockoutConfig(
    'AUTH_LOCKOUT_DURATION',
    process.env.AUTH_LOCKOUT_DURATION,
    900,
  ), // 15 minutes in seconds

  // Password reset token
  AUTH_RESET_TOKEN_EXPIRY: validateTokenExpiry(
    'AUTH_RESET_TOKEN_EXPIRY',
    process.env.AUTH_RESET_TOKEN_EXPIRY,
    3600,
  ), // 1 hour in seconds

  // Setup password link (validation école) — seconds (default 30 min)
  SETUP_LINK_TTL_SECONDS: validateTokenExpiry(
    'SETUP_LINK_TTL_SECONDS',
    process.env.SETUP_LINK_TTL_SECONDS,
    1800,
  ),

  // Monitoring/Alerting thresholds
  MONITOR_BRUTE_FORCE_FAILURES: validateMonitorThreshold(
    'MONITOR_BRUTE_FORCE_FAILURES',
    process.env.MONITOR_BRUTE_FORCE_FAILURES,
    20,
  ),
  MONITOR_BRUTE_FORCE_WINDOW: validateMonitorThreshold(
    'MONITOR_BRUTE_FORCE_WINDOW',
    process.env.MONITOR_BRUTE_FORCE_WINDOW,
    10,
  ),
  MONITOR_CREDENTIAL_STUFFING_FAILURES: validateMonitorThreshold(
    'MONITOR_CREDENTIAL_STUFFING_FAILURES',
    process.env.MONITOR_CREDENTIAL_STUFFING_FAILURES,
    30,
  ),
  MONITOR_CREDENTIAL_STUFFING_USERS: validateMonitorThreshold(
    'MONITOR_CREDENTIAL_STUFFING_USERS',
    process.env.MONITOR_CREDENTIAL_STUFFING_USERS,
    10,
  ),
  MONITOR_CREDENTIAL_STUFFING_WINDOW: validateMonitorThreshold(
    'MONITOR_CREDENTIAL_STUFFING_WINDOW',
    process.env.MONITOR_CREDENTIAL_STUFFING_WINDOW,
    10,
  ),
  MONITOR_ACCOUNT_TARGETED_FAILURES: validateMonitorThreshold(
    'MONITOR_ACCOUNT_TARGETED_FAILURES',
    process.env.MONITOR_ACCOUNT_TARGETED_FAILURES,
    10,
  ),
  MONITOR_ACCOUNT_TARGETED_WINDOW: validateMonitorThreshold(
    'MONITOR_ACCOUNT_TARGETED_WINDOW',
    process.env.MONITOR_ACCOUNT_TARGETED_WINDOW,
    15,
  ),
  MONITOR_ANOMALOUS_SUCCESS_FAILURES: validateMonitorThreshold(
    'MONITOR_ANOMALOUS_SUCCESS_FAILURES',
    process.env.MONITOR_ANOMALOUS_SUCCESS_FAILURES,
    5,
  ),
  MONITOR_ANOMALOUS_SUCCESS_WINDOW: validateMonitorThreshold(
    'MONITOR_ANOMALOUS_SUCCESS_WINDOW',
    process.env.MONITOR_ANOMALOUS_SUCCESS_WINDOW,
    30,
  ),

  // Alert channels
  ALERT_EMAIL_RECIPIENTS: process.env.ALERT_EMAIL_RECIPIENTS, // comma-separated
  ALERT_WEBHOOK_URL: process.env.ALERT_WEBHOOK_URL, // Slack/Discord/PagerDuty webhook

  // Brevo (email service)
  BREVO_API_KEY: validateBrevoConfig('BREVO_API_KEY', process.env.BREVO_API_KEY, isProd),
  BREVO_SENDER_EMAIL: validateBrevoConfig(
    'BREVO_SENDER_EMAIL',
    process.env.BREVO_SENDER_EMAIL,
    isProd,
  ),
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || 'EduGoma Security',

  // WhatsApp Meta Cloud API (optional — mock log if missing)
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION || 'v21.0',

  // Password history
  AUTH_PASSWORD_HISTORY_LIMIT: validatePasswordHistoryLimit(
    'AUTH_PASSWORD_HISTORY_LIMIT',
    process.env.AUTH_PASSWORD_HISTORY_LIMIT,
    5,
  ),
};

export { isProduction };
