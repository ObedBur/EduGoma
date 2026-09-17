import {
  validateSecret,
  validateUrl,
  isKnownDefault,
  isWeakSecret,
  KNOWN_DEFAULTS,
  isProduction,
  validateRateLimit,
  validateRateLimitTtl,
} from '../validation';

describe('KNOWN_DEFAULTS', () => {
  it('contains expected default values', () => {
    expect(KNOWN_DEFAULTS.has('change_me')).toBe(true);
    expect(KNOWN_DEFAULTS.has('change_me_2')).toBe(true);
    expect(KNOWN_DEFAULTS.has('change_me_cookie')).toBe(true);
    expect(KNOWN_DEFAULTS.has('your_strong_random_secret_here')).toBe(true);
    expect(KNOWN_DEFAULTS.has('your_different_strong_random_secret_here')).toBe(true);
    expect(KNOWN_DEFAULTS.has('your_cookie_secret_here')).toBe(true);
    expect(KNOWN_DEFAULTS.has('secret')).toBe(true);
    expect(KNOWN_DEFAULTS.has('changeme')).toBe(true);
    expect(KNOWN_DEFAULTS.has('default')).toBe(true);
    expect(KNOWN_DEFAULTS.has('test')).toBe(true);
    expect(KNOWN_DEFAULTS.has('development')).toBe(true);
  });
});

describe('isKnownDefault', () => {
  it('returns true for known default values', () => {
    expect(isKnownDefault('change_me')).toBe(true);
    expect(isKnownDefault('change_me_2')).toBe(true);
    expect(isKnownDefault('change_me_cookie')).toBe(true);
    expect(isKnownDefault('your_strong_random_secret_here')).toBe(true);
    expect(isKnownDefault('your_different_strong_random_secret_here')).toBe(true);
    expect(isKnownDefault('your_cookie_secret_here')).toBe(true);
    expect(isKnownDefault('secret')).toBe(true);
    expect(isKnownDefault('changeme')).toBe(true);
    expect(isKnownDefault('default')).toBe(true);
    expect(isKnownDefault('test')).toBe(true);
    expect(isKnownDefault('development')).toBe(true);
  });

  it('returns false for non-default values', () => {
    expect(isKnownDefault('my-super-secret-key-123!')).toBe(false);
    expect(isKnownDefault('another-strong-secret-456@')).toBe(false);
    expect(isKnownDefault('')).toBe(false);
  });

  it('is case insensitive', () => {
    expect(isKnownDefault('CHANGE_ME')).toBe(true);
    expect(isKnownDefault('Change_Me')).toBe(true);
    expect(isKnownDefault('Secret')).toBe(true);
  });
});

describe('isWeakSecret', () => {
  it('returns true for secrets shorter than 32 chars', () => {
    expect(isWeakSecret('short')).toBe(true);
    expect(isWeakSecret('a'.repeat(31))).toBe(true);
  });

  it('returns true for secrets missing uppercase', () => {
    expect(isWeakSecret('lowercase-only-123!-long-enough')).toBe(true);
  });

  it('returns true for secrets missing lowercase', () => {
    expect(isWeakSecret('UPPERCASE-ONLY-123!-LONG-ENOUGH')).toBe(true);
  });

  it('returns true for secrets missing numbers', () => {
    expect(isWeakSecret('NoNumbersHere!ButLongEnough')).toBe(true);
  });

  it('returns true for secrets missing special chars', () => {
    expect(isWeakSecret('NoSpecialChars123ButLongEnough')).toBe(true);
  });

  it('returns false for strong secrets', () => {
    expect(isWeakSecret('StrongSecret123!WithAllRequirementsMet')).toBe(false);
    expect(isWeakSecret('Another-Good-Secret_456@LongEnough')).toBe(false);
    expect(isWeakSecret('a'.repeat(29) + 'A1!')).toBe(false);
  });
});

describe('validateSecret', () => {
  const isProduction = true;

  it('throws when secret is missing', () => {
    expect(() => validateSecret('TEST_SECRET', undefined, isProduction)).toThrow(
      'Configuration error: TEST_SECRET is required but not set',
    );
  });

  it('throws when secret is a known default in production', () => {
    expect(() => validateSecret('TEST_SECRET', 'change_me', isProduction)).toThrow(
      'Configuration error: TEST_SECRET uses a known default value',
    );
  });

  it('throws when secret is weak in production', () => {
    expect(() => validateSecret('TEST_SECRET', 'weak', isProduction)).toThrow(
      'Configuration error: TEST_SECRET is too weak for production',
    );
  });

  it('accepts valid secret in production', () => {
    const result = validateSecret('TEST_SECRET', 'StrongSecret123!WithAllRequirementsMet', isProduction);
    expect(result).toBe('StrongSecret123!WithAllRequirementsMet');
  });

  it('accepts known default in development', () => {
    const result = validateSecret('TEST_SECRET', 'change_me', false);
    expect(result).toBe('change_me');
  });

  it('accepts weak secret in development', () => {
    const result = validateSecret('TEST_SECRET', 'weak', false);
    expect(result).toBe('weak');
  });
});

describe('validateUrl', () => {
  it('throws when URL is missing', () => {
    expect(() => validateUrl('TEST_URL', undefined)).toThrow(
      'Configuration error: TEST_URL is required but not set',
    );
  });

  it('throws when URL is invalid', () => {
    expect(() => validateUrl('TEST_URL', 'not-a-url')).toThrow(
      'Configuration error: TEST_URL must be a valid URL',
    );
  });

  it('accepts valid URLs', () => {
    expect(validateUrl('TEST_URL', 'http://localhost:3000')).toBe('http://localhost:3000');
    expect(validateUrl('TEST_URL', 'https://example.com')).toBe('https://example.com');
    expect(validateUrl('TEST_URL', 'https://sub.domain.com:8080/path')).toBe('https://sub.domain.com:8080/path');
  });
});

describe('isProduction', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns true when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(isProduction()).toBe(true);
  });

  it('returns false when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    expect(isProduction()).toBe(false);
  });

  it('returns false when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    expect(isProduction()).toBe(false);
  });

  it('returns false when NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    expect(isProduction()).toBe(false);
  });
});

describe('validateRateLimit', () => {
  it('returns default value when not set', () => {
    expect(validateRateLimit('TEST_LIMIT', undefined, 10)).toBe(10);
  });

  it('returns parsed value when valid', () => {
    expect(validateRateLimit('TEST_LIMIT', '5', 10)).toBe(5);
    expect(validateRateLimit('TEST_LIMIT', '100', 10)).toBe(100);
  });

  it('throws when value is not a number', () => {
    expect(() => validateRateLimit('TEST_LIMIT', 'abc', 10)).toThrow(
      'Configuration error: TEST_LIMIT must be a positive integer',
    );
  });

  it('throws when value is zero', () => {
    expect(() => validateRateLimit('TEST_LIMIT', '0', 10)).toThrow(
      'Configuration error: TEST_LIMIT must be a positive integer',
    );
  });

  it('throws when value is negative', () => {
    expect(() => validateRateLimit('TEST_LIMIT', '-5', 10)).toThrow(
      'Configuration error: TEST_LIMIT must be a positive integer',
    );
  });
});

describe('validateRateLimitTtl', () => {
  it('returns default value when not set', () => {
    expect(validateRateLimitTtl('TEST_TTL', undefined, 60000)).toBe(60000);
  });

  it('returns parsed value when valid', () => {
    expect(validateRateLimitTtl('TEST_TTL', '30000', 60000)).toBe(30000);
    expect(validateRateLimitTtl('TEST_TTL', '3600000', 60000)).toBe(3600000);
  });

  it('throws when value is not a number', () => {
    expect(() => validateRateLimitTtl('TEST_TTL', 'abc', 60000)).toThrow(
      'Configuration error: TEST_TTL must be a positive integer (milliseconds)',
    );
  });

  it('throws when value is zero', () => {
    expect(() => validateRateLimitTtl('TEST_TTL', '0', 60000)).toThrow(
      'Configuration error: TEST_TTL must be a positive integer (milliseconds)',
    );
  });

  it('throws when value is negative', () => {
    expect(() => validateRateLimitTtl('TEST_TTL', '-1000', 60000)).toThrow(
      'Configuration error: TEST_TTL must be a positive integer (milliseconds)',
    );
  });
});