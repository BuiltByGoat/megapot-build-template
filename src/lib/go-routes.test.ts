import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';
import {
  buildPagesRoutesJson,
  FORBIDDEN_GO_FUNCTION_FILES,
  findStaticGoArtifacts,
  GO_WORKER_FILENAME,
  generateGoWorker,
  REQUIRED_GO_FUNCTION_FILES,
  routesJsonForcesGoFunction,
} from './go-routes.ts';
import { DEFAULT_UTMS, FACTORY_HOSTNAME } from './utms.ts';

type GoHandler = (context: { env?: Record<string, unknown>; request?: Request }) => Response;

async function loadGoHandler(): Promise<GoHandler> {
  const href = pathToFileURL(path.join(process.cwd(), 'functions/go.js')).href;
  const mod = (await import(href)) as { onRequestGet: GoHandler };
  return mod.onRequestGet;
}

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
    assert.equal(goSource.includes('GO_HITS'), true);
    assert.equal(goSource.includes('writeDataPoint'), true);
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
    assert.equal(/^\s*compatibility_date\s*=/m.test(wrangler), true);
    assert.equal(wrangler.includes('pages_build_output_dir = "out"'), true);
    assert.equal(wrangler.includes('[[analytics_engine_datasets]]'), true);
    assert.equal(wrangler.includes('binding = "GO_HITS"'), true);
    assert.equal(wrangler.includes('dataset = "network_go_hits"'), true);
  });

  it('runs TypeScript check and postbuild scripts via tsx (Node 20-safe)', () => {
    const pkg = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    const scripts = Object.values(pkg.scripts ?? {}).join('\n');
    assert.equal(scripts.includes('experimental-strip-types'), false);
    assert.equal(scripts.includes('tsx scripts/write-pages-routes.ts'), true);
    assert.equal(scripts.includes('tsx scripts/check-seo.mjs'), true);
    assert.equal(scripts.includes('wrangler pages dev out'), true);
    assert.equal(typeof pkg.devDependencies?.wrangler === 'string', true);
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

  it('does not exclude advanced-mode _worker.js as if it were /go', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'go-worker-'));
    writeFileSync(path.join(root, 'index.html'), '<html>home</html>');
    writeFileSync(path.join(root, GO_WORKER_FILENAME), 'export default {}');
    const routes = buildPagesRoutesJson(root);
    assert.equal(routes.exclude.includes('/_worker.js'), false);
    assert.equal(routesJsonForcesGoFunction(routes), true);
  });
});

describe('generateGoWorker', () => {
  it('reuses onRequest so Direct Upload of out/ still 302s /go', () => {
    const source = readFileSync(path.join(process.cwd(), 'functions/go.js'), 'utf8');
    const worker = generateGoWorker(source);
    assert.equal(worker.includes('export function onRequest'), true);
    assert.equal(worker.includes('export default'), true);
    assert.equal(worker.includes("url.pathname === '/go'"), true);
    assert.equal(worker.includes("url.pathname === '/go/'"), true);
    assert.equal(worker.includes('env.ASSETS.fetch(request)'), true);
    assert.equal(worker.includes('writeDataPoint'), true);
    assert.equal(worker.includes('GO_HITS'), true);
    assert.equal(worker.includes("from '"), false);
  });
});

describe('/go Analytics Engine write', () => {
  it('writes hostname + medium + campaign + path + 302 and still redirects', async () => {
    const onRequestGet = await loadGoHandler();

    const points: unknown[] = [];
    const env = {
      SITE_HOSTNAME: FACTORY_HOSTNAME,
      GO_HITS: {
        writeDataPoint(point: unknown) {
          points.push(point);
        },
      },
    };

    const slash = onRequestGet({
      env,
      request: new Request(`https://${FACTORY_HOSTNAME}/go/`),
    });
    const bare = onRequestGet({
      env,
      request: new Request(`https://${FACTORY_HOSTNAME}/go`),
    });

    assert.equal(slash.status, 302);
    assert.equal(bare.status, 302);
    assert.deepEqual(points, [
      {
        indexes: [FACTORY_HOSTNAME],
        blobs: [DEFAULT_UTMS.utm_medium, DEFAULT_UTMS.utm_campaign, '/go/', '302'],
        doubles: [1],
      },
      {
        indexes: [FACTORY_HOSTNAME],
        blobs: [DEFAULT_UTMS.utm_medium, DEFAULT_UTMS.utm_campaign, '/go', '302'],
        doubles: [1],
      },
    ]);
  });

  it('still 302s when GO_HITS is missing or writeDataPoint throws', async () => {
    const onRequestGet = await loadGoHandler();

    const missing = onRequestGet({
      env: { SITE_HOSTNAME: FACTORY_HOSTNAME },
      request: new Request(`https://${FACTORY_HOSTNAME}/go`),
    });
    const exploding = onRequestGet({
      env: {
        SITE_HOSTNAME: FACTORY_HOSTNAME,
        GO_HITS: {
          writeDataPoint() {
            throw new Error('analytics unavailable');
          },
        },
      },
      request: new Request(`https://${FACTORY_HOSTNAME}/go`),
    });

    assert.equal(missing.status, 302);
    assert.equal(exploding.status, 302);
  });

  it('does not write wallets, referral codes, Location, IPs, or cookies', () => {
    const goSource = readFileSync(path.join(process.cwd(), 'functions/go.js'), 'utf8');
    const writeBlock = goSource.slice(
      goSource.indexOf('if (env.GO_HITS)'),
      goSource.indexOf('return Response.redirect'),
    );

    assert.equal(writeBlock.includes('writeDataPoint'), true);
    assert.equal(writeBlock.includes('location'), false);
    assert.equal(writeBlock.includes('MEGAPOT_PLAY_DESTINATION'), false);
    assert.equal(writeBlock.includes('cookie'), false);
    assert.equal(writeBlock.includes('cf-connecting-ip'), false);
    assert.equal(writeBlock.includes('wallet'), false);
    assert.equal(writeBlock.includes('referral'), false);
  });
});
