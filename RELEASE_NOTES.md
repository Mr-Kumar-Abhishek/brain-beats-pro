# Release Notes & Deployment Reports

This document tracks all version releases, deployment stabilization reports, CI/CD pipeline optimizations, and architectural milestone audits for **Brain Beats**.

---

## [1.0.2] - 2026-11-07

### 🧭 Semantic Release: Unit Test Hardening, Interactive Browser UX Validation & Deployment Synchronization

#### 1. Executive Summary
This release finalizes the end-to-end verification of Phase 15 accessible Liquid link titles, next/previous post pagination navigation, and interactive disclaimer modal behaviors across browsers, expanding the automated TDD test suite to 91 passing assertions. All commits and tracking branches are synchronized across all three remote topologies (`origin`, `base-stream`, `upstream`).

#### 2. Key Changes & Improvements
- **Phase 15 Automated TDD Unit Tests (`tests/audio-engine.test.js`):**
  - Expanded test suite from 86 to 91 assertions (+5 assertions).
  - Added explicit test gates validating:
    1. `_layouts/post.html` next/previous post navigation markup with Liquid `title` attributes, `rel="prev"`, `rel="next"`, and `#instructionModal` inclusion.
    2. `_layouts/default.html` accessible Liquid titles across all primary navigation anchors (`Brand`, `Home`, `Web App`, `Blog Posts`, `Blog Search`, `Licenses`, `COCOMO`, `Chat`).
    3. `_layouts/default.html` accessible footer link titles (`support@brain-beats.in`, Atom RSS, CC BY 4.0, AGPLv3).
    4. `blog/blog/index.html` dynamic Liquid pagination titles (`title="Go to Page {{ paginator.next_page }}"`).
    5. `RELEASE_NOTES.md` semantic version documentation and deployment reports integrity.
- **Interactive In-Browser UX Verification via Headless/DevTools Automation:**
  - **DOM & Accessibility Tree Inspection:** Validated that top navigation bar links and footer anchors render accessible tooltips and screen-reader accessible names.
  - **Post-Level Pagination:** Verified chronological blog post traversal (`« Previous: 944 hz - Rife Frequency` and `Next: 949.36 hz - Rife Frequency »`) on `http://127.0.0.1:4000/blog/2025/01/15/946-88-hz-rife-frequency.html`.
  - **Modal Lifecycle:** Validated `#instructionModal` transitions smoothly into `modal fade show` (`display: block`, `opacity: 1`) and dismisses cleanly without DOM or style errors.
  - **Audio Engine & Polarity:** Confirmed on `http://127.0.0.1:4000/binaural-beats-generator.html` that polarity phase inversions, carrier frequency swaps (210/217 Hz -> 217/210 Hz), and singleton AudioContext unlocking (`state: "running"`) execute without runtime exceptions.
- **Package Manifest Version Bump:**
  - Bumped `package.json` version to `1.0.2` in adherence with semantic versioning.
- **Multi-Remote Topology Synchronization:**
  - Synchronized branches `main`, `master`, `dev`, `debug`, and `claude` across `origin`, `base-stream`, and `upstream`.

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

