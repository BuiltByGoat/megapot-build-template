import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LINKS } from './site.ts';
import { FACTORY_UTM, withFactoryUtms } from './utm.ts';

function assertFactoryUtms(href: string) {
  const url = new URL(href);
  assert.equal(url.searchParams.get('utm_source'), FACTORY_UTM.utm_source);
  assert.equal(url.searchParams.get('utm_medium'), FACTORY_UTM.utm_medium);
  assert.equal(url.searchParams.get('utm_campaign'), FACTORY_UTM.utm_campaign);
}

describe('withFactoryUtms', () => {
  it('stamps Play / dashboard / results LINKS', () => {
    assertFactoryUtms(LINKS.play);
    assertFactoryUtms(LINKS.dashboard);
    assertFactoryUtms(LINKS.results);
  });

  it('does not touch a non-megapot hostname path except to add UTMs', () => {
    const dest = withFactoryUtms('https://example.com/path');
    const url = new URL(dest);
    assert.equal(url.host, 'example.com');
    assert.equal(url.pathname, '/path');
    assertFactoryUtms(dest);
  });
});
