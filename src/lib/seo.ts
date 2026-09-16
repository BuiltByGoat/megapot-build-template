/**
 * ---
 * @customize  Factory SEO / IA. Canonical host is SITE_HOSTNAME
 *             (megapot.build) so crawlers and UTMs agree. That is not
 *             a claim that apex DNS is live — DomainManager owns attach.
 * ---
 */

import { NETWORK_HUB_ORIGIN, RESULTS_ORIGIN } from './origin.ts';
import { documentTitle, SITE_NAME } from './site.ts';
import { FACTORY_HOSTNAME } from './utms.ts';

export const FACTORY_CANONICAL_ORIGIN = `https://${FACTORY_HOSTNAME}`;

export const FACTORY_DESCRIPTION =
  'Developer factory for BuiltByGoat/network-site-template. You ship a player site; attribution stays private. Picker → configure → deploy. Bind SITE_HOSTNAME=megapot.build so HTML and /go Location both stamp utm_source=megapot.build.';

export const IA_STEPS = [
  { id: 'picker', label: 'Picker', href: '/#picker' },
  { id: 'configure', label: 'Configure', href: '/#configure' },
  { id: 'deploy', label: 'Deploy', href: '/#deploy' },
] as const;

export const ROBOTS_DISALLOW = ['/go', '/go/'] as const;

export const SITEMAP_PATHS = ['/', '/disclaimer/'] as const;

export const SEO_HUB_HOST = new URL(NETWORK_HUB_ORIGIN).hostname;
export const SEO_RESULTS_HOST = new URL(RESULTS_ORIGIN).hostname;

export function canonicalUrl(pathname: string = '/'): string {
  return new URL(pathname, FACTORY_CANONICAL_ORIGIN).toString();
}

export function factoryJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: documentTitle(SITE_NAME),
        url: FACTORY_CANONICAL_ORIGIN,
        description: FACTORY_DESCRIPTION,
      },
      {
        '@type': 'HowTo',
        name: 'Build a player-facing Megapot Network site',
        description: FACTORY_DESCRIPTION,
        step: IA_STEPS.map((step, position) => ({
          '@type': 'HowToStep',
          position: position + 1,
          name: step.label,
          url: canonicalUrl(`/#${step.id}`),
        })),
      },
    ],
  };
}
