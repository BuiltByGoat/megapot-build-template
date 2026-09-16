/**
 * Growth SEO/IA: builder title, picker IA, SITE_HOSTNAME UTMs,
 * hub/results hosts, Function-win /go stays out of the index,
 * no apex DNS instructions.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { NETWORK_HUB_ORIGIN, RESULTS_ORIGIN } from '../src/lib/origin.ts';
import {
  FACTORY_CANONICAL_ORIGIN,
  FACTORY_DESCRIPTION,
  IA_STEPS,
  ROBOTS_DISALLOW,
  SITEMAP_PATHS,
} from '../src/lib/seo.ts';
import { documentTitle, siteName } from '../src/lib/site.ts';
import { FACTORY_HOSTNAME } from '../src/lib/utms.ts';

const root = process.cwd();
const outRoot = join(root, 'out');
const findings = [];

const dnsInstruction = [
  /\bA\s+record\b/,
  /\bAAAA\s+record\b/i,
  /\bnameserver/i,
  /\bNS\s+record\b/,
  /\bpoint (?:your |the )?DNS\b/i,
  /\bapex is live\b/i,
  /\bnow live at https:\/\/megapot\.build\b/i,
  /\bflip (?:the )?apex\b/i,
];

const copyRoots = ['README.md', 'AGENTS.md', 'llms.txt', 'docs', 'app', 'src/components'];

function collectFiles(start) {
  const abs = join(root, start);
  const st = statSync(abs, { throwIfNoEntry: false });
  if (!st) {
    return [];
  }
  if (st.isFile()) {
    return [abs];
  }
  const files = [];
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const full = join(abs, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(relative(root, full)));
      continue;
    }
    if (['.md', '.txt', '.tsx', '.ts'].includes(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

if (!statSync(outRoot, { throwIfNoEntry: false })?.isDirectory()) {
  findings.push('SEO check needs generated out/. Run pnpm build first.');
} else {
  const home = readFileSync(join(outRoot, 'index.html'), 'utf8');
  const title = documentTitle(siteName());
  if (!home.includes(`<title>${title}</title>`)) {
    findings.push(`Landing title must be ${title}`);
  }
  if (!home.includes(FACTORY_DESCRIPTION)) {
    findings.push('Landing meta description must keep the builder IA sentence');
  }
  if (!/rel="canonical" href="https:\/\/megapot\.build\/?"/.test(home)) {
    findings.push(`Landing must canonical ${FACTORY_CANONICAL_ORIGIN}`);
  }
  for (const step of IA_STEPS) {
    if (!home.includes(`id="${step.id}"`)) {
      findings.push(`Landing must expose IA section #${step.id}`);
    }
    if (!home.includes(`href="/#${step.id}"`) && !home.includes(`href="#${step.id}"`)) {
      findings.push(`Landing must link the ${step.label} IA step`);
    }
  }
  if (!home.includes('application/ld+json')) {
    findings.push('Landing must ship HowTo JSON-LD for picker → configure → deploy');
  }
  if (!home.includes(new URL(NETWORK_HUB_ORIGIN).hostname)) {
    findings.push('Landing must name the Network hub megapot.network');
  }
  if (!home.includes(new URL(RESULTS_ORIGIN).hostname)) {
    findings.push('Landing must name latest results megapotresults.com');
  }
  if (home.includes('utm_source=megapot.build') === false) {
    findings.push('HTML outbound hrefs must stamp utm_source=megapot.build');
  }

  const robots = readFileSync(join(outRoot, 'robots.txt'), 'utf8');
  for (const pathName of ROBOTS_DISALLOW) {
    if (!robots.includes(`Disallow: ${pathName}`)) {
      findings.push(`robots.txt must disallow ${pathName} — /go is a 302, not an indexable page`);
    }
  }
  if (!robots.includes(`Sitemap: ${FACTORY_CANONICAL_ORIGIN}/sitemap.xml`)) {
    findings.push('robots.txt must point sitemap at the factory canonical host');
  }

  const sitemap = readFileSync(join(outRoot, 'sitemap.xml'), 'utf8');
  for (const pathname of SITEMAP_PATHS) {
    const loc = new URL(pathname, FACTORY_CANONICAL_ORIGIN).toString();
    if (!sitemap.includes(`<loc>${loc}</loc>`)) {
      findings.push(`sitemap.xml must include ${loc}`);
    }
  }
  if (sitemap.includes('/go')) {
    findings.push('sitemap.xml must not list /go — Function-win 302 only');
  }

  const disclaimer = readFileSync(join(outRoot, 'disclaimer/index.html'), 'utf8');
  if (!/rel="canonical" href="https:\/\/megapot\.build\/disclaimer\/?"/.test(disclaimer)) {
    findings.push('Disclaimer must canonical https://megapot.build/disclaimer/');
  }
}

for (const start of copyRoots) {
  for (const file of collectFiles(start)) {
    const text = readFileSync(file, 'utf8');
    for (const re of dnsInstruction) {
      if (re.test(text)) {
        findings.push(`${relative(root, file)}: apex DNS instruction (${re})`);
      }
    }
  }
}

if (
  !readFileSync(join(root, 'wrangler.toml'), 'utf8').includes(
    `SITE_HOSTNAME = "${FACTORY_HOSTNAME}"`,
  )
) {
  findings.push('wrangler.toml must set SITE_HOSTNAME=megapot.build so /go Location matches HTML');
}

if (findings.length) {
  process.stderr.write('SEO / IA check failed:\n');
  for (const row of findings) process.stderr.write(`  ${row}\n`);
  process.exit(1);
}

process.stdout.write('SEO / IA check passed (title, picker IA, robots, sitemap, no apex DNS).\n');
