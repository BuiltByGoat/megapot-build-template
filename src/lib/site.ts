/**
 * ---
 * @customize  Public-safe site labels only. No attribution values live here.
 * ---
 */

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'megapot.build';

export const LINKS = {
  play: 'https://megapot.io',
  dashboard: 'https://megapot.io/dashboard',
  docs: 'https://llms.megapot.io',
  protocolDocs: 'https://docs.megapot.io',
  results: 'https://megapot.io/results',
  templatesLibrary: 'https://github.com/BuiltByGoat/megapot-templates',
  factoryRepo: 'https://github.com/BuiltByGoat/megapot-build-template',
  go: '/go',
} as const;
