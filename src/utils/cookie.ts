import * as crypto from 'crypto';
import { COOKIE_SECRET } from 'src/env';



function createSignature(value: string): string {
  return crypto
    .createHmac('sha256', COOKIE_SECRET)
    .update(value)
    .digest('hex');
}

export function signUserId(userId: string): string {
  return `${userId}.${createSignature(userId.toString())}`;
}

export function verifySignedUserId(
  signedCookie?: string,
): string | null {
  if (!signedCookie) return null;

  const [id, signature] = signedCookie.split('.');

  if (!id || !signature) return null;

  const expected = createSignature(id);

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex'),
  );

  return isValid ? id : null;
}