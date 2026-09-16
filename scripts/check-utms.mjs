/**
 * Fail if outbound CTAs miss hostname UTMs, or cribble SoT accents drifted.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { PLAY_HREF } from '../src/lib/links.ts';
import { NETWORK_HUB_ORIGIN, PUBLIC_MEGAPOT_ORIGIN, RESULTS_ORIGIN } from '../src/lib/origin.ts';
import { documentTitle, siteName } from '../src/lib/site.ts';
import { FACTORY_HOSTNAME, locationHasCampaignUtms, resolveUtms } from '../src/lib/utms.ts';

const root = process.cwd();
const includeGenerated = process.argv.includes('--generated');
const outRoot = join(root, 'out');
const sotFiles = ['src/styles/cribble.css'];
const sotColors = ['#000', '#02fe01', '#ff6a1a', '#9bdcf5'];
const goSources = [join(root, 'functions/go.js'), join(root, 'functions/go/index.js')];
const requiredGoEnv = [
  'MEGAPOT_PLAY_DESTINATION',
  'SITE_HOSTNAME',
  'MEGAPOT_SITE_HOSTNAME',
  'MEGAPOT_UTM_SOURCE',
  'MEGAPOT_UTM_MEDIUM',
  'MEGAPOT_UTM_CAMPAIGN',
];
const requiredCtas = ['play', 'dashboard', 'results', 'hub'];
const findings = [];

function hrefsOf(html, cta) {
  const tags = html.matchAll(new RegExp(`<a\\b[^>]*\\bdata-cta="${cta}"[^>]*>`, 'gi'));
  return [...tags]
    .map((tag) => tag[0].match(/\bhref="([^"]+)"/i)?.[1])
    .filter((href) => Boolean(href));
}

function decodeHref(href) {
  return href.replaceAll('&amp;', '&');
}

function hostOf(url) {
  try {
    return new URL(decodeHref(url)).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

function hasResolvedUtms(url) {
  try {
    const parsed = new URL(decodeHref(url));
    const expected = resolveUtms({
      ...process.env,
      SITE_HOSTNAME: process.env.SITE_HOSTNAME || FACTORY_HOSTNAME,
    });
    const source = parsed.searchParams.get('utm_source');
    if (source === 'network-site-template' || source === 'megapot-templates') {
      return false;
    }
    if (!locationHasCampaignUtms(parsed.toString())) {
      return false;
    }
    return (
      source === (expected.utm_source ?? FACTORY_HOSTNAME) &&
      parsed.searchParams.get('utm_medium') === expected.utm_medium &&
      parsed.searchParams.get('utm_campaign') === expected.utm_campaign
    );
  } catch {
    return false;
  }
}

function collectHtml(dir) {
  const pages = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...collectHtml(full));
      continue;
    }
    if (entry.name.endsWith('.html')) {
      pages.push(readFileSync(full, 'utf8'));
    }
  }
  return pages;
}

for (const file of sotFiles) {
  const text = readFileSync(join(root, file), 'utf8');
  for (const color of sotColors) {
    if (!text.includes(color)) {
      findings.push(`${file}: missing cribble SoT color ${color}`);
    }
  }
}

const goTexts = goSources.map((file) => readFileSync(file, 'utf8'));
if (goTexts[0] !== goTexts[1]) {
  findings.push('functions/go.js and functions/go/index.js must be identical');
}
const goSource = goTexts.join('\n');
if (!goSource.includes('export function onRequest')) {
  findings.push('functions/go.js must export onRequest');
}
if (!goSource.includes('export function onRequestGet')) {
  findings.push('functions/go.js must export onRequestGet');
}
if (!goSource.includes('302')) {
  findings.push('/go must 302');
}
if (!goSource.includes('hostnameToUtmSource')) {
  findings.push('/go must derive utm_source from SITE_HOSTNAME');
}
if (!goSource.includes('resolveUtms')) {
  findings.push('/go must resolve UTMs from private env, not only defaults');
}
if (/utm_source:\s*['"]network-site-template['"]/.test(goSource)) {
  findings.push('/go must not hardcode utm_source as the literal network-site-template');
}
if (/utm_source:\s*['"]megapot\.build['"]/.test(goSource)) {
  findings.push('/go must derive utm_source from SITE_HOSTNAME, not hardcode megapot.build');
}
for (const name of requiredGoEnv) {
  if (!goSource.includes(name)) {
    findings.push(`/go must read ${name} (utm_source from SITE_HOSTNAME)`);
  }
}

if (includeGenerated) {
  if (!statSync(outRoot, { throwIfNoEntry: false })?.isDirectory()) {
    findings.push(`UTM check needs generated out/. Run pnpm build first.`);
  } else {
    const pages = collectHtml(outRoot);
    const html = pages.join('\n');
    const title = documentTitle(siteName());

    if (!html.includes(`<title>${title}</title>`)) {
      findings.push(`Document title must be ${title}`);
    }
    if (html.includes('drawingresults')) {
      findings.push('Latest results must use megapotresults.com, not drawingresults as primary');
    }
    if (html.includes('github.com/BuiltByGoat/megapot-templates')) {
      findings.push('Public pages must not market BuiltByGoat/megapot-templates');
    }

    for (const cta of requiredCtas) {
      const hrefs = hrefsOf(html, cta);
      if (hrefs.length === 0) {
        findings.push(`Missing data-cta="${cta}" link in out/`);
        continue;
      }

      for (const href of hrefs) {
        if (cta === 'play') {
          if (href !== PLAY_HREF) {
            findings.push(`Play CTA must link to ${PLAY_HREF}, found ${href}`);
          }
          continue;
        }

        const host = hostOf(href);
        if (cta === 'results' && host !== new URL(RESULTS_ORIGIN).hostname) {
          findings.push(`results CTA must go to ${RESULTS_ORIGIN}, found ${href}`);
        }
        if (cta === 'hub' && host !== new URL(NETWORK_HUB_ORIGIN).hostname) {
          findings.push(`hub footer must go to ${NETWORK_HUB_ORIGIN}, found ${href}`);
        }
        if (cta === 'dashboard' && host !== new URL(PUBLIC_MEGAPOT_ORIGIN).hostname) {
          findings.push(`dashboard CTA must stay on ${PUBLIC_MEGAPOT_ORIGIN}, found ${href}`);
        }
        if (!hasResolvedUtms(href)) {
          findings.push(
            `${cta} link must stamp SITE_HOSTNAME UTMs (factory: utm_source=${FACTORY_HOSTNAME}): ${href}`,
          );
        }
      }
    }
  }
}

if (!includeGenerated) {
  const skipDirs = new Set(['.git', '.next', 'node_modules', 'out', 'public']);
  const includeExt = new Set(['.html', '.tsx', '.ts', '.jsx', '.js']);
  const hrefRe =
    /href=["'](https:\/\/(?:megapot\.io|megapot\.network|megapotresults\.com)[^"']*)["']/gi;

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const abs = join(dir, entry);
      if (skipDirs.has(relative(root, abs).split(/[\\/]/)[0])) continue;
      const st = statSync(abs);
      if (st.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!includeExt.has(extname(entry))) continue;
      const text = readFileSync(abs, 'utf8');
      const decoded = text.replaceAll('&amp;', '&');
      for (const match of decoded.matchAll(hrefRe)) {
        findings.push(`${relative(root, abs)}: hardcoded public origin href ${match[1]}`);
      }
    }
  }

  walk(root);
}

if (findings.length) {
  process.stderr.write('UTM / cribble SoT check failed:\n');
  for (const row of findings) process.stderr.write(`  ${row}\n`);
  process.exit(1);
}

process.stdout.write(
  includeGenerated
    ? 'UTM / cribble SoT check passed on generated out/.\n'
    : 'UTM / cribble SoT check passed (functions + tokens + no hardcoded origin hrefs).\n',
);
