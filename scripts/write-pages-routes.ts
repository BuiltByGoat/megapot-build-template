import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPagesRoutesJson, stripStaticGoArtifacts } from '../src/lib/go-routes.ts';

const ROOT = path.resolve(process.cwd(), process.argv[2] ?? 'out');

async function main(): Promise<void> {
  await mkdir(ROOT, { recursive: true });

  const removed = stripStaticGoArtifacts(ROOT);
  if (removed.length > 0) {
    throw new Error(
      `Removed static /go artifacts that would 200: ${removed.join(', ')}. Do not add app/go.`,
    );
  }

  const routes = buildPagesRoutesJson(ROOT);
  await writeFile(path.join(ROOT, '_routes.json'), `${JSON.stringify(routes, null, 2)}\n`, 'utf8');
  process.stdout.write(`Wrote ${path.join(ROOT, '_routes.json')}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
