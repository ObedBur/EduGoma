export const KNOWN_DEFAULTS = new Set([
  'change_me',
  'change_me_2',
  'change_me_cookie',
  'your_strong_random_secret_here',
  'your_different_strong_random_secret_here',
  'your_cookie_secret_here',
  'secret',
  'changeme',
  'default',
  'test',
  'development',
]);

export function isKnownDefault(value: string): boolean {
  return KNOWN_DEFAULTS.has(value.toLowerCase());
}

export function isWeakSecret(value: string): boolean {
  if (value.length < 32) return true;
  if (!/[A-Z]/.test(value)) return true;
  if (!/[a-z]/.test(value)) return true;
  if (!/[0-9]/.test(value)) return true;
  if (!/[^A-Za-z0-9]/.test(value)) return true;
  return false;
}

export function validateSecret(name: string, value: string | undefined, isProduction: boolean): string {
  if (!value) {
    throw new Error(`Configuration error: ${name} is required but not set`);
  }
  if (isProduction && isKnownDefault(value)) {
    throw new Error(`Configuration error: ${name} uses a known default value`);
  }
  if (isProduction && isWeakSecret(value)) {
    throw new Error(
      `Configuration error: ${name} is too weak for production (min 32 chars, upper, lower, number, special)`,
    );
  }
  return value;
}

export function validateUrl(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Configuration error: ${name} is required but not set`);
  }
  try {
    new URL(value);
  } catch {
    throw new Error(`Configuration error: ${name} must be a valid URL`);
  }
  return value;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function validateRateLimit(name: string, value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`Configuration error: ${name} must be a positive integer`);
  }
  return parsed;
}

export function validateRateLimitTtl(name: string, value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`Configuration error: ${name} must be a positive integer (milliseconds)`);
  }
  return parsed;
}