/**
 * Function-win /go: plain JS handlers, out/_worker.js, no static 200,
 * _routes.json include /*, live wrangler 302.
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import {
  FORBIDDEN_GO_FUNCTION_FILES,
  findStaticGoArtifacts,
  GO_FUNCTION_PATHS,
  locationHasDefaultUtms,
  PAGES_WORKER_FILENAME,
  REQUIRED_GO_FUNCTION_FILES,
  routesJsonForcesGoFunction,
  workerSourceForcesGoFunction,
} from '../src/lib/go-routes.ts';

const LIVE_UTMS = {
  SITE_HOSTNAME: 'https://www.clone-host.example',
  MEGAPOT_UTM_MEDIUM: 'builder',
  MEGAPOT_UTM_CAMPAIGN: 'build-factory-v1',
};

const LIVE_UTM_PARAMS = {
  utm_source: 'clone-host.example',
  utm_medium: LIVE_UTMS.MEGAPOT_UTM_MEDIUM,
  utm_campaign: LIVE_UTMS.MEGAPOT_UTM_CAMPAIGN,
};

const ROOT = path.resolve(process.cwd(), process.argv[2] ?? 'out');
const PORT = Number(process.env.GO_CHECK_PORT ?? '4191');
const ORIGIN = `http://127.0.0.1:${PORT}`;

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function assertPlainJsFunctions() {
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

  const go = readFileSync(path.resolve(process.cwd(), REQUIRED_GO_FUNCTION_FILES[0]), 'utf8');
  const slash = readFileSync(path.resolve(process.cwd(), REQUIRED_GO_FUNCTION_FILES[1]), 'utf8');
  if (go !== slash) {
    fail('functions/go.js and functions/go/index.js must be identical.');
  }
}

function assertNoStaticGo() {
  const artifacts = findStaticGoArtifacts(ROOT);
  if (artifacts.length > 0) {
    fail(
      `/go would be a static 200. Remove these from ${ROOT}: ${artifacts.join(', ')}. Play is a Pages Function only.`,
    );
  }
}

function assertRoutesJson() {
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
}

function assertWorker() {
  const workerPath = path.join(ROOT, PAGES_WORKER_FILENAME);
  if (!existsSync(workerPath)) {
    fail(
      `Missing ${workerPath}. Direct Upload of out/ drops repo-root functions/; advanced-mode _worker.js must ship in the asset directory.`,
    );
  }

  const source = readFileSync(workerPath, 'utf8');
  if (!workerSourceForcesGoFunction(source)) {
    fail(
      `${workerPath} must export a Module Worker that 302s /go and /go/ then falls through to ASSETS.`,
    );
  }
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
      `SITE_HOSTNAME=${LIVE_UTMS.SITE_HOSTNAME}`,
      '--binding',
      `MEGAPOT_UTM_MEDIUM=${LIVE_UTMS.MEGAPOT_UTM_MEDIUM}`,
      '--binding',
      `MEGAPOT_UTM_CAMPAIGN=${LIVE_UTMS.MEGAPOT_UTM_CAMPAIGN}`,
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
      const response = await fetch(`${ORIGIN}${pathname}`, {
        redirect: 'manual',
      });

      if (response.status === 200) {
        throw new Error(
          `${pathname} returned HTTP 200 (static HTML). It must HTTP 302 via out/_worker.js. Smoke: curl -sI ${pathname} → 302 + Location UTMs.`,
        );
      }

      if (response.status === 404) {
        throw new Error(
          `${pathname} returned HTTP 404. Functions did not win. out/_worker.js must handle /go inside the published asset directory.`,
        );
      }

      if (response.status !== 302) {
        throw new Error(`${pathname} must HTTP 302, got ${response.status}`);
      }

      const location = response.headers.get('location');
      if (!location || !locationHasDefaultUtms(location, LIVE_UTM_PARAMS)) {
        throw new Error(
          `${pathname} Location must stamp SITE_HOSTNAME as utm_source with factory medium/campaign, got ${location}`,
        );
      }
    }

    const home = await fetch(`${ORIGIN}/`, { redirect: 'manual' });
    if (home.status !== 200) {
      throw new Error(`Landing must remain a static 200, got ${home.status}`);
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

async function main() {
  if (!existsSync(ROOT) || !statSync(ROOT).isDirectory()) {
    fail(`/go check needs a generated directory at ${ROOT}. Run pnpm build first.`);
  }

  assertPlainJsFunctions();
  assertNoStaticGo();
  assertRoutesJson();
  assertWorker();
  await assertLiveRedirects();
  process.stdout.write(
    `/go check passed: Function 302 + env UTMs for ${GO_FUNCTION_PATHS.join(' and ')}; out/_worker.js; no static 200.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
});
