/**
 * ---
 * @customize  Official public origins only. No attribution values.
 * ---
 */

export const PUBLIC_MEGAPOT_ORIGIN = 'https://megapot.io';
export const NETWORK_HUB_ORIGIN = 'https://megapot.network';
export const RESULTS_ORIGIN = 'https://megapotresults.com';
export const DOCS_ORIGIN = 'https://llms.megapot.io';
export const PROTOCOL_DOCS_ORIGIN = 'https://docs.megapot.io';

export const CLONEABLE_REPO = 'https://github.com/BuiltByGoat/network-site-template';
export const CLONEABLE_GENERATE = `${CLONEABLE_REPO}/generate`;
export const CLONEABLE_PREVIEW = 'https://network-site-template.pages.dev';
export const FACTORY_REPO = 'https://github.com/BuiltByGoat/megapot-build-template';

/** Hosted Megapot share-link path. Destination is `/r/{CODE}` — not a public query param. */
export const PLAY_REFERRAL_PATH = '/r';

export const CLOUDFLARE_DEPLOY_ORIGIN = 'https://deploy.workers.cloudflare.com';
export const VERCEL_CLONE_ORIGIN = 'https://vercel.com/new/clone';

export const PROTOCOL_DOC_PATHS = {
  startHere: '/build-on-megapot/start-here',
  shareAndEarn: '/build-on-megapot/share-and-earn',
  addToYourSite: '/build-on-megapot/add-to-your-site',
  referrals: '/build-on-megapot/build/referrals-and-attribution',
  howToRefer: '/getting-started/how-to-refer',
} as const;
