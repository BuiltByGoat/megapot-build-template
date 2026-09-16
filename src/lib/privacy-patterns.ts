/**
 * Patterns that must never appear in public markup or marketing copy.
 * Used by scripts/check-privacy.mjs (duplicated as regex literals there
 * so the scanner stays dependency-free).
 */
export const PRIVACY_FORBIDDEN = {
  evmAddress: /0x[a-fA-F0-9]{40}/,
  invitePath: /megapot\.io\/invite/i,
  inviteToken: /\{\{\s*INVITE_URL\s*\}\}/,
  viteReferrer: /VITE_REFERRER_ADDRESS\s*=\s*0x/i,
} as const;
