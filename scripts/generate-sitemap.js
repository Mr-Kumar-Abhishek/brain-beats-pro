#!/usr/bin/env node
/**
 * Brain Beats Pro - Standalone Local JavaScript Sitemap Generator & Validator
 *
 * Replaces Ruby `jekyll-sitemap` with a zero-dependency Node.js CLI that:
 * - Reads canonical `url` from `_config.yml` (overridable via `--domain` or `SITEMAP_DOMAIN`)
 * - Indexes root HTML pages (excluding 404 and search-engine verification files)
 * - Indexes blog hubs (`/blog/`, `/blog/blog/`, `/blog/search/`)
 * - Indexes chronological `_posts/*.md` articles using Jekyll-compatible slug normalization
 * - Supports `--verify`, `--dry-run`, `--no-future`, `--max-urls`, and `--json-report`
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_DOMAIN = 'https://brain-beats-pro.netlify.app';
const DEFAULT_SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const DEFAULT_MAX_URLS = 50000;
const MAX_SITEMAP_BYTES = 50 * 1024 * 1024;

const IGNORED_HTML_PATTERNS = [
  /^404\.html$/i,
  /^google[a-f0-9]+\.html$/i,
  /^yandex_[a-f0-9]+\.html$/i,
  /^naver[a-f0-9]+\.html$/i
];

function isIgnoredHtml(fileName) {
  return IGNORED_HTML_PATTERNS.some((re) => re.test(fileName));
}

function readDomainFromConfig(rootDir = ROOT_DIR) {
  const envDomain = process.env.SITEMAP_DOMAIN;
  if (envDomain && envDomain.trim()) {
    return envDomain.trim().replace(/\/+$/, '');
  }
  const configPath = path.join(rootDir, '_config.yml');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    const match = content.match(/^url:\s*(.+)$/m);
    if (match && match[1]) {
      const cleaned = match[1]
        .replace(/\s+#.*$/, '')
        .trim()
        .replace(/^['"]|['"]$/g, '')
        .replace(/\/+$/, '');
      if (cleaned) return cleaned;
    }
  }
  return DEFAULT_DOMAIN;
}

function normalizeSlug(slug) {
  return String(slug)
    .trim()
    .replace(/\s*-\s*|\s+/g, '-');
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function encodePathSegments(routePath) {
  const trailingSlash = routePath.endsWith('/') && routePath.length > 1;
  const parts = routePath.split('/').filter(Boolean).map((seg) => encodeURIComponent(seg));
  if (parts.length === 0) return '/';
  return '/' + parts.join('/') + (trailingSlash ? '/' : '');
}

function getRootHtmlUrls(rootDir, domain) {
  const files = fs.readdirSync(rootDir)
    .filter((f) => f.endsWith('.html') && !isIgnoredHtml(f))
    .sort((a, b) => {
      if (a === 'index.html') return -1;
      if (b === 'index.html') return 1;
      return a.localeCompare(b);
    });

  return files.map((f) => {
    const stat = fs.statSync(path.join(rootDir, f));
    const lastmod = stat.mtime.toISOString().split('T')[0];
    const route = f === 'index.html' ? '/' : encodePathSegments(`/${f}`);
    return {
      loc: `${domain}${route}`,
      lastmod,
      priority: f === 'index.html' ? '1.0' : '0.8',
      changefreq: f === 'index.html' ? 'weekly' : 'monthly'
    };
  });
}

function getBlogHubUrls(rootDir, domain) {
  const hubs = [
    { relFile: path.join('blog', 'index.html'), route: '/blog/', priority: '0.9', changefreq: 'daily' },
    { relFile: path.join('blog', 'blog', 'index.html'), route: '/blog/blog/', priority: '0.8', changefreq: 'daily' },
    { relFile: path.join('blog', 'search', 'index.html'), route: '/blog/search/', priority: '0.7', changefreq: 'weekly' }
  ];

  const urls = [];
  for (const hub of hubs) {
    const absPath = path.join(rootDir, hub.relFile);
    if (fs.existsSync(absPath)) {
      const stat = fs.statSync(absPath);
      urls.push({
        loc: `${domain}${hub.route}`,
        lastmod: stat.mtime.toISOString().split('T')[0],
        priority: hub.priority,
        changefreq: hub.changefreq
      });
    }
  }
  return urls;
}

function getBlogPostUrls(rootDir, domain, includeFuture = true) {
  const postsDir = path.join(rootDir, '_posts');
  if (!fs.existsSync(postsDir)) return [];

  const today = new Date().toISOString().split('T')[0];
  const files = fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));

  const urls = [];
  for (const f of files) {
    const match = f.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    if (!match) continue;
    const [, year, month, day, rawSlug] = match;
    const postDate = `${year}-${month}-${day}`;
    if (!includeFuture && postDate > today) continue;

    const slug = normalizeSlug(rawSlug);
    const route = encodePathSegments(`/blog/${year}/${month}/${day}/${slug}.html`);
    urls.push({
      loc: `${domain}${route}`,
      lastmod: postDate,
      priority: '0.6',
      changefreq: 'yearly'
    });
  }
  return urls;
}

function collectUrls({ rootDir = ROOT_DIR, domain, includeFuture = true } = {}) {
  const resolvedDomain = (domain || readDomainFromConfig(rootDir)).replace(/\/+$/, '');
  const rootUrls = getRootHtmlUrls(rootDir, resolvedDomain);
  const blogHubUrls = getBlogHubUrls(rootDir, resolvedDomain);
  const postUrls = getBlogPostUrls(rootDir, resolvedDomain, includeFuture);

  const seen = new Set();
  const urls = [];
  for (const entry of [...rootUrls, ...blogHubUrls, ...postUrls]) {
    if (!seen.has(entry.loc)) {
      seen.add(entry.loc);
      urls.push(entry);
    }
  }

  return {
    domain: resolvedDomain,
    urls,
    counts: {
      root: rootUrls.length,
      blogHubs: blogHubUrls.length,
      posts: postUrls.length,
      total: urls.length
    }
  };
}

function buildUrlsetXml(urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const u of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(u.loc)}</loc>`);
    if (u.lastmod) lines.push(`    <lastmod>${escapeXml(u.lastmod)}</lastmod>`);
    if (u.changefreq) lines.push(`    <changefreq>${escapeXml(u.changefreq)}</changefreq>`);
    if (u.priority) lines.push(`    <priority>${escapeXml(u.priority)}</priority>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>', '');
  return lines.join('\n');
}

function buildSitemapIndexXml(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const e of entries) {
    lines.push('  <sitemap>');
    lines.push(`    <loc>${escapeXml(e.loc)}</loc>`);
    if (e.lastmod) lines.push(`    <lastmod>${escapeXml(e.lastmod)}</lastmod>`);
    lines.push('  </sitemap>');
  }

  lines.push('</sitemapindex>', '');
  return lines.join('\n');
}

function generateSitemap({
  rootDir = ROOT_DIR,
  outputPath = DEFAULT_SITEMAP_PATH,
  domain,
  includeFuture = true,
  maxUrls = DEFAULT_MAX_URLS,
  dryRun = false,
  jsonReport
} = {}) {
  const collected = collectUrls({ rootDir, domain, includeFuture });
  const filesWritten = [];

  if (!dryRun) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    if (collected.urls.length <= maxUrls) {
      const xml = buildUrlsetXml(collected.urls);
      fs.writeFileSync(outputPath, xml, 'utf8');
      filesWritten.push(outputPath);
    } else {
      const dir = path.dirname(outputPath);
      const ext = path.extname(outputPath) || '.xml';
      const base = path.basename(outputPath, ext);
      const today = new Date().toISOString().split('T')[0];
      const indexEntries = [];

      for (let i = 0, part = 1; i < collected.urls.length; i += maxUrls, part++) {
        const chunk = collected.urls.slice(i, i + maxUrls);
        const chunkName = `${base}-${part}${ext}`;
        const chunkPath = path.join(dir, chunkName);
        fs.writeFileSync(chunkPath, buildUrlsetXml(chunk), 'utf8');
        filesWritten.push(chunkPath);
        indexEntries.push({ loc: `${collected.domain}/${chunkName}`, lastmod: today });
      }

      fs.writeFileSync(outputPath, buildSitemapIndexXml(indexEntries), 'utf8');
      filesWritten.push(outputPath);
    }
  }

  const summary = {
    domain: collected.domain,
    outputPath,
    dryRun,
    includeFuture,
    counts: collected.counts,
    filesWritten
  };

  if (jsonReport) {
    fs.mkdirSync(path.dirname(jsonReport), { recursive: true });
    fs.writeFileSync(jsonReport, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  }

  return summary;
}

function extractLocValues(xmlContent) {
  const locs = [];
  const regex = /<loc>([\s\S]*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xmlContent)) !== null) {
    locs.push(match[1]);
  }
  return locs;
}

function verifySitemap({
  rootDir = ROOT_DIR,
  outputPath = DEFAULT_SITEMAP_PATH,
  domain,
  includeFuture = true,
  maxUrls = DEFAULT_MAX_URLS
} = {}) {
  const resolvedDomain = (domain || readDomainFromConfig(rootDir)).replace(/\/+$/, '');
  const errors = [];

  if (!fs.existsSync(outputPath)) {
    return { valid: false, errors: [`Missing sitemap file: ${outputPath}`], urlCount: 0, bytes: 0, domain: resolvedDomain };
  }

  const xml = fs.readFileSync(outputPath, 'utf8');
  const bytes = Buffer.byteLength(xml, 'utf8');
  if (bytes > MAX_SITEMAP_BYTES) {
    errors.push(`Sitemap exceeds 50 MB protocol limit (${bytes} bytes)`);
  }

  const isIndex = /<sitemapindex[\s>]/.test(xml) && /<\/sitemapindex>/.test(xml);
  const isUrlset = /<urlset[\s>]/.test(xml) && /<\/urlset>/.test(xml);
  if (!isIndex && !isUrlset) {
    errors.push('Sitemap XML missing valid <urlset> or <sitemapindex> root element');
  }

  let locs = [];
  if (isIndex) {
    const childUrls = extractLocValues(xml);
    const dir = path.dirname(outputPath);
    for (const childUrl of childUrls) {
      if (!childUrl.startsWith(`${resolvedDomain}/`)) {
        errors.push(`Sitemap index entry uses non-canonical domain: ${childUrl}`);
        continue;
      }
      const childPath = path.join(dir, childUrl.slice(resolvedDomain.length + 1));
      if (!fs.existsSync(childPath)) {
        errors.push(`Missing referenced sitemap chunk: ${childPath}`);
        continue;
      }
      const childXml = fs.readFileSync(childPath, 'utf8');
      const childLocs = extractLocValues(childXml);
      if (childLocs.length > maxUrls) {
        errors.push(`Chunk ${childPath} exceeds max URLs (${childLocs.length} > ${maxUrls})`);
      }
      locs.push(...childLocs);
    }
  } else {
    locs = extractLocValues(xml);
    if (locs.length > maxUrls) {
      errors.push(`Sitemap exceeds max URLs per file (${locs.length} > ${maxUrls})`);
    }
  }

  const seen = new Set();
  for (const loc of locs) {
    if (/\s/.test(loc)) {
      errors.push(`URL contains raw whitespace: ${loc}`);
    }
    if (!loc.startsWith(`${resolvedDomain}/`) && loc !== resolvedDomain) {
      errors.push(`URL outside canonical domain (${resolvedDomain}): ${loc}`);
    }
    if (loc.includes('brain-beats.in')) {
      errors.push(`Legacy .in TLD detected in URL: ${loc}`);
    }
    const baseName = path.posix.basename(loc);
    if (isIgnoredHtml(baseName)) {
      errors.push(`Verification/ignored HTML file leaked into sitemap: ${loc}`);
    }
    if (seen.has(loc)) {
      errors.push(`Duplicate <loc> URL in sitemap: ${loc}`);
    }
    seen.add(loc);
  }

  const expected = collectUrls({ rootDir, domain: resolvedDomain, includeFuture });
  const expectedSet = new Set(expected.urls.map((u) => u.loc));
  for (const expectedLoc of expectedSet) {
    if (!seen.has(expectedLoc)) {
      errors.push(`Missing expected URL from sitemap: ${expectedLoc}`);
      if (errors.length >= 25) break;
    }
  }
  for (const actualLoc of seen) {
    if (!expectedSet.has(actualLoc)) {
      errors.push(`Unexpected stale URL in sitemap: ${actualLoc}`);
      if (errors.length >= 25) break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    urlCount: locs.length,
    expectedCount: expectedSet.size,
    bytes,
    domain: resolvedDomain
  };
}

function parseCliArgs(argv) {
  const opts = {
    verify: false,
    dryRun: false,
    includeFuture: true,
    maxUrls: DEFAULT_MAX_URLS,
    domain: undefined,
    output: DEFAULT_SITEMAP_PATH,
    jsonReport: undefined,
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--verify') opts.verify = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--no-future') opts.includeFuture = false;
    else if (arg === '-h' || arg === '--help') opts.help = true;
    else if (arg === '--domain' && argv[i + 1]) opts.domain = argv[++i];
    else if (arg.startsWith('--domain=')) opts.domain = arg.slice('--domain='.length);
    else if (arg === '--output' && argv[i + 1]) opts.output = path.resolve(ROOT_DIR, argv[++i]);
    else if (arg.startsWith('--output=')) opts.output = path.resolve(ROOT_DIR, arg.slice('--output='.length));
    else if (arg === '--max-urls' && argv[i + 1]) opts.maxUrls = Number(argv[++i]);
    else if (arg.startsWith('--max-urls=')) opts.maxUrls = Number(arg.slice('--max-urls='.length));
    else if (arg === '--json-report' && argv[i + 1]) opts.jsonReport = path.resolve(ROOT_DIR, argv[++i]);
    else if (arg.startsWith('--json-report=')) opts.jsonReport = path.resolve(ROOT_DIR, arg.slice('--json-report='.length));
    else throw new Error(`Unknown CLI argument: ${arg}`);
  }

  if (!Number.isInteger(opts.maxUrls) || opts.maxUrls < 1) {
    throw new Error(`Invalid --max-urls value: ${opts.maxUrls}`);
  }

  return opts;
}

function printHelp() {
  console.log([
    'Brain Beats Pro - Local JavaScript Sitemap Generator',
    '',
    'Usage: node scripts/generate-sitemap.js [options]',
    '',
    'Options:',
    '  --domain <url>       Override canonical base URL (default from _config.yml)',
    '  --output <path>      Output sitemap XML path (default: sitemap.xml)',
    '  --verify             Validate existing sitemap XML against workspace files',
    '  --dry-run            Compute counts without writing sitemap.xml',
    '  --no-future          Exclude _posts/*.md dated after today (UTC)',
    '  --max-urls <n>       Split into sitemapindex chunks above <n> URLs (default: 50000)',
    '  --json-report <path> Write JSON generation summary report',
    '  -h, --help           Show this help message'
  ].join('\n'));
}

function main() {
  const opts = parseCliArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  if (opts.verify) {
    const result = verifySitemap({
      rootDir: ROOT_DIR,
      outputPath: opts.output,
      domain: opts.domain,
      includeFuture: opts.includeFuture,
      maxUrls: opts.maxUrls
    });
    if (!result.valid) {
      console.error(`[Sitemap Verify] FAILED (${result.errors.length} error(s)):`);
      for (const err of result.errors.slice(0, 20)) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    }
    console.log(
      `[Sitemap Verify] Passed ${result.urlCount} URLs (${result.bytes} bytes, domain: ${result.domain}, 0 errors).`
    );
    return;
  }

  const summary = generateSitemap({
    rootDir: ROOT_DIR,
    outputPath: opts.output,
    domain: opts.domain,
    includeFuture: opts.includeFuture,
    maxUrls: opts.maxUrls,
    dryRun: opts.dryRun,
    jsonReport: opts.jsonReport
  });

  const action = opts.dryRun ? 'Dry-run checked' : 'Generated';
  console.log(
    `[Sitemap] ${action} ${summary.outputPath} with ${summary.counts.total} URLs ` +
    `(root=${summary.counts.root}, hubs=${summary.counts.blogHubs}, posts=${summary.counts.posts}, Domain: ${summary.domain}).`
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  readDomainFromConfig,
  normalizeSlug,
  escapeXml,
  isIgnoredHtml,
  collectUrls,
  buildUrlsetXml,
  buildSitemapIndexXml,
  generateSitemap,
  verifySitemap
};
