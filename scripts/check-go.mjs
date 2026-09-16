/**
 * Function-win /go: plain JS handlers, no static 200, _routes.json include /*.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import {
  FORBIDDEN_GO_FUNCTION_FILES,
  findStaticGoArtifacts,
  REQUIRED_GO_FUNCTION_FILES,
  routesJsonForcesGoFunction,
} from '../src/lib/go-routes.ts';

const ROOT = path.resolve(process.cwd(), process.argv[2] ?? 'out');

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

process.stdout.write(
  '/go check passed: functions/go.js + functions/go/index.js + _routes.json include /*; no static /go.\n',
);
