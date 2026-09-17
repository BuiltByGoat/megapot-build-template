/**
 * ---
 * @customize  One-click host deeplinks. The referral is injected as
 *             private MEGAPOT_PLAY_DESTINATION — never as public HTML.
 * @skill      https://llms.megapot.io
 * ---
 */

import {
  CLONEABLE_GENERATE,
  CLONEABLE_REPO,
  CLOUDFLARE_DEPLOY_ORIGIN,
  VERCEL_CLONE_ORIGIN,
} from './origin.ts';
import { playDestinationForCode } from './referral.ts';
import { FACTORY_HOSTNAME } from './utms.ts';

export const REQUIRED_CLONE_ENV = ['MEGAPOT_PLAY_DESTINATION', 'SITE_HOSTNAME'] as const;

export const CLONE_ENV_DESCRIPTION =
  'MEGAPOT_PLAY_DESTINATION is the private Play URL (includes your referral). SITE_HOSTNAME is the hostname of the site you are launching — fill it on the host.';

export function cloudflareDeployUrl(): string {
  const url = new URL(CLOUDFLARE_DEPLOY_ORIGIN);
  url.searchParams.set('url', CLONEABLE_REPO);
  return url.toString();
}

export function vercelCloneUrl(playDestination?: string): string {
  const url = new URL(VERCEL_CLONE_ORIGIN);
  url.searchParams.set('repository-url', CLONEABLE_REPO);
  url.searchParams.set('env', REQUIRED_CLONE_ENV.join(','));
  url.searchParams.set('envDescription', CLONE_ENV_DESCRIPTION);
  url.searchParams.set('envLink', `https://${FACTORY_HOSTNAME}/#notes`);
  url.searchParams.set('project-name', 'megapot-site');
  url.searchParams.set('repository-name', 'megapot-site');
  if (playDestination) {
    url.searchParams.set('MEGAPOT_PLAY_DESTINATION', playDestination);
  }
  return url.toString();
}

export function templateOpenUrl(): string {
  return CLONEABLE_GENERATE;
}

export function marketingDeployHrefs(referralCode: string): {
  cloudflare: string;
  vercel: string;
  template: string;
  playDestination?: string;
} | null {
  const playDestination = playDestinationForCode(referralCode);
  if (!playDestination) {
    return null;
  }
  return {
    cloudflare: cloudflareDeployUrl(),
    vercel: vercelCloneUrl(playDestination),
    template: templateOpenUrl(),
    playDestination,
  };
}
