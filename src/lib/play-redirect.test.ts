import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PUBLIC_PLAY_FALLBACK, resolvePlayDestination } from './play-redirect.ts';
import { FACTORY_UTM } from './utm.ts';

function assertFactoryUtms(href: string) {
  const url = new URL(href);
  assert.equal(url.searchParams.get('utm_source'), FACTORY_UTM.utm_source);
  assert.equal(url.searchParams.get('utm_medium'), FACTORY_UTM.utm_medium);
  assert.equal(url.searchParams.get('utm_campaign'), FACTORY_UTM.utm_campaign);
}

describe('resolvePlayDestination', () => {
  it('falls back with factory UTMs when unset', () => {
    const dest = resolvePlayDestination({});
    assert.equal(dest, PUBLIC_PLAY_FALLBACK);
    assertFactoryUtms(dest);
    assert.equal(resolvePlayDestination({ MEGAPOT_PLAY_DESTINATION: '   ' }), PUBLIC_PLAY_FALLBACK);
  });

  it('falls back when the value is not an absolute URL', () => {
    assert.equal(
      resolvePlayDestination({ MEGAPOT_PLAY_DESTINATION: '/invite/secret' }),
      PUBLIC_PLAY_FALLBACK,
    );
    assert.equal(
      resolvePlayDestination({ MEGAPOT_PLAY_DESTINATION: 'javascript:alert(1)' }),
      PUBLIC_PLAY_FALLBACK,
    );
  });

  it('appends factory UTMs to an https destination and keeps other params', () => {
    const dest = resolvePlayDestination({
      MEGAPOT_PLAY_DESTINATION: 'https://megapot.io/join?foo=bar',
    });
    const url = new URL(dest);
    assert.equal(url.origin + url.pathname, 'https://megapot.io/join');
    assert.equal(url.searchParams.get('foo'), 'bar');
    assertFactoryUtms(dest);
  });

  it('overwrites conflicting UTM values on the destination', () => {
    const dest = resolvePlayDestination({
      MEGAPOT_PLAY_DESTINATION: 'https://megapot.io/?utm_source=other&utm_medium=x',
    });
    assertFactoryUtms(dest);
  });
});
