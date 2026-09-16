/**
 * ---
 * @customize  Hostname UTMs for Analytics. Safe on public hrefs.
 *             Never a referral code or wallet.
 * ---
 *
 * Factory outbound links and every `/go` Location resolve campaign
 * params from private env. `utm_source` is the deploy hostname
 * (`SITE_HOSTNAME`), not a repo name.
 */

export const DEFAULT_UTMS = {
  utm_source: 'megapot.build',
  utm_medium: 'builder',
  utm_campaign: 'build-factory-v1',
} as const;

export type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

export type UtmEnv = {
  SITE_HOSTNAME?: string;
  MEGAPOT_SITE_HOSTNAME?: string;
  MEGAPOT_UTM_SOURCE?: string;
  MEGAPOT_UTM_MEDIUM?: string;
  MEGAPOT_UTM_CAMPAIGN?: string;
  CF_PAGES_URL?: string;
};

type EnvBag = UtmEnv | NodeJS.ProcessEnv;

const TOKEN = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const REJECTED_SOURCES = new Set([
  'network-site-template',
  'megapot-build-template',
  'megapot-templates',
]);

function readToken(value: string | undefined): string | undefined {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed || !TOKEN.test(trimmed)) {
    return undefined;
  }
  if (REJECTED_SOURCES.has(trimmed) || trimmed.startsWith('0x') || trimmed.includes('invite')) {
    return undefined;
  }
  return trimmed;
}

export function hostnameToUtmSource(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const url = trimmed.includes('://') ? new URL(trimmed) : new URL(`https://${trimmed}`);
    let host = url.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return readToken(host);
  } catch {
    return readToken(trimmed);
  }
}

export function resolveUtms(env: EnvBag = process.env): UtmParams {
  const source =
    hostnameToUtmSource(env.SITE_HOSTNAME) ??
    hostnameToUtmSource(env.MEGAPOT_SITE_HOSTNAME) ??
    readToken(env.MEGAPOT_UTM_SOURCE) ??
    hostnameToUtmSource(env.CF_PAGES_URL) ??
    DEFAULT_UTMS.utm_source;

  return {
    utm_source: source,
    utm_medium: readToken(env.MEGAPOT_UTM_MEDIUM) ?? DEFAULT_UTMS.utm_medium,
    utm_campaign: readToken(env.MEGAPOT_UTM_CAMPAIGN) ?? DEFAULT_UTMS.utm_campaign,
  };
}

export function withUtms(url: string, utms: UtmParams = resolveUtms()): string {
  const parsed = new URL(url);

  for (const [key, value] of Object.entries(utms)) {
    if (value && !parsed.searchParams.has(key)) {
      parsed.searchParams.set(key, value);
    }
  }

  return parsed.toString();
}

export function locationHasCampaignUtms(location: string): boolean {
  try {
    const parsed = new URL(location);
    const source = parsed.searchParams.get('utm_source');
    const medium = parsed.searchParams.get('utm_medium');
    const campaign = parsed.searchParams.get('utm_campaign');
    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      Boolean(readToken(source ?? undefined)) &&
      Boolean(readToken(medium ?? undefined)) &&
      Boolean(readToken(campaign ?? undefined)) &&
      !REJECTED_SOURCES.has(source ?? '') &&
      !parsed.searchParams.has('ref') &&
      !parsed.searchParams.has('referral')
    );
  } catch {
    return false;
  }
}
