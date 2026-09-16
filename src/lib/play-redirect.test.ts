import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  PUBLIC_PLAY_FALLBACK,
  resolvePlayDestination,
  resolvePlayDestinationFromEnv,
} from './play-redirect.ts';
import { DEFAULT_UTMS } from './utms.ts';

function assertFactoryUtms(href: string, source: string = DEFAULT_UTMS.utm_source) {
  const url = new URL(href);
  assert.equal(url.searchParams.get('utm_source'), source);
  assert.equal(url.searchParams.get('utm_medium'), DEFAULT_UTMS.utm_medium);
  assert.equal(url.searchParams.get('utm_campaign'), DEFAULT_UTMS.utm_campaign);
}

describe('resolvePlayDestination', () => {
  it('falls back to the public origin when unset', () => {
    assert.equal(resolvePlayDestination(undefined), 'https://megapot.io');
    assert.equal(resolvePlayDestination('   '), 'https://megapot.io');
  });

  it('falls back when the value is not an absolute URL', () => {
    assert.equal(resolvePlayDestination('/invite/secret'), 'https://megapot.io');
    assert.equal(resolvePlayDestination('javascript:alert(1)'), 'https://megapot.io');
  });

  it('keeps a valid https destination without inventing UTMs here', () => {
    assert.equal(
      resolvePlayDestination('https://megapot.io/join?foo=bar'),
      'https://megapot.io/join?foo=bar',
    );
  });
});

describe('resolvePlayDestinationFromEnv', () => {
  it('falls back with factory UTMs when unset', () => {
    const dest = resolvePlayDestinationFromEnv({});
    assert.equal(dest, PUBLIC_PLAY_FALLBACK);
    assertFactoryUtms(dest);
    assert.equal(resolvePlayDestinationFromEnv({ MEGAPOT_PLAY_DESTINATION: '   ' }), dest);
  });

  it('appends hostname UTMs to an https destination and keeps other params', () => {
    const dest = resolvePlayDestinationFromEnv({
      MEGAPOT_PLAY_DESTINATION: 'https://megapot.io/join?foo=bar',
      SITE_HOSTNAME: 'https://www.factory-host.example',
    });
    const url = new URL(dest);
    assert.equal(url.origin + url.pathname, 'https://megapot.io/join');
    assert.equal(url.searchParams.get('foo'), 'bar');
    assertFactoryUtms(dest, 'factory-host.example');
  });

  it('does not overwrite existing destination UTMs', () => {
    const dest = resolvePlayDestinationFromEnv({
      MEGAPOT_PLAY_DESTINATION: 'https://megapot.io/?utm_source=already&utm_medium=x',
    });
    const url = new URL(dest);
    assert.equal(url.searchParams.get('utm_source'), 'already');
    assert.equal(url.searchParams.get('utm_medium'), 'x');
    assert.equal(url.searchParams.get('utm_campaign'), DEFAULT_UTMS.utm_campaign);
  });
});
