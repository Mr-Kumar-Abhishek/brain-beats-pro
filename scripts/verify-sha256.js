/**
 * Brain Beats Pro - Cryptographic Integrity & SHA-256 Verification Utility
 *
 * Verifies:
 * 1. Workbox precache MD5 revisions inside sw-generated.js (209 assets).
 * 2. SHA-256 digests across precached assets, Service Worker, sitemap, layouts, and configs
 *    recorded in reports/sha256-manifest.json.
 * 3. Android Digital Asset Links (.well-known/assetlinks.json) SHA-256 signing certificate fingerprints.
 *
 * Usage:
 *   node scripts/verify-sha256.js --write   # Generate/refresh reports/sha256-manifest.json
 *   node scripts/verify-sha256.js           # Verify on-disk MD5, SHA-256, and assetlinks fingerprints
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SW_PATH = path.join(ROOT_DIR, 'sw-generated.js');
const MANIFEST_PATH = path.join(ROOT_DIR, 'reports', 'sha256-manifest.json');
const ASSETLINKS_PATH = path.join(ROOT_DIR, '.well-known', 'assetlinks.json');

const CORE_SYSTEM_FILES = [
  '.well-known/assetlinks.json',
  '_config.yml',
  '_includes/seo-schema.html',
  '_layouts/default.html',
  '_redirects',
  'netlify.toml',
  'scripts/verify-sha256.js',
  'sitemap.xml',
  'sw-generated.js',
  'sw.js'
];

const SHA256_FINGERPRINT_RE = /^[0-9A-F]{2}(:[0-9A-F]{2}){31}$/;

function computeDigest(filePath, algorithm) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash(algorithm).update(data).digest('hex');
}

function parseWorkboxEntries(swContent) {
  const entries = [];
  const regex = /\{"revision":"([0-9a-f]{32})","url":"([^"]+)"\}/g;
  let match;
  while ((match = regex.exec(swContent)) !== null) {
    entries.push({ revision: match[1], url: match[2] });
  }
  return entries;
}

function validateAssetlinks() {
  if (!fs.existsSync(ASSETLINKS_PATH)) {
    throw new Error('Missing .well-known/assetlinks.json');
  }
  const parsed = JSON.parse(fs.readFileSync(ASSETLINKS_PATH, 'utf8'));
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('.well-known/assetlinks.json must be a non-empty JSON array');
  }
  const fingerprints = [];
  for (const entry of parsed) {
    const fps = entry && entry.target && entry.target.sha256_cert_fingerprints;
    const pkg = entry && entry.target && entry.target.package_name;
    if (!pkg || !Array.isArray(fps) || fps.length === 0) {
      throw new Error('Invalid target entry in .well-known/assetlinks.json');
    }
    for (const fp of fps) {
      if (!SHA256_FINGERPRINT_RE.test(fp)) {
        throw new Error(`Invalid SHA-256 certificate fingerprint in assetlinks.json: ${fp}`);
      }
      fingerprints.push({ package_name: pkg, sha256: fp });
    }
  }
  return fingerprints;
}

function buildManifest() {
  const swContent = fs.readFileSync(SW_PATH, 'utf8');
  const wbEntries = parseWorkboxEntries(swContent);
  if (wbEntries.length === 0) {
    throw new Error('No Workbox precache entries found in sw-generated.js');
  }

  for (const entry of wbEntries) {
    const abs = path.join(ROOT_DIR, entry.url);
    if (!fs.existsSync(abs)) {
      throw new Error(`Precached file missing on disk: ${entry.url}`);
    }
    const diskMd5 = computeDigest(abs, 'md5');
    if (diskMd5 !== entry.revision) {
      throw new Error(`Workbox MD5 mismatch for ${entry.url}: manifest=${entry.revision}, disk=${diskMd5}`);
    }
  }

  const assetlinksFingerprints = validateAssetlinks();
  const relPaths = Array.from(new Set([...wbEntries.map((e) => e.url), ...CORE_SYSTEM_FILES])).sort();
  const files = {};

  for (const relPath of relPaths) {
    const abs = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(abs)) {
      throw new Error(`Tracked file missing on disk: ${relPath}`);
    }
    const buf = fs.readFileSync(abs);
    files[relPath] = {
      bytes: buf.length,
      md5: crypto.createHash('md5').update(buf).digest('hex'),
      sha256: crypto.createHash('sha256').update(buf).digest('hex')
    };
  }

  const manifest = {
    schemaVersion: 1,
    algorithm: 'SHA-256',
    workboxRevisionAlgorithm: 'MD5',
    canonicalDomain: 'https://brain-beats-pro.netlify.app',
    workboxPrecacheCount: wbEntries.length,
    totalFiles: relPaths.length,
    assetlinksFingerprints,
    files
  };

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(
    `[SHA-256] Wrote ${MANIFEST_PATH} (${manifest.totalFiles} files, ${manifest.workboxPrecacheCount} Workbox MD5 entries, ${assetlinksFingerprints.length} assetlinks SHA-256 fingerprints).`
  );
}

function verifyAll() {
  const swContent = fs.readFileSync(SW_PATH, 'utf8');
  const wbEntries = parseWorkboxEntries(swContent);
  if (wbEntries.length === 0) {
    throw new Error('No Workbox precache entries found in sw-generated.js');
  }

  for (const entry of wbEntries) {
    const abs = path.join(ROOT_DIR, entry.url);
    if (!fs.existsSync(abs)) {
      throw new Error(`Missing precached asset: ${entry.url}`);
    }
    const diskMd5 = computeDigest(abs, 'md5');
    if (diskMd5 !== entry.revision) {
      throw new Error(`Workbox MD5 mismatch for ${entry.url}: manifest=${entry.revision}, disk=${diskMd5}`);
    }
  }

  const assetlinksFingerprints = validateAssetlinks();

  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('Missing reports/sha256-manifest.json (run npm run build:sha256)');
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const entries = Object.entries(manifest.files || {});
  if (entries.length < wbEntries.length) {
    throw new Error(`Expected >= ${wbEntries.length} files in sha256-manifest.json, got ${entries.length}`);
  }

  for (const [relPath, meta] of entries) {
    const abs = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(abs)) {
      throw new Error(`Missing SHA-256 tracked file on disk: ${relPath}`);
    }
    const buf = fs.readFileSync(abs);
    const diskSha256 = crypto.createHash('sha256').update(buf).digest('hex');
    if (diskSha256 !== meta.sha256) {
      throw new Error(`SHA-256 mismatch for ${relPath}: manifest=${meta.sha256}, disk=${diskSha256}`);
    }
  }

  console.log(
    `[SHA-256] Verified ${entries.length} SHA-256 file digests, ${wbEntries.length} Workbox MD5 revisions, and ${assetlinksFingerprints.length} assetlinks SHA-256 certificate fingerprints (0 mismatches).`
  );
}

if (process.argv.includes('--write')) {
  buildManifest();
} else {
  verifyAll();
}
