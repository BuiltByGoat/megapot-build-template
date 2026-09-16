/**
 * ---
 * @customize  Hostname UTMs for Analytics. Safe to put on public hrefs.
 *             Never a referral code or wallet.
 * ---
 *
 * Every Play / dashboard outbound and every `/go` Location must carry
 * these three params. Bare megapot.io links fail intent-ready tracking.
 */

export const FACTORY_UTM = {
  utm_source: 'megapot.build',
  utm_medium: 'builder',
  utm_campaign: 'build-factory-v1',
} as const;

export function withFactoryUtms(href: string): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', FACTORY_UTM.utm_source);
  url.searchParams.set('utm_medium', FACTORY_UTM.utm_medium);
  url.searchParams.set('utm_campaign', FACTORY_UTM.utm_campaign);
  return url.toString();
}
