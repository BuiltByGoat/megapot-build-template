/**
 * ---
 * @customize  Server-only play redirect. Public pages link to `/go`.
 *             The host binds MEGAPOT_PLAY_DESTINATION privately.
 *             Never interpolate the destination into HTML, JSON, or logs
 *             that reach the browser. Hostname UTMs are appended here.
 * ---
 *
 * Resolves the URL a Cloudflare Pages Function should 302 to. Empty or
 * invalid values fall back to the public Megapot origin so a fresh
 * deploy never ships a broken CTA. UTMs are always applied.
 */

import { PUBLIC_MEGAPOT_ORIGIN } from './origin.ts';
import { resolveUtms, type UtmEnv, withUtms } from './utms.ts';

export type PlayRedirectEnv = UtmEnv & {
  MEGAPOT_PLAY_DESTINATION?: string | undefined;
};

function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function resolvePlayDestination(envValue: string | undefined): string {
  const trimmed = envValue?.trim();
  if (!trimmed || !isSafeHttpUrl(trimmed)) {
    return PUBLIC_MEGAPOT_ORIGIN;
  }
  return trimmed;
}

export function buildPlayRedirect(envValue: string | undefined, utmEnv: UtmEnv = {}): string {
  return withUtms(resolvePlayDestination(envValue), resolveUtms(utmEnv));
}

export function resolvePlayDestinationFromEnv(env: PlayRedirectEnv): string {
  return buildPlayRedirect(env.MEGAPOT_PLAY_DESTINATION, env);
}

export const PUBLIC_PLAY_FALLBACK = buildPlayRedirect(undefined, {});
