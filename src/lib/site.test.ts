import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { documentTitle, siteName } from './site.ts';

describe('documentTitle', () => {
  it('uses the factory hub pattern', () => {
    assert.equal(documentTitle('megapot.build'), 'Build on Megapot | megapot.build');
    assert.equal(siteName().length > 0, true);
  });
});
