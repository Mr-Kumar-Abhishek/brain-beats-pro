# Release Notes & Deployment Reports

This document tracks all version releases, deployment stabilization reports, CI/CD pipeline optimizations, and architectural milestone audits for **Brain Beats**.

---

## [1.0.1] - 2026-11-07

### 🔗 Semantic Release: Liquid Clickable Link Titles & Accessible Navigation

#### 1. Executive Summary
This release implements accessible, SEO-optimized, and screen-reader-compliant `title` attributes across all clickable anchors and pagination links rendered through Liquid templates in `_layouts/post.html`, `_layouts/default.html`, and `blog/` views.

#### 2. Key Changes & Improvements
- **Liquid Post Navigation Titles in `_layouts/post.html`:**
  - Added dedicated next/previous post pagination navigation rendered with Liquid:
    - `<a href="{{ page.previous.url | relative_url }}" title="{{ page.previous.title | escape }}" rel="prev">`
    - `<a href="{{ page.next.url | relative_url }}" title="{{ page.next.title | escape }}" rel="next">`
- **Liquid Navbar & Footer Anchor Titles in `_layouts/default.html`:**
  - Integrated descriptive Liquid-compatible `title` attributes on all navigation bar links (`Home`, `Brain Beats Pro Web App`, `Blog Posts`, `Blog Search`, `Licenses`, `COCOMO Estimation`, `Chat`).
  - Added descriptive `title` attributes on footer contact and licensing links (`support@brain-beats.in`, Atom RSS, CC BY 4.0, and GNU AGPLv3).
- **Blog Archive & Pagination Titles:**
  - Enriched blog archive and pagination controls in `blog/index.html` and `blog/blog/index.html` with descriptive `title` attributes for pagination steps (`title="Go to Page {{ paginator.next_page }}"`).
- **Test Suite Verification:**
  - All 86 automated unit tests pass with zero errors (`tests/audio-engine.test.js`).

---

## [1.0.0] - 2026-11-07

### 🚀 Milestone: Production Deployment Stabilization & CI/CD Optimization

#### 1. Executive Summary
This release resolves CI/CD build pipeline failures, decouples non-critical offline assets from core web application generation, hardens multi-branch deployment synchronization across remotes, and validates full stability across the Web Audio synthesis engine, responsive Bootstrap layouts, and Jekyll static generation.

#### 2. Key Changes & Improvements
- **Simultaneous Ruby & Node Build Pipeline:**
  - Re-architected `.github/workflows/pages.yml` so that Ruby Jekyll site generation (`bundle exec jekyll build`) and Node asset/SW processing (`npm run build`) execute concurrently in background jobs.
  - Non-critical offline service worker precaching is deprioritized so asset warnings never block or fail the primary site build.
- **SCSS Compilation & Syntax Error Fix:**
  - Resolved `sass.Exception: unmatched "}"` in `_sass/_components.scss` (line 233) caused by an orphaned hover/active block.
  - Verified clean transpilation of `css/main.css` and `blog/css/main.css` (26,935 bytes) via Dart Sass (`scripts/build-css.js`).
- **Deployment Concurrency & Race Condition Elimination:**
  - Unified GitHub Actions concurrency group to `group: "pages-deploy"` across `main` and `master`, serializing pushes and preventing git push rejections (`gh-pages -> gh-pages (fetch first)`).
- **Legacy Pages Builder Deactivation:**
  - Migrated GitHub Pages repository build source from `legacy` to `workflow`, eliminating dynamic `pages-build-deployment` timeout failures (10m+ on file sync).
- **Automated Sitemap & Content Expansion:**
  - Regenerated `sitemap.xml` with 1,447 canonical URLs (`https://brain-beats.in/`) covering all 46 root audio tools and 1,401 published blog posts through November 2026.
- **Audio Engine & TDD Verification:**
  - All 86 automated test assertions pass with 100% success across all 14 evaluation phases (`tests/audio-engine.test.js`).

#### 3. Verification & Live Deployment Status
- **Deploy to GitHub Pages (`main` & `master`):** Passing (53s – 1m 49s).
- **CodeQL Security Analysis:** Passing across JavaScript and TypeScript.
- **Live URL Verification (`https://mr-kumar-abhishek.github.io/brain-beats-pro/`):** Online, fully styled, audio synthesis functional with dual oscillators and singleton AudioContext state transitions.

---

## Pre-Release Milestones & TDD Audit History

For detailed cycle-by-cycle engineering records and test suite audits, consult [`TEST_REPORT.md`](TEST_REPORT.md) and [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

<div align="center">
<sub>&copy; Brain Beats Pro. Written content and documentation are licensed under <a href="LICENSE-CONTENT.txt">CC BY 4.0</a>. Software code, synthesis mechanics, and configuration files are copyleft protected under <a href="LICENSE">GNU AGPLv3</a>.</sub>
</div>

