/**
 * ---
 * @customize  Public hrefs. Play is always /go. Dashboard / results / hub
 *             stamp hostname UTMs at build time when SITE_HOSTNAME is set.
 * ---
 */

import {
  CLONEABLE_PREVIEW,
  CLONEABLE_REPO,
  DOCS_ORIGIN,
  FACTORY_REPO,
  NETWORK_HUB_ORIGIN,
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

export const LINKS = {
  play: PLAY_HREF,
  playOrigin: playOriginUrl(),
  dashboard: dashboardUrl(),
  docs: DOCS_ORIGIN,
  protocolDocs: PROTOCOL_DOCS_ORIGIN,
  results: resultsUrl(),
  hub: hubUrl(),
  cloneable: CLONEABLE_REPO,
  cloneablePreview: CLONEABLE_PREVIEW,
  factoryRepo: FACTORY_REPO,
} as const;
