import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dashboardUrl, hubUrl, PLAY_HREF, resultsUrl } from './links.ts';
import { NETWORK_HUB_ORIGIN, PUBLIC_MEGAPOT_ORIGIN, RESULTS_ORIGIN } from './origin.ts';
import { DEFAULT_UTMS } from './utms.ts';

function assertFactoryUtms(href: string) {
  const url = new URL(href);
  assert.equal(url.searchParams.get('utm_source'), DEFAULT_UTMS.utm_source);
  assert.equal(url.searchParams.get('utm_medium'), DEFAULT_UTMS.utm_medium);
  assert.equal(url.searchParams.get('utm_campaign'), DEFAULT_UTMS.utm_campaign);
}

describe('public outbound links', () => {
  it('keeps Play on the local /go hop', () => {
    assert.equal(PLAY_HREF, '/go');
  });

  it('stamps factory UTMs on dashboard, results, and hub', () => {
    const dashboard = dashboardUrl();
    const results = resultsUrl();
    const hub = hubUrl();

    assert.equal(new URL(dashboard).origin, PUBLIC_MEGAPOT_ORIGIN);
    assert.equal(new URL(dashboard).pathname, '/dashboard');
    assert.equal(new URL(results).origin, RESULTS_ORIGIN);
    assert.equal(new URL(hub).origin, NETWORK_HUB_ORIGIN);
    assertFactoryUtms(dashboard);
    assertFactoryUtms(results);
    assertFactoryUtms(hub);
  });
});
