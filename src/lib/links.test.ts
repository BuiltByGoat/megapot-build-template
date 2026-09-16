import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dashboardUrl, hubUrl, PLAY_HREF, resultsUrl } from './links.ts';
import { NETWORK_HUB_ORIGIN, PUBLIC_MEGAPOT_ORIGIN, RESULTS_ORIGIN } from './origin.ts';
import { DEFAULT_UTMS, FACTORY_HOSTNAME, resolveUtms, withUtms } from './utms.ts';

describe('public outbound links', () => {
  it('keeps Play on the local /go hop', () => {
    assert.equal(PLAY_HREF, '/go');
  });

  it('requires SITE_HOSTNAME before stamping utm_source on dashboard/results/hub', () => {
    const env = { SITE_HOSTNAME: FACTORY_HOSTNAME };
    const dashboard = withUtms(
      new URL('/dashboard', PUBLIC_MEGAPOT_ORIGIN).toString(),
      resolveUtms(env),
    );
    const results = withUtms(RESULTS_ORIGIN, resolveUtms(env));
    const hub = withUtms(NETWORK_HUB_ORIGIN, resolveUtms(env));

    assert.equal(new URL(dashboard).origin, PUBLIC_MEGAPOT_ORIGIN);
    assert.equal(new URL(dashboard).pathname, '/dashboard');
    assert.equal(new URL(results).origin, RESULTS_ORIGIN);
    assert.equal(new URL(hub).origin, NETWORK_HUB_ORIGIN);
    for (const href of [dashboard, results, hub]) {
      const url = new URL(href);
      assert.equal(url.searchParams.get('utm_source'), FACTORY_HOSTNAME);
      assert.equal(url.searchParams.get('utm_medium'), DEFAULT_UTMS.utm_medium);
      assert.equal(url.searchParams.get('utm_campaign'), DEFAULT_UTMS.utm_campaign);
    }
  });

  it('builds live LINKS from process.env (factory build sets SITE_HOSTNAME)', () => {
    assert.equal(new URL(dashboardUrl()).origin, PUBLIC_MEGAPOT_ORIGIN);
    assert.equal(new URL(resultsUrl()).origin, RESULTS_ORIGIN);
    assert.equal(new URL(hubUrl()).origin, NETWORK_HUB_ORIGIN);
  });
});
