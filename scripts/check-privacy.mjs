/**
 * Fail the build if public surfaces contain attribution secrets.
 * Allowed: env *names*. Forbidden: EVM addresses, invite paths, invite tokens.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', '.next', 'node_modules']);
const skipName = /\.test\.(ts|tsx|js|mjs)$/;

const includeExt = new Set([
  '.html',
  '.css',
  '.md',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.svg',
  '.txt',
]);

const rules = [
  { name: 'evm-address', re: /0x[a-fA-F0-9]{40}/ },
  { name: 'invite-path', re: /megapot\.io\/invite/i },
  { name: 'invite-token', re: /\{\{\s*INVITE_URL\s*\}\}/ },
  { name: 'vite-referrer-value', re: /VITE_REFERRER_ADDRESS\s*=\s*0x/i },
];

const findings = [];

function shouldSkip(abs) {
  const rel = relative(root, abs);
  const parts = rel.split(/[\\/]/);
  if (skipDirs.has(parts[0])) return true;
  return skipName.test(parts[parts.length - 1] ?? '');
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (shouldSkip(abs)) continue;
    const st = statSync(abs);
    if (st.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!includeExt.has(extname(entry))) continue;
    const text = readFileSync(abs, 'utf8');
    for (const rule of rules) {
      if (rule.re.test(text)) {
        findings.push(`${rule.name}: ${relative(root, abs)}`);
      }
    }
  }
}

walk(root);

if (findings.length) {
  process.stderr.write('Privacy scan failed — public-secret patterns found:\n');
  for (const row of findings) process.stderr.write(`  ${row}\n`);
  process.exit(1);
}

process.stdout.write('Privacy scan passed (no addresses, invite paths, or invite tokens).\n');
