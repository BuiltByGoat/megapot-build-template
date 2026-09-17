/**
 * ---
 * @customize  Public hrefs. Play is always /go. Dashboard / results / hub
 *             stamp hostname UTMs at build time when SITE_HOSTNAME is set.
 * ---
 */

import {
  CLONEABLE_GENERATE,
  CLONEABLE_PREVIEW,
  CLONEABLE_REPO,
  DOCS_ORIGIN,
  FACTORY_REPO,
  NETWORK_HUB_ORIGIN,
  PROTOCOL_DOC_PATHS,
  PROTOCOL_DOCS_ORIGIN,
  PUBLIC_MEGAPOT_ORIGIN,
  RESULTS_ORIGIN,
} from './origin.ts';
import { resolveUtms, withUtms } from './utms.ts';

export const PLAY_HREF = '/go';

export function publicMegapotUrl(path: string): string {
  return withUtms(new URL(path, PUBLIC_MEGAPOT_ORIGIN).toString(), resolveUtms());
}

export function dashboardUrl(): string {
  return publicMegapotUrl('/dashboard');
}

export function resultsUrl(): string {
  return withUtms(RESULTS_ORIGIN, resolveUtms());
}

export function hubUrl(): string {
  return withUtms(NETWORK_HUB_ORIGIN, resolveUtms());
}

export function playOriginUrl(): string {
  return publicMegapotUrl('/');
}

export function protocolDocUrl(path: string): string {
  return new URL(path, PROTOCOL_DOCS_ORIGIN).toString();
}

export const LINKS = {
  play: PLAY_HREF,
  playOrigin: playOriginUrl(),
  dashboard: dashboardUrl(),
  docs: DOCS_ORIGIN,
  protocolDocs: PROTOCOL_DOCS_ORIGIN,
  protocolStartHere: protocolDocUrl(PROTOCOL_DOC_PATHS.startHere),
  protocolShareAndEarn: protocolDocUrl(PROTOCOL_DOC_PATHS.shareAndEarn),
  protocolAddToYourSite: protocolDocUrl(PROTOCOL_DOC_PATHS.addToYourSite),
  protocolReferrals: protocolDocUrl(PROTOCOL_DOC_PATHS.referrals),
  protocolHowToRefer: protocolDocUrl(PROTOCOL_DOC_PATHS.howToRefer),
  results: resultsUrl(),
  hub: hubUrl(),
  cloneable: CLONEABLE_REPO,
  cloneableGenerate: CLONEABLE_GENERATE,
  cloneablePreview: CLONEABLE_PREVIEW,
  factoryRepo: FACTORY_REPO,
} as const;
