import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lectureHits } from './public-copy.ts';
import { FACTORY_DESCRIPTION } from './seo.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const publicSurfaces = [
  'src/components/FactoryLanding.tsx',
  'src/components/MarketingLaunch.tsx',
  'src/components/SiteFooter.tsx',
  'src/components/SiteHeader.tsx',
  'src/components/FactoryJsonLd.tsx',
  'app/page.tsx',
  'app/layout.tsx',
  'app/disclaimer/page.tsx',
  'src/lib/seo.ts',
];

describe('public factory copy', () => {
  it('does not lecture visitors about codes, wallets, or privacy scrubbing', () => {
    for (const rel of publicSurfaces) {
      const hits = lectureHits(readFileSync(join(root, rel), 'utf8'));
      assert.deepEqual(hits, [], `${rel} still lectures: ${hits.join(', ')}`);
    }
    assert.equal(FACTORY_DESCRIPTION.includes('attribution stays private'), false);
  });
});
