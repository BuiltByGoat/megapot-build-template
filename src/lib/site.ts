/**
 * ---
 * @customize  Public-safe site labels only. No attribution values live here.
 *             Play / dashboard / results hrefs carry factory UTMs, not codes.
 * ---
 */

import { withFactoryUtms } from './utm.ts';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'megapot.build';

export const LINKS = {
  play: withFactoryUtms('https://megapot.io'),
  dashboard: withFactoryUtms('https://megapot.io/dashboard'),
  docs: 'https://llms.megapot.io',
  protocolDocs: 'https://docs.megapot.io',
  results: withFactoryUtms('https://megapot.io/results'),
  templatesLibrary: 'https://github.com/BuiltByGoat/megapot-templates',
  factoryRepo: 'https://github.com/BuiltByGoat/megapot-build-template',
  go: '/go',
} as const;
