/**
 * ---
 * @customize  Public-safe site labels only. No attribution values live here.
 *             Factory title is Build on Megapot | {SITE_NAME}.
 *             Player clones use Play on Megapot | {SITE_NAME}.
 * ---
 */

const FALLBACK_SITE_NAME = 'megapot.build';

export function siteName(): string {
  const value = process.env.NEXT_PUBLIC_SITE_NAME?.trim();
  return value && value.length > 0 ? value : FALLBACK_SITE_NAME;
}

export function documentTitle(name: string = siteName()): string {
  return `Build on Megapot | ${name}`;
}

export const SITE_NAME = siteName();
