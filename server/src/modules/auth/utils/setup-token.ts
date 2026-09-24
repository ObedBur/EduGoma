import * as crypto from 'crypto';

/** Token clair envoyé dans le lien (jamais stocké en clair). */
export function generateSetupTokenPlain(): string {
  return crypto.randomBytes(32).toString('hex');
}

/** Hash SHA-256 déterministe pour lookup en base. */
export function hashSetupToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function buildSetupUrl(clientUrl: string, token: string): string {
  return `${clientUrl.replace(/\/$/, '')}/set-password?token=${token}`;
}
