/**
 * ---
 * @customize  Server-only play redirect. Public pages link to `/go`.
 *             The host binds MEGAPOT_PLAY_DESTINATION privately.
 *             Never interpolate the destination into HTML, JSON, or logs
 *             that reach the browser.
 * ---
 *
 * Resolves the URL a Cloudflare Pages Function (or local worker) should
 * 302 to. Empty or invalid values fall back to the public Megapot origin
 * so a fresh deploy never ships a broken CTA.
 */

export const PUBLIC_PLAY_FALLBACK = 'https://megapot.io';

export type PlayRedirectEnv = {
  MEGAPOT_PLAY_DESTINATION?: string | undefined;
};

export function resolvePlayDestination(env: PlayRedirectEnv): string {
  const raw = env.MEGAPOT_PLAY_DESTINATION?.trim();
  if (!raw) return PUBLIC_PLAY_FALLBACK;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return PUBLIC_PLAY_FALLBACK;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return PUBLIC_PLAY_FALLBACK;
  }

  return parsed.toString();
}
