/**
 * Cloudflare Pages Function — GET /go
 *
 * Reads MEGAPOT_PLAY_DESTINATION from the Pages environment and 302s.
 * The destination never appears in public HTML. Factory UTMs are appended
 * on the Location. If unset or invalid, visitors land on the public
 * Megapot origin with the same UTMs.
 */

const FACTORY_UTM = {
  utm_source: 'megapot.build',
  utm_medium: 'builder',
  utm_campaign: 'build-factory-v1',
} as const;

function withFactoryUtms(href: string): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', FACTORY_UTM.utm_source);
  url.searchParams.set('utm_medium', FACTORY_UTM.utm_medium);
  url.searchParams.set('utm_campaign', FACTORY_UTM.utm_campaign);
  return url.toString();
}

const PUBLIC_PLAY_FALLBACK = withFactoryUtms('https://megapot.io');

function resolvePlayDestination(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return PUBLIC_PLAY_FALLBACK;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return PUBLIC_PLAY_FALLBACK;
    }
    return withFactoryUtms(parsed.toString());
  } catch {
    return PUBLIC_PLAY_FALLBACK;
  }
}

export const onRequestGet: PagesFunction<{ MEGAPOT_PLAY_DESTINATION?: string }> = async (
  context,
) => {
  const destination = resolvePlayDestination(context.env.MEGAPOT_PLAY_DESTINATION);
  return Response.redirect(destination, 302);
};
