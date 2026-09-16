import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  buildPagesRoutesJson,
  FORBIDDEN_GO_FUNCTION_FILES,
  findStaticGoArtifacts,
  REQUIRED_GO_FUNCTION_FILES,
  routesJsonForcesGoFunction,
} from './go-routes.ts';
import { DEFAULT_UTMS } from './utms.ts';

describe('Next must not export a static /go page', () => {
  it('has no app/go or src/app/go route that would 200', () => {
    assert.equal(existsSync(path.join(process.cwd(), 'app/go')), false);
    assert.equal(existsSync(path.join(process.cwd(), 'app/go/page.tsx')), false);
    assert.equal(existsSync(path.join(process.cwd(), 'src/app/go')), false);
    assert.equal(existsSync(path.join(process.cwd(), 'src/pages/go.tsx')), false);
  });
});

describe('Pages Function files', () => {
  it('ships identical plain JS handlers and no competing TS Function', () => {
    for (const relative of REQUIRED_GO_FUNCTION_FILES) {
      assert.equal(existsSync(path.join(process.cwd(), relative)), true);
    }
    for (const relative of FORBIDDEN_GO_FUNCTION_FILES) {
      assert.equal(existsSync(path.join(process.cwd(), relative)), false);
    }

    const goSource = readFileSync(path.join(process.cwd(), 'functions/go.js'), 'utf8');
    const slashSource = readFileSync(path.join(process.cwd(), 'functions/go/index.js'), 'utf8');

    assert.equal(slashSource, goSource);
    assert.equal(goSource.includes('export function onRequest'), true);
    assert.equal(goSource.includes('export function onRequestGet'), true);
    assert.equal(goSource.includes('302'), true);
    assert.equal(goSource.includes('MEGAPOT_PLAY_DESTINATION'), true);
    assert.equal(goSource.includes('SITE_HOSTNAME'), true);
    assert.equal(goSource.includes('MEGAPOT_SITE_HOSTNAME'), true);
    assert.equal(goSource.includes('MEGAPOT_UTM_SOURCE'), true);
    assert.equal(goSource.includes('MEGAPOT_UTM_MEDIUM'), true);
    assert.equal(goSource.includes('MEGAPOT_UTM_CAMPAIGN'), true);
    assert.equal(goSource.includes('hostnameToUtmSource'), true);
    assert.equal(goSource.includes('resolveUtms'), true);
    assert.equal(goSource.includes(DEFAULT_UTMS.utm_medium), true);
    assert.equal(goSource.includes(DEFAULT_UTMS.utm_campaign), true);
    assert.equal(/utm_source:\s*['"]network-site-template['"]/.test(goSource), false);
    assert.equal(/utm_source:\s*['"]megapot\.build['"]/.test(goSource), false);
    assert.equal(goSource.includes("from '"), false);
  });

  it('does not put account_id in wrangler.toml and sets factory SITE_HOSTNAME', () => {
    const wrangler = readFileSync(path.join(process.cwd(), 'wrangler.toml'), 'utf8');
    assert.equal(/^\s*account_id\s*=/m.test(wrangler), false);
    assert.equal(wrangler.includes('name = "megapot-build"'), true);
    assert.equal(wrangler.includes('SITE_HOSTNAME = "megapot.build"'), true);
  });

  it('runs TypeScript check and postbuild scripts via tsx (Node 20-safe)', () => {
    const pkg = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    const scripts = Object.values(pkg.scripts ?? {}).join('\n');
    assert.equal(scripts.includes('experimental-strip-types'), false);
    assert.equal(scripts.includes('tsx scripts/write-pages-routes.ts'), true);
    assert.equal(scripts.includes('tsx scripts/check-seo.mjs'), true);
    assert.equal(typeof pkg.engines?.node === 'string' && pkg.engines.node.includes('20'), true);
  });
});

describe('findStaticGoArtifacts', () => {
  it('fails closed when Next emitted a static /go page', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'go-static-'));
    mkdirSync(path.join(root, 'go'));
    writeFileSync(path.join(root, 'go', 'index.html'), '<html>play</html>');
    assert.equal(findStaticGoArtifacts(root).includes('go/index.html'), true);
  });

  it('passes when out/ has no go HTML', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'go-clean-'));
    writeFileSync(path.join(root, 'index.html'), '<html>home</html>');
    assert.deepEqual(findStaticGoArtifacts(root), []);
  });
});

describe('routesJsonForcesGoFunction', () => {
  it('requires include /* and never excludes /go', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'go-routes-'));
    writeFileSync(path.join(root, 'index.html'), '<html>home</html>');
    writeFileSync(path.join(root, 'favicon.svg'), '<svg></svg>');
    mkdirSync(path.join(root, '_next'));

    const routes = buildPagesRoutesJson(root);
    assert.deepEqual(routes.include, ['/*']);
    assert.equal(routes.exclude.includes('/'), true);
    assert.equal(routes.exclude.includes('/index.html'), true);
    assert.equal(routes.exclude.includes('/_next/*'), true);
    assert.equal(routes.exclude.includes('/favicon.svg'), true);
    assert.equal(routes.exclude.includes('/go'), false);
    assert.equal(routes.exclude.includes('/go/'), false);
    assert.equal(routesJsonForcesGoFunction(routes), true);

    assert.equal(
      routesJsonForcesGoFunction({
        version: 1,
        include: ['/go', '/go/'],
        exclude: [],
      }),
      false,
    );
    assert.equal(
      routesJsonForcesGoFunction({
        version: 1,
        include: ['/*'],
        exclude: ['/go'],
      }),
      false,
    );
  });
});
