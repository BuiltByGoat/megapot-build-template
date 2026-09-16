import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PUBLIC_PLAY_FALLBACK, resolvePlayDestination } from './play-redirect.ts';

describe('resolvePlayDestination', () => {
  it('falls back when unset', () => {
    assert.equal(resolvePlayDestination({}), PUBLIC_PLAY_FALLBACK);
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

  it('accepts an https destination without exposing it to callers beyond the return', () => {
    const dest = resolvePlayDestination({
      MEGAPOT_PLAY_DESTINATION: 'https://megapot.io/join',
    });
    assert.equal(dest, 'https://megapot.io/join');
  });
});
