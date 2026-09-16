/**
 * Fail if a public megapot.io href is missing factory UTMs,
 * or if cribble SoT accents drifted.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const includeGenerated = process.argv.includes('--generated');
const skipDirs = new Set(['.git', '.next', 'node_modules']);
if (!includeGenerated) {
  skipDirs.add('out');
  skipDirs.add('public');
}
const includeExt = new Set(['.html', '.tsx', '.ts', '.jsx', '.js']);
const hrefRe = /href=["'](https:\/\/megapot\.io[^"']*)["']/gi;
const required = [
  'utm_source=megapot.build',
  'utm_medium=builder',
  'utm_campaign=build-factory-v1',
];
const sotFiles = ['src/styles/cribble.css', 'templates/marketing/cribble.css'];
const sotColors = ['#000', '#02fe01', '#ff6a1a', '#9bdcf5'];

const findings = [];

function shouldSkip(abs) {
  return skipDirs.has(relative(root, abs).split(/[\\/]/)[0]);
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
    const decoded = text.replaceAll('&amp;', '&');
    for (const match of decoded.matchAll(hrefRe)) {
      const href = match[1];
      const missing = required.filter((part) => !href.includes(part));
      if (missing.length) {
        findings.push(`${relative(root, abs)}: ${href} missing ${missing.join(', ')}`);
      }
    }
  }
}

walk(root);

for (const file of sotFiles) {
  const text = readFileSync(join(root, file), 'utf8');
  for (const color of sotColors) {
    if (!text.includes(color)) {
      findings.push(`${file}: missing cribble SoT color ${color}`);
    }
  }
}

if (findings.length) {
  process.stderr.write('UTM / cribble SoT check failed:\n');
  for (const row of findings) process.stderr.write(`  ${row}\n`);
  process.exit(1);
}

process.stdout.write('UTM / cribble SoT check passed.\n');
