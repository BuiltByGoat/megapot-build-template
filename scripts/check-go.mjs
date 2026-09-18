/**
 * Function-win /go: plain JS handlers, no static 200, _routes.json include /*,
 * out/_worker.js for Direct Upload, live wrangler 302 + factory UTMs.
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import {
  FORBIDDEN_GO_FUNCTION_FILES,
  findStaticGoArtifacts,
  GO_FUNCTION_PATHS,
  GO_WORKER_FILENAME,
  locationHasDefaultUtms,
  REQUIRED_GO_FUNCTION_FILES,
  routesJsonForcesGoFunction,
} from '../src/lib/go-routes.ts';
import { DEFAULT_UTMS, FACTORY_HOSTNAME } from '../src/lib/utms.ts';

const ROOT = path.resolve(process.cwd(), process.argv[2] ?? 'out');
const PORT = Number(process.env.GO_CHECK_PORT ?? '4192');
const ORIGIN = `http://127.0.0.1:${PORT}`;
const PLAY_DESTINATION = 'https://example.com/play';
const LIVE_UTMS = {
  utm_source: FACTORY_HOSTNAME,
  utm_medium: DEFAULT_UTMS.utm_medium,
  utm_campaign: DEFAULT_UTMS.utm_campaign,
};

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

for (const relative of REQUIRED_GO_FUNCTION_FILES) {
  if (!existsSync(path.resolve(process.cwd(), relative))) {
    fail(`Missing ${relative} (plain JS Pages Function).`);
  }
}

for (const relative of FORBIDDEN_GO_FUNCTION_FILES) {
  if (existsSync(path.resolve(process.cwd(), relative))) {
    fail(`Remove ${relative}. Competing TS Functions do not invoke on Pages.`);
  }
}

const wrangler = readFileSync(path.resolve(process.cwd(), 'wrangler.toml'), 'utf8');
if (!/^\s*compatibility_date\s*=/m.test(wrangler)) {
  fail(
    'wrangler.toml must set compatibility_date. pages_build_output_dir without it ships static out/ and /go 404s.',
  );
}
if (
  !wrangler.includes('[[analytics_engine_datasets]]') ||
  !wrangler.includes('binding = "GO_HITS"') ||
  !wrangler.includes('dataset = "network_go_hits"')
) {
  fail('wrangler.toml must bind Analytics Engine GO_HITS to dataset network_go_hits.');
}

const go = readFileSync(path.resolve(process.cwd(), 'functions/go.js'), 'utf8');
const slash = readFileSync(path.resolve(process.cwd(), 'functions/go/index.js'), 'utf8');
if (go !== slash) {
  fail('functions/go.js and functions/go/index.js must be identical.');
}

if (!existsSync(ROOT) || !statSync(ROOT).isDirectory()) {
  fail(`/go check needs a generated directory at ${ROOT}. Run pnpm build first.`);
}

const artifacts = findStaticGoArtifacts(ROOT);
if (artifacts.length > 0) {
  fail(
    `/go would be a static 200. Remove these from ${ROOT}: ${artifacts.join(', ')}. Play is a Pages Function only.`,
  );
}

const routesPath = path.join(ROOT, '_routes.json');
if (!existsSync(routesPath)) {
  fail(
    `Missing ${routesPath}. The /go Function must win via _routes.json include ["/*"] with /go not excluded.`,
  );
}

const routes = JSON.parse(readFileSync(routesPath, 'utf8'));
if (!routesJsonForcesGoFunction(routes)) {
  fail(`${routesPath} must include ["/*"] and must not exclude /go or /go/.`);
}

const workerPath = path.join(ROOT, GO_WORKER_FILENAME);
if (!existsSync(workerPath)) {
  fail(
    `Missing ${workerPath}. Direct Upload of out/ ignores repo-root functions/; advanced-mode _worker.js is what 302s /go.`,
  );
}

const worker = readFileSync(workerPath, 'utf8');
if (!worker.includes('export default') || !worker.includes('/go/')) {
  fail(`${workerPath} must be a Module Worker that 302s /go and /go/.`);
}
if (!worker.includes('writeDataPoint') || !worker.includes('GO_HITS')) {
  fail(`${workerPath} must write GO_HITS Analytics Engine points before the /go 302.`);
}

const { onRequestGet } = await import('../functions/go.js');
const handlerResponse = onRequestGet({
  env: { SITE_HOSTNAME: FACTORY_HOSTNAME },
  request: new Request(`https://${FACTORY_HOSTNAME}/go`),
});
if (handlerResponse.status !== 302) {
  fail(`functions/go.js onRequestGet must 302, got ${handlerResponse.status}.`);
}
const handlerLocation = handlerResponse.headers.get('location');
if (!handlerLocation || !locationHasDefaultUtms(handlerLocation, LIVE_UTMS)) {
  fail(`functions/go.js Location must stamp factory UTMs, got ${handlerLocation}`);
}

const written = [];
const hitResponse = onRequestGet({
  env: {
    SITE_HOSTNAME: FACTORY_HOSTNAME,
    GO_HITS: {
      writeDataPoint(point) {
        written.push(point);
      },
    },
  },
  request: new Request(`https://${FACTORY_HOSTNAME}/go/`),
});
if (hitResponse.status !== 302) {
  fail(`functions/go.js must still 302 when GO_HITS writes, got ${hitResponse.status}.`);
}
if (
  written.length !== 1 ||
  JSON.stringify(written[0]) !==
    JSON.stringify({
      indexes: [FACTORY_HOSTNAME],
      blobs: [DEFAULT_UTMS.utm_medium, DEFAULT_UTMS.utm_campaign, '/go/', '302'],
      doubles: [1],
    })
) {
  fail(
    `functions/go.js must write GO_HITS hostname/medium/campaign/path/302, got ${JSON.stringify(written)}`,
  );
}

async function waitForReady(child) {
  let log = '';

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`wrangler pages dev did not become ready\n${log.trim()}`));
    }, 45_000);

    const onData = (chunk) => {
      const text = chunk.toString();
      log += text;
      if (text.includes('Ready on')) {
        clearTimeout(timeout);
        child.stdout?.off('data', onData);
        child.stderr?.off('data', onData);
        resolve();
      }
    };

    child.stdout?.on('data', onData);
    child.stderr?.on('data', onData);
    child.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`wrangler exited before ready (code ${code})\n${log.trim()}`));
    });
  });
}

async function assertLiveRedirects() {
  const child = spawn(
    'pnpm',
    [
      'exec',
      'wrangler',
      'pages',
      'dev',
      ROOT,
      '--port',
      String(PORT),
      '--ip',
      '127.0.0.1',
      '--binding',
      `MEGAPOT_PLAY_DESTINATION=${PLAY_DESTINATION}`,
    ],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    },
  );

  try {
    await waitForReady(child);

    for (const pathname of GO_FUNCTION_PATHS) {
      const response = await fetch(`${ORIGIN}${pathname}`, { redirect: 'manual' });

      if (response.status === 200 || response.status === 404) {
        throw new Error(
          `${pathname} returned HTTP ${response.status} (static HTML). It must HTTP 302 via functions/go.js / out/_worker.js.`,
        );
      }

      if (response.status !== 302) {
        throw new Error(`${pathname} must HTTP 302, got ${response.status}`);
      }

      const location = response.headers.get('location');
      if (!location?.startsWith(`${PLAY_DESTINATION}?`)) {
        throw new Error(`${pathname} Location must use MEGAPOT_PLAY_DESTINATION, got ${location}`);
      }
      if (!locationHasDefaultUtms(location, LIVE_UTMS)) {
        throw new Error(
          `${pathname} Location must stamp utm_source=${FACTORY_HOSTNAME} medium/campaign factory defaults, got ${location}`,
        );
      }
    }

    const home = await fetch(`${ORIGIN}/`, { redirect: 'manual' });
    if (home.status !== 200) {
      throw new Error(`GET / must stay a static 200 during Function-win, got ${home.status}`);
    }
  } finally {
    child.kill('SIGTERM');
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 2000);
      child.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }
}

try {
  await assertLiveRedirects();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

process.stdout.write(
  '/go check passed: Function 302 + factory UTMs for /go and /go/; out/_worker.js; no static /go.\n',
);
