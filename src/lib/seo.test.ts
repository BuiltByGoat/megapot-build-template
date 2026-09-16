import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NETWORK_HUB_ORIGIN, RESULTS_ORIGIN } from './origin.ts';
import {
  canonicalUrl,
  FACTORY_CANONICAL_ORIGIN,
  FACTORY_DESCRIPTION,
  factoryJsonLd,
  IA_STEPS,
  ROBOTS_DISALLOW,
  SEO_HUB_HOST,
  SEO_RESULTS_HOST,
  SITEMAP_PATHS,
} from './seo.ts';
import { documentTitle } from './site.ts';
import { FACTORY_HOSTNAME } from './utms.ts';

describe('factory SEO / IA', () => {
  it('keeps a builder title and picker → configure → deploy IA', () => {
    assert.equal(documentTitle(FACTORY_HOSTNAME), 'Build on Megapot | megapot.build');
    assert.equal(FACTORY_DESCRIPTION.includes('Picker → configure → deploy'), true);
    assert.deepEqual(
      IA_STEPS.map((step) => step.id),
      ['picker', 'configure', 'deploy'],
    );
  });

  it('uses megapot.build as the canonical host (not a live-DNS claim)', () => {
    assert.equal(FACTORY_CANONICAL_ORIGIN, 'https://megapot.build');
    assert.equal(canonicalUrl('/'), 'https://megapot.build/');
    assert.equal(canonicalUrl('/disclaimer/'), 'https://megapot.build/disclaimer/');
  });

  it('points hub and latest results at the official public hosts', () => {
    assert.equal(SEO_HUB_HOST, 'megapot.network');
    assert.equal(SEO_RESULTS_HOST, 'megapotresults.com');
    assert.equal(new URL(NETWORK_HUB_ORIGIN).hostname, SEO_HUB_HOST);
    assert.equal(new URL(RESULTS_ORIGIN).hostname, SEO_RESULTS_HOST);
  });

  it('keeps /go out of the sitemap and disallows it from robots', () => {
    assert.equal(
      SITEMAP_PATHS.some((pathname) => pathname === '/go' || pathname.startsWith('/go')),
      false,
    );
    assert.deepEqual([...ROBOTS_DISALLOW], ['/go', '/go/']);
  });

  it('describes the three IA steps in JSON-LD', () => {
    const graph = factoryJsonLd();
    const encoded = JSON.stringify(graph);
    assert.equal(encoded.includes('HowTo'), true);
    for (const step of IA_STEPS) {
      assert.equal(encoded.includes(step.label), true);
      assert.equal(encoded.includes(`#${step.id}`), true);
    }
  });
});
