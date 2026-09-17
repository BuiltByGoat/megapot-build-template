import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildPagesRoutesJson,
  GO_WORKER_FILENAME,
  generateGoWorker,
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

  const goSource = await readFile(path.resolve(process.cwd(), 'functions/go.js'), 'utf8');
  const workerPath = path.join(ROOT, GO_WORKER_FILENAME);
  await writeFile(workerPath, generateGoWorker(goSource), 'utf8');

  const routes = buildPagesRoutesJson(ROOT);
  await writeFile(path.join(ROOT, '_routes.json'), `${JSON.stringify(routes, null, 2)}\n`, 'utf8');
  process.stdout.write(`Wrote ${workerPath} and ${path.join(ROOT, '_routes.json')}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
