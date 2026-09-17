/**
 * ---
 * @customize  Function-win /go. Pages must not emit a static /go 200.
 *             out/_worker.js covers Direct Upload; functions/go.js is SoT.
 * ---
 */

import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

export const GO_FUNCTION_PATHS = ['/go', '/go/'] as const;

export const FORBIDDEN_GO_FUNCTION_FILES = ['functions/go.ts', 'functions/go/index.ts'];

export const REQUIRED_GO_FUNCTION_FILES = ['functions/go.js', 'functions/go/index.js'];

export const GO_WORKER_FILENAME = '_worker.js';

const STATIC_GO_FILES = ['go.html', 'go.htm', 'go/index.html', 'go/index.htm'];

export function findStaticGoArtifacts(root: string): string[] {
  const found: string[] = [];

  for (const relative of STATIC_GO_FILES) {
    const full = path.join(root, relative);
    if (existsSync(full) && statSync(full).isFile()) {
      found.push(relative);
    }
  }

  const goDir = path.join(root, 'go');
  if (existsSync(goDir) && statSync(goDir).isDirectory()) {
    for (const name of readdirSync(goDir)) {
      if (name.endsWith('.html') || name.endsWith('.htm')) {
        const relative = path.posix.join('go', name);
        if (!found.includes(relative)) {
          found.push(relative);
        }
      }
    }
  }

  return found;
}

export function stripStaticGoArtifacts(root: string): string[] {
  const artifacts = findStaticGoArtifacts(root);
  const goDir = path.join(root, 'go');
  const goHtml = path.join(root, 'go.html');
  const goHtm = path.join(root, 'go.htm');

  if (existsSync(goHtml)) {
    rmSync(goHtml);
  }
  if (existsSync(goHtm)) {
    rmSync(goHtm);
  }
  if (existsSync(goDir) && statSync(goDir).isDirectory()) {
    rmSync(goDir, { recursive: true, force: true });
  }

  return artifacts;
}

/**
 * Pages advanced-mode Module Worker for Direct Upload of `out/`.
 * Dashboard zip/upload of the output dir ignores repo-root `functions/`.
 * `_worker.js` in the asset directory is what actually 302s /go there.
 * Git + Wrangler deploys that include this file also use advanced mode
 * (file-based `functions/` is ignored) — same redirect either way.
 */
export function generateGoWorker(goFunctionSource: string): string {
  if (!goFunctionSource.includes('export function onRequest')) {
    throw new Error('functions/go.js must export onRequest so out/_worker.js can reuse it.');
  }

  return `${goFunctionSource.trim()}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/go' || url.pathname === '/go/') {
      return onRequest({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
`;
}

export function buildPagesRoutesJson(outRoot: string): {
  version: 1;
  include: string[];
  exclude: string[];
} {
  const exclude = new Set<string>(['/', '/index.html', '/_next/*']);

  if (existsSync(outRoot) && statSync(outRoot).isDirectory()) {
    for (const entry of readdirSync(outRoot, { withFileTypes: true })) {
      if (
        entry.name === '_routes.json' ||
        entry.name === 'go' ||
        entry.name === GO_WORKER_FILENAME
      ) {
        continue;
      }

      exclude.add(entry.isDirectory() ? `/${entry.name}/*` : `/${entry.name}`);
    }
  }

  for (const rule of [...exclude]) {
    if (ruleMatchesGo(rule)) {
      exclude.delete(rule);
    }
  }

  return {
    version: 1,
    include: ['/*'],
    exclude: [...exclude].sort(),
  };
}

export function routesJsonForcesGoFunction(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as {
    version?: unknown;
    include?: unknown;
    exclude?: unknown;
  };

  if (record.version !== 1 || !Array.isArray(record.include)) {
    return false;
  }

  const include = record.include.filter((rule): rule is string => typeof rule === 'string');
  const exclude = Array.isArray(record.exclude)
    ? record.exclude.filter((rule): rule is string => typeof rule === 'string')
    : [];

  if (exclude.some((rule) => ruleMatchesGo(rule))) {
    return false;
  }

  if (!include.includes('/*')) {
    return false;
  }

  return GO_FUNCTION_PATHS.every((pathname) =>
    include.some((rule) => includeMatchesPath(rule, pathname)),
  );
}

function ruleMatchesGo(rule: string): boolean {
  return GO_FUNCTION_PATHS.some((pathname) => includeMatchesPath(rule, pathname));
}

function includeMatchesPath(rule: string, pathname: string): boolean {
  if (rule === '/*' || rule === pathname) {
    return true;
  }

  if (rule.endsWith('/*')) {
    const prefix = rule.slice(0, -1);
    return pathname.startsWith(prefix);
  }

  return false;
}

export function locationHasDefaultUtms(
  location: string,
  utms: { utm_source: string; utm_medium: string; utm_campaign: string },
): boolean {
  try {
    const parsed = new URL(location);
    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      parsed.searchParams.get('utm_source') === utms.utm_source &&
      parsed.searchParams.get('utm_medium') === utms.utm_medium &&
      parsed.searchParams.get('utm_campaign') === utms.utm_campaign
    );
  } catch {
    return false;
  }
}
