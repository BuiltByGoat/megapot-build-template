/**
 * ---
 * @customize  Client-side referral gate for marketing launch.
 *             Play destination follows the hosted megapot.io `/r/{CODE}`
 *             pattern. Never interpolate a real code into static HTML.
 * ---
 */

import { PLAY_REFERRAL_PATH, PUBLIC_MEGAPOT_ORIGIN } from './origin.ts';

/** Format hint only — not a live code. */
export const REFERRAL_CODE_HINT = 'ABCD1234';
export const REFERRAL_CODE_LENGTH = 8;
export const REFERRAL_CODE_PATTERN = /^[A-Z0-9]{8}$/;

export function normalizeReferralCode(value: string): string {
  return value.replaceAll(/\s+/g, '').toUpperCase();
}

export function isValidReferralCode(value: string): boolean {
  return REFERRAL_CODE_PATTERN.test(normalizeReferralCode(value));
}

/**
 * Absolute Megapot play URL for `MEGAPOT_PLAY_DESTINATION`.
 * Uses the documented `/r/{CODE}` share-link path. Returns undefined
 * until the code is valid so callers cannot leak a partial destination.
 */
export function playDestinationForCode(value: string): string | undefined {
  const code = normalizeReferralCode(value);
  if (!REFERRAL_CODE_PATTERN.test(code)) {
    return undefined;
  }
  return new URL(`${PLAY_REFERRAL_PATH}/${code}`, PUBLIC_MEGAPOT_ORIGIN).toString();
}

export function referralGateReason(value: string): string {
  const trimmed = value.replaceAll(/\s+/g, '');
  if (!trimmed) {
    return 'Enter your 8-character referral code to enable Launch.';
  }
  if (!isValidReferralCode(trimmed)) {
    return `Use exactly ${REFERRAL_CODE_LENGTH} letters or numbers. Format hint: ${REFERRAL_CODE_HINT}.`;
  }
  return 'Launch is ready. Cloudflare Pages is the recommended host.';
}
