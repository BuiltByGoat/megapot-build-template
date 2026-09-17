import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildPagesRoutesJson,
  buildPagesWorkerSource,
  PAGES_WORKER_FILENAME,
  REQUIRED_GO_FUNCTION_FILES,
  stripStaticGoArtifacts,
} from '../src/lib/go-routes.ts';

const ROOT = path.resolve(process.cwd(), process.argv[2] ?? 'out');

async function main(): Promise<void> {
  await mkdir(ROOT, { recursive: true });

  const removed = stripStaticGoArtifacts(ROOT);
  if (removed.length > 0) {
    throw new Error(
      `Removed static /go artifacts that would 200: ${removed.join(', ')}. Do not add app/go.`,
    );
  }

  const goPath = path.resolve(process.cwd(), REQUIRED_GO_FUNCTION_FILES[0]);
  const slashPath = path.resolve(process.cwd(), REQUIRED_GO_FUNCTION_FILES[1]);
  const goSource = await readFile(goPath, 'utf8');
  const slashSource = await readFile(slashPath, 'utf8');
  if (goSource !== slashSource) {
    throw new Error(
      `${REQUIRED_GO_FUNCTION_FILES[0]} and ${REQUIRED_GO_FUNCTION_FILES[1]} must be identical.`,
    );
  }

  const workerPath = path.join(ROOT, PAGES_WORKER_FILENAME);
  await writeFile(workerPath, `${buildPagesWorkerSource(goSource)}\n`, 'utf8');

  const routes = buildPagesRoutesJson(ROOT);
  await writeFile(path.join(ROOT, '_routes.json'), `${JSON.stringify(routes, null, 2)}\n`, 'utf8');
  process.stdout.write(`Wrote ${workerPath} and ${path.join(ROOT, '_routes.json')}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
