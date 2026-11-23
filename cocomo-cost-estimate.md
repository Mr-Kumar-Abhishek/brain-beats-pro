# COCOMO Production Cost & Software Maintenance Valuation

This document provides a comprehensive software engineering cost and maintenance re-estimation for the **Brain Beats** web application and audio synthesis platform using the Constructive Cost Model (COCOMO 81 / Basic COCOMO & Maintenance Model) across three standard deployment modes: **Organic**, **Semi-Detached**, and **Embedded**.

---

## 1. Project Sizing & Language Breakdown

Based on full static analysis of the active tracked source tree at commit `f4f11b45f` (excluding `node_modules`, `.git`, `.jekyll-cache`, `_site`, binary media, and sourcemap artifacts), the active codebase comprises **11,561 clean source files** totaling **2,660,624 Source Lines of Code (2,660.624 KLOC)**:

| Language / Format | Files | Source Lines (SLOC) | Percentage | Role in Architecture |
| :--- | :---: | :---: | :---: | :--- |
| **Markdown Knowledge Base** | 11,248 | 2,240,461 | 84.2% | 11,178 research blog posts (openFDA benchmarks), engineering wiki, frequency references, guides |
| **JSON Data Schemas** | 49 | 188,685 | 7.1% | 25 Frequency preset databases (`11,014` records), laboratory matrices, Rife CAFL presets |
| **Text Data & Manifests** | 31 | 108,846 | 4.1% | Ads configuration, manifests, license matrices, `sitemap.xml` (`11,224` URLs), edge redirects |
| **JavaScript (Engine, UI & Build)** | 119 | 48,525 | 1.8% | Web Audio DSP synthesis, singleton AudioContext, PWA Service Worker, build & generator scripts |
| **CSS & SCSS Styling** | 26 | 48,068 | 1.8% | Modular SCSS partials, responsive design, dark/light theme, layout animations |
| **HTML UI & Jekyll Layouts** | 61 | 22,190 | 0.8% | Tone generators, mind machines, DRY Liquid layouts (`.fluidaner` heading clearance), meta tags, COCOMO report |
| **SVG Visual Assets** | 1 | 2,386 | 0.1% | Vector diagrams, mandala visualizers, UI iconography |
| **Testing Harness** | 1 | 615 | <0.1% | Automated TDD Web Audio verification suite (91 unit & integration tests across 15 phases) |
| **YAML, TOML & Meta Configs** | 11 | 552 | <0.1% | Jekyll configs (`future: true`), Netlify headers, GitHub Actions workflows, Bundler lockfile, root licenses |
| **AudioWorklets (ES Modules)** | 14 | 296 | <0.1% | Real-time multi-color noise generators (White, Pink, Brown, Green, Blue, Violet) |
| **Total Clean Source Code** | **11,561** | **2,660,624** | **100.0%** | **2,660.624 KLOC** |

---

## 2. COCOMO Model Assumptions & Mathematical Formulations

### 2.1 Baseline Parameters
- **Codebase Scale ($KLOC$):** $2,660.624$ KLOC ($2,660,624$ physical source lines)
- **Standard Labor Rate:** $\$8,000$ USD per person-month ($\$96,000$ USD / year fully burdened base)
- **Full-Time Equivalent Team Size:** $\text{Team} = \frac{\text{Effort (PM)}}{\text{TDEV (Months)}}$

### 2.2 Development Effort & Schedule Formulas
1. **Organic Mode:** Well-understood web application developed by experienced engineering teams with stable requirements.

   $$
   \text{Effort}_{nom} = 2.4 \times (KLOC)^{1.05} \quad \text{[Person-Months]}
   $$

   $$
   \text{TDEV} = 2.5 \times (\text{Effort}_{nom})^{0.38} \quad \text{[Months]}
   $$

2. **Semi-Detached Mode:** Medium-complexity system combining standard web frameworks with specialized DSP algorithms, real-time audio synthesis, and cross-browser AudioContext lifecycle management.

   $$
   \text{Effort}_{nom} = 3.0 \times (KLOC)^{1.12} \quad \text{[Person-Months]}
   $$

   $$
   \text{TDEV} = 2.5 \times (\text{Effort}_{nom})^{0.35} \quad \text{[Months]}
   $$

3. **Embedded Mode:** High-complexity real-time system with strict browser audio thread timing, DSP constraints, AudioWorklet thread isolation, and PWA offline precache guarantees.

   $$
   \text{Effort}_{nom} = 3.6 \times (KLOC)^{1.20} \quad \text{[Person-Months]}
   $$

   $$
   \text{TDEV} = 2.5 \times (\text{Effort}_{nom})^{0.32} \quad \text{[Months]}
   $$

### 2.3 Software Maintenance Formulas (COCOMO Maintenance Model)
In the COCOMO software maintenance model, annual ongoing engineering effort is proportional to the **Annual Change Traffic (ACT)**—the fraction of the software codebase that is added, modified, or deleted during a given year:

$$
\text{ACT} = \frac{\text{SLOC}_{\text{added}} + \text{SLOC}_{\text{modified}}}{\text{SLOC}_{\text{total}}}
$$

$$
\text{AME} = \text{ACT} \times \text{Effort}_{nom} \quad \text{[Annual Maintenance Effort in Person-Months/Year]}
$$

$$
\text{AMC} = \text{AME} \times \text{Labor Rate} \quad \text{[Annual Maintenance Cost in USD/Year]}
$$

$$
\text{FTE}_{\text{maint}} = \frac{\text{AME}}{12} \quad \text{[Full-Time Equivalent Maintenance Engineers]}
$$

$$
\text{TCO}_{5\text{yr}} = \text{Cost}_{dev} + 5 \times \text{AMC} \quad \text{[5-Year Total Cost of Ownership]}
$$

---

## 3. Comprehensive Valuation & Maintenance Summary

| Model Variant | Initial Dev Effort | Schedule (TDEV) | Dev Staff Size | Initial Dev Cost | Annual Change Traffic (ACT) | Annual Maint Effort (AME) | Annual Maint Staff (FTE) | Annual Maint Cost (AMC) | 5-Year Total Cost of Ownership (TCO) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Organic** | **9,472.05 PM** | **81.09 mos** | **116.80 devs** | **$75,776,389.41** | **15%** | **1,420.81 PM/yr** | **118.40 FTE** | **$11,366,458.41/yr** | **$132,608,681.47** |
| **Semi-Detached** | **20,563.77 PM** | **80.82 mos** | **254.43 devs** | **$164,510,175.82** | **20%** | **4,112.75 PM/yr** | **342.73 FTE** | **$32,902,035.16/yr** | **$329,020,351.64** |
| **Embedded** | **46,374.87 PM** | **77.83 mos** | **595.84 devs** | **$370,998,960.62** | **25%** | **11,593.72 PM/yr** | **966.14 FTE** | **$92,749,740.15/yr** | **$834,747,661.39** |

---

## 4. Granular Work Breakdown Structure (WBS): Development & Maintenance

The table below delineates the specialized engineering work packages spanning historical development, recent CI/CD remediation, modular SCSS architecture, and ongoing maintenance infrastructure:

| Work Package (WBS) | Engineering Domain & Scope | Estimated Hours | Effort (PM) | Valuation (@ $8k/PM) |
| :--- | :--- | :---: | :---: | :---: |
| **WP1: Web Audio DSP Synthesis Engine** | Developed singleton `AudioContext` architecture, user interaction unlock listeners, dual stereo panning nodes, square/sine/sawtooth oscillators, and AudioWorklet noise pipelines. | 140.0 hrs | 0.875 PM | $7,000.00 |
| **WP2: Rife CAFL Presets & Frequency Catalogs** | Curated and structured 25 JSON databases (49 files, 188k lines) encompassing Rife CAFL presets, Solfeggio, Angel, KHZ, 3D, and Monaural frequency matrices with UI generators. | 120.0 hrs | 0.750 PM | $6,000.00 |
| **WP3: PWA Offline Precache & Service Worker** | Configured Google Workbox CLI toolchain, local service worker pre-compilation (`sw-generated.js`), runtime precaching of 209 assets (11.2MB), and zero-network offline fallbacks. | 45.0 hrs | 0.281 PM | $2,250.00 |
| **WP4: Automated TDD Verification Suite** | Engineered 91 automated unit and integration tests across 15 phases (`tests/audio-engine.test.js`) testing Web Audio graphs, frequency schema assertions, autoplay triggers, and precache integrity. | 48.0 hrs | 0.300 PM | $2,400.00 |
| **WP5: GitHub Pages CI/CD Modernization** | Created dual-mode deployment pipeline in `.github/workflows/pages.yml` supporting GitHub Actions Pages artifacts and automated conventional `gh-pages` branch publisher. | 28.0 hrs | 0.175 PM | $1,400.00 |
| **WP6: Netlify Cloud Build & Rate-Limit Fixes** | Eliminated AWS IP unauthenticated GitHub API rate limits (removed `jekyll-github-metadata`), fixed duplicate sitemap plugin conflicts (Exit Code 10 & 1), and streamlined `netlify.toml`. | 16.0 hrs | 0.100 PM | $800.00 |
| **WP7: Multi-Branch Synchronization & Hygiene** | Reconciled divergent commit histories across core tracking branches (`main`, `master`, `dev`, `debug`, `gh-pages`), standardized deployment logs, and preserved 55 `/lab` research assets. | 24.0 hrs | 0.150 PM | $1,200.00 |
| **WP8: DRY Jekyll Architecture & SEO Layouts** | Standardized Liquid layout templates, dynamic metadata tags (OpenGraph, Twitter Cards, canonical URLs), search index generator, and responsive Bootstrap 5 styling across 11,178 blog pages. | 60.0 hrs | 0.375 PM | $3,000.00 |
| **WP9: Ongoing Annual Maintenance Operations** | Continuous browser Web Audio API deprecation handling, dependency security patching, Service Worker cache invalidation, and multi-remote git maintenance. | 219.0 hrs/yr | 1.369 PM/yr | $10,950.00/yr |
| **WP10: Modular SCSS & Glassmorphic UI/UX** | Restructured CSS into modular `_sass/` partials (`variables`, `base`, `layout`, `components`, `footer`), engineered Dart Sass build script, glassmorphic blur filters, card elevations, and touch micro-interactions. | 42.0 hrs | 0.263 PM | $2,100.00 |
| **WP11: Engineering Wiki & Architecture Documentation** | Authored comprehensive 7-part engineering wiki knowledge base covering development workflows, DSP audio architecture, UI/UX systems, static constant optimization, and QA standards. | 32.0 hrs | 0.200 PM | $1,600.00 |
| **WP12: openFDA Orchestration, Unbounded 25-JSON Indexing & Liquid UX** | Executed automated 2-phase `generate_posts.py` enrichment (`5,649` stubs upgraded + `4,782` new articles through `2053-08-14` with 27 openFDA benchmarks), removed sitemap/Jekyll future-date caps (`11,224` URLs), fixed `.fluidaner` blog heading clearance via `/browser`, and aligned chat-only support docs. | 36.0 hrs | 0.225 PM | $1,800.00 |
| **Total Specialized Engineering** | **Core Audio Platform, Modular SCSS Pipeline, openFDA Content, Wiki & Maintenance** | **810.0 hrs** | **5.063 PM** | **$40,500.00** |

---

## 5. COCOMO Intermediate Cost Driver Adjustments (EAF)

To adjust nominal development and maintenance effort for the Brain Beats platform, specific Cost Drivers are evaluated:

| Cost Driver Attribute | Rating | Multiplier | Engineering Rationale |
| :--- | :---: | :---: | :--- |
| **RELY (Required Software Reliability)** | High | 1.15 | Audio DSP crashes or autoplay lockups disrupt user brainwave entrainment sessions. |
| **DATA (Database Size / Complexity)** | High | 1.08 | 25 JSON catalogs comprising 188k lines of frequency tables loaded and searched client-side. |
| **CPLX (Product Complexity)** | High | 1.15 | Real-time Web Audio synthesis, AudioWorklet thread management, and multi-channel stereo panning. |
| **TIME (Execution Time Constraint)** | High | 1.11 | Strict low-latency 44.1kHz / 48kHz audio buffer scheduling without audible glitching or frame drops. |
| **STOR (Main Storage Constraint)** | Nominal | 1.00 | Standard browser RAM consumption; PWA precache optimized to 11.2MB. |
| **VIRT (Virtual Machine Volatility)** | High | 1.15 | Rapidly evolving mobile browser autoplay policies, Web Audio standards, and Service Worker APIs. |
| **TURN (Computer Turnaround Time)** | Low | 0.87 | Automated GitHub Actions CI/CD workflows and fast local pre-compilation. |
| **ACAP (Analyst Capability)** | Very High | 0.71 | Specialized understanding of acoustic entrainment, psychoacoustics, and DSP audio synthesis. |
| **AEXP (Applications Experience)** | High | 0.91 | Deep experience with Jekyll static site generation, PWA Workbox, modular SCSS, and Web Audio APIs. |
| **PCAP (Programmer Capability)** | Very High | 0.70 | High-efficiency modern JavaScript, automated TDD testing harness, and Git release engineering. |
| **TOOL (Modern Programming Tools)** | High | 0.91 | Advanced CI/CD pipelines, Dart Sass compiler, Bundler, Workbox CLI, and automated Node.js test runners. |
| **MODP (Modern Programming Practices)** | High | 0.91 | TDD verification, declarative GitHub Actions, DRY Liquid layouts, modular SCSS, and conventional commits. |

### Effort Adjustment Factor (EAF) Formulation & Valuation

In the COCOMO 81 Intermediate model, the **Effort Adjustment Factor (EAF)** is computed as the composite product of all cost driver attribute ratings:

$$
\begin{aligned}
\text{EAF} &= \prod_{i=1}^{15} \text{Cost Driver}_i \\
&= 1.15 \times 1.08 \times 1.15 \times 1.11 \times 1.00 \times 1.15 \times 0.87 \\
&\quad \times 0.71 \times 0.91 \times 0.70 \times 0.91 \times 0.91 \\
&= \mathbf{0.672}
\end{aligned}
$$

### Post-Adjustment Platform Valuation ($\text{Effort}_{\text{adj}} = \text{Effort}_{\text{nominal}} \times \text{EAF}$):

| Deployment Mode | Nominal Effort | Adjusted Effort (EAF 0.672) | Adjusted Dev Cost ($8k/PM) |
| :--- | :---: | :---: | :---: |
| **Organic Mode** | 9,472.05 PM | **6,365.22 PM** | **$50,921,733.69 USD** |
| **Semi-Detached Mode (Baseline)** | 20,563.77 PM | **13,818.85 PM** | **$110,550,838.15 USD** |
| **Embedded Mode** | 46,374.87 PM | **31,163.91 PM** | **$249,311,301.54 USD** |

---

## 6. Supply-Chain Cost Segregation

COCOMO estimates engineering labor; it does not price third-party model access, developer seats, hosting, or CI/CD consumption. The **$8,000 per person-month rate is labor only**. The AI and service usage in scope was covered by free credits provided by the respective companies, so the direct cash cost during the credit-covered period was **$0**. Credit consumption and its equivalent list-price value were not provided; that in-kind value is therefore unquantified. Costs after credits expire or are exhausted are not included.

The WBS below reorganizes the specialized engineering estimate from Section 4. Its targeted work-package scope is separate from the full-codebase COCOMO scenarios in Sections 3 and 5; **do not add the two labor estimates together**.

| Supply-chain stream | Included scope / dependencies | WBS mapping | Estimated labor | Labor valuation |
| :--- | :--- | :---: | :---: | :---: |
| **Product engineering** | Web Audio DSP, frequency catalogs, Jekyll layouts, modular SCSS, openFDA/Liquid orchestration | WP1, WP2, WP8, WP10, WP12 | 398 hrs (2.488 PM) | $19,900 one-time |
| **Quality assurance** | Automated TDD and integration verification | WP4 | 48 hrs (0.300 PM) | $2,400 one-time |
| **Build, CI/CD & release** | Workbox/PWA build, GitHub Pages pipeline, Netlify configuration, branch/release hygiene | WP3, WP5, WP6, WP7 | 113 hrs (0.706 PM) | $5,650 one-time |
| **Engineering documentation** | Developer wiki and architecture documentation | WP11 | 32 hrs (0.200 PM) | $1,600 one-time |
| **AI-assisted development tools** | Gemini (Google One subscription), Anthropic Claude (Claude Code), Qwen, DeepSeek R1, and GitHub Copilot using selected OpenAI model(s) | Not separately estimated in WBS | Not provided | $0 direct spend (Gemini included in Google One annual subscription without overages; others covered by free quota / credits) |
| **Ongoing maintenance** | Browser/API updates, dependency patches, cache and repository maintenance | WP9 | 219 hrs/year (1.369 PM/year) | $10,950/year |
| **Specialized WBS subtotal** | One-time work above plus one year of WP9 maintenance | WP1–WP12 | 810 hrs in year one | $40,500 in year one |

The year-one subtotal combines one-time work ($29,550) with one year of estimated maintenance ($10,950). For later years, use the annual maintenance line rather than repeating the one-time WBS work.

### External supplier and service cost ledger

| Supplier / service | Cost classification | Cost driver / credit treatment | Current estimate |
| :--- | :--- | :--- | :---: |
| **Google Gemini** | AI model access & code generation | Usage fully covered under personal Google One annual subscription without overages; zero incremental per-token API or overage fees | $0.00 incremental spend |
| **Anthropic Claude (Claude Code)** | AI model access & code reasoning | Usage covered by company-provided free quota / trial credits; token usage and context window in-kind value tracked | $0 direct spend during covered period |
| **Qwen** | AI model access or self-hosted inference | Usage covered by company-provided free credits; token usage and credit value not supplied | $0 direct spend during covered period |
| **DeepSeek R1** | AI model access or self-hosted inference | Usage covered by company-provided free credits; token usage and credit value not supplied | $0 direct spend during covered period |
| **GitHub Copilot / selected OpenAI model(s)** | Developer-tool seats; model access per the selected Copilot plan | Usage covered by company-provided free credits; seat and model usage breakdown not supplied | $0 direct spend during covered period |
| **GitHub Actions and Pages** | CI/CD and hosting | Usage covered by company-provided free credits; runner, storage, and bandwidth consumption not supplied | $0 direct spend during covered period |
| **Netlify** | CI/CD and hosting | Usage covered by company-provided free credits; build, bandwidth, and hosting consumption not supplied | $0 direct spend during covered period |
| **Workbox and other open-source build tools** | Build tooling | Open-source license cost; engineering labor is counted in the WBS | $0 license cost assumed |

The $0 figures describe direct cash spend only while the reported credits covered usage; they do not imply that the services have no list-price or economic value, nor that future usage will remain free. For a retrospective economic-value estimate, record each provider's credited amount or usage and apply the relevant rate card. For future budgets, use the applicable post-credit rates and projected usage. For self-hosted models, include inference infrastructure and operating labor if applicable. Do not count a Copilot seat as separate API spend unless billing records show an additional charge.

### Google Gemini Compute & Subscription Cost Calculation

To calculate the specific project cost of utilizing Google Gemini (via the Google One AI / Antigravity developer tooling ecosystem):

1. **Subscription Structure**: Access to Gemini models is bundled under an active personal **Google One Annual Subscription**. The annual flat-rate subscription covers consumer cloud storage and Gemini access across Google workspaces and integrated IDE environments.
2. **Overage Policy & Marginal Cost**: The Google One annual tier operates on a strict subscription quota model rather than metered pay-as-you-go API consumption. No incremental overage fees, usage surcharges, or burst penalties are billed when executing codebase crunching, AST analysis, unit test generation, or blog post research.
3. **Incremental Cash Cost Formula**:
   $$
   \text{Cost}_{\text{Gemini, incremental}} = \text{Billed API Overages} = \$0.00 \text{ USD}
   $$
4. **Economic In-Kind Equivalent**: If calculated retrospectively against public commercial API rate cards (e.g. Gemini 1.5 Pro / Flash developer pricing at \$0.075 - \$1.25 per million tokens), the estimated volume of prompt and completion tokens processed during repository restructuring (~3.5 million tokens) carries a theoretical list-price valuation of approximately **\$3.25 – \$6.50 USD**. Because all requests were serviced within the Google One annual subscription entitlement without overages, the direct net cash expense to the project remains strictly:

   $$
   \mathbf{\$0.00 \text{ USD}}
   $$

### Lifetime Git Patch and Dependency Add-On Totals

Patch totals cover all history reachable from the analyzed source commit (`f4f11b45f`), computed with `git log --no-merges --no-renames --numstat`. They include text changes to all tracked paths, exclude binary line counts and merge commits, and count renamed files as deletions plus additions.

| Lifetime patch scope | Non-merge commits | File-change rows | Added patch lines | Deleted patch lines | Gross patch churn |
| :--- | ---: | ---: | ---: | ---: | ---: |
| **All history through `f4f11b45f`** | 9,927 | 321,673 | 30,055,750 | 6,865,296 | 36,921,046 |

Using the report's 2,660,624-SLOC baseline, lifetime gross patch churn is `36,921,046 / 2,660,624 = 13.88x` (1,387.68%). These are cumulative patch operations, not unique source lines or COCOMO Annual Change Traffic (ACT): repeated edits count repeatedly, and a modified line can appear as both an addition and a deletion. Do not substitute this measure for the scenario ACT assumptions in Section 3.

#### Today's Work & Recent Git Patch Activity Through `f4f11b45f`

Against the previous analyzed snapshots (`05301b31b`, `2cc4ba6`, and the pre-openFDA baseline `6c80be11f`) through `f4f11b45f` (`git log --no-merges --no-renames --numstat`), summed patch counts are shown below; repeated edits to a path across commits are counted repeatedly, intentionally differing from a net tree diff.

| Recent patch scope | Non-merge commits | File-change rows | Added patch lines | Deleted patch lines | Gross patch churn |
| :--- | ---: | ---: | ---: | ---: | ---: |
| **Since `05301b31b` (`05301b31b..f4f11b45f`)** | 458 | 147,923 | 15,137,728 | 2,875,612 | 18,013,340 |
| **Today's 7-commit milestone (`6c80be11f..f4f11b45f`)** | 7 | 10,488 | 2,127,359 | 37,841 | 2,165,200 |
| **Latest 2-commit add-on (`40e8311cd..f4f11b45f`)** | 2 | 10 | 421 | 416 | 837 |

Against the 2,660,624-SLOC baseline, cumulative gross patch churn since `05301b31b` is `18,013,340 / 2,660,624 = 6.77x` (677.03%), today's full 7-commit work window (`6c80be11f..f4f11b45f`: commits `5f324a399`, `10cdb7c84`, `856a481b6`, `16b97b6a5`, `40e8311cd`, `80ce62db4`, `f4f11b45f`) represents `2,165,200 / 2,660,624 = 81.38%`, and the latest 2-commit incremental add-on after `40e8311cd` (`80ce62db4` and `f4f11b45f`) represents `837 / 2,660,624 = 0.0315%`.

#### Latest Milestone Delta (`6c80be11f..f4f11b45f`)

Across today's 7 commits (`6c80be11f..f4f11b45f`), the pipeline upgraded all `5,649` existing raw blog stubs in place (`0` remaining), generated `4,782` new `openfda-database`-enriched JSON articles (`4,610` in `10cdb7c84` + `172` in `856a481b6`, reaching `11,178` `_posts/*.md` articles across all `25` JSON files / `11,014` records through `2053-08-14`), enabled `future: true` in `_config.yml`, removed the `postDate > today` cutoff in `scripts/generate-sitemap.js` (expanding `sitemap.xml` to `11,224` canonical URLs), verified full local `bundle exec jekyll build --trace` (`11,178` rendered HTML posts), recalculated COCOMO reports (`40e8311cd`), added `.fluidaner` and top heading spacing across `_layouts/default.html`, `_layouts/post.html`, and `blog/` verified live via `/browser` (`80ce62db4`), and updated docs for chat-only Discord support (`f4f11b45f`).

Current dependency add-ons are counted from the committed npm and Ruby lockfiles. Lockfile entries include transitive dependencies and platform-specific variants; the unique-name total counts names separately by ecosystem. These are locked dependency records, not a claim that every package is currently installed or used at runtime.

| Dependency ecosystem | Lockfile entries | Unique ecosystem-package names |
| :--- | ---: | ---: |
| **npm** (`package-lock.json`) | 571 | 520 |
| **Ruby gems** (`Gemfile.lock`) | 77 | 42 |
| **Total current add-ons** | **648** | **562** |

Under the report's existing assumption that these dependencies have no license fees, direct add-on license cost is **$0 assumed**. Package counts do not establish integration or maintenance labor; that labor is not separately priced here.

### Lifetime Patch-Volume-Equivalent COCOMO Cost

For a volume-based comparison only, the 30,055,750 added patch lines through `f4f11b45f` are treated as if they were 30,055.750 KLOC of newly developed, unique source code. The resulting figures are **not actual historical spend or a valuation of unique surviving code**: Git counts repeated additions across commits, including revisions to the same lines. Do not add these alternative estimates to the current-codebase valuation or the WBS/TCO.

| COCOMO mode | Nominal effort | Nominal cost (@ $8,000/PM) | EAF-adjusted effort (0.672) | EAF-adjusted cost |
| :--- | ---: | ---: | ---: | ---: |
| **Organic** | 120,791.17 PM | $966,329,364.30 | 81,171.67 PM | $649,373,332.81 |
| **Semi-Detached** | 310,742.13 PM | $2,485,937,008.14 | 208,818.71 PM | $1,670,549,669.47 |
| **Embedded** | 850,776.69 PM | $6,806,213,551.09 | 571,721.94 PM | $4,573,775,506.33 |

### Today's & Recent Patch-Volume-Equivalent COCOMO Cost

For comparison only, today's 7-commit full milestone window (`6c80be11f..f4f11b45f`: 2,127,359 added lines / `2,127.359 KLOC`), the latest 2-commit delta since `40e8311cd` (`40e8311cd..f4f11b45f`: 421 added lines / `0.421 KLOC`), and the cumulative post-`05301b31b` delta (`05301b31b..f4f11b45f`: 15,137,728 added lines / `15,137.728 KLOC`) are evaluated below. These estimates count repeated patch additions and are not actual historical spend, unique surviving code, or a cost to add to the lifetime valuation, WBS, or TCO.

#### Today's 7-Commit Full Milestone Window (`6c80be11f..f4f11b45f` — `2,127.359 KLOC` Added)

| COCOMO mode | Nominal effort | Nominal cost (@ $8,000/PM) | EAF-adjusted effort (0.672) | EAF-adjusted cost |
| :--- | ---: | ---: | ---: | ---: |
| **Organic** | 7,489.35 PM | $59,914,791.58 | 5,032.84 PM | $40,262,739.94 |
| **Semi-Detached** | 16,006.74 PM | $128,053,932.73 | 10,756.53 PM | $86,052,242.80 |
| **Embedded** | 35,457.77 PM | $283,662,175.75 | 23,827.62 PM | $190,620,982.10 |

#### Latest 2-Commit Add-On Window (`40e8311cd..f4f11b45f` — `0.421 KLOC` Added)

| COCOMO mode | Nominal effort | Nominal cost (@ $8,000/PM) | EAF-adjusted effort (0.672) | EAF-adjusted cost |
| :--- | ---: | ---: | ---: | ---: |
| **Organic** | 0.97 PM | $7,741.01 | 0.65 PM | $5,201.96 |
| **Semi-Detached** | 1.14 PM | $9,107.67 | 0.77 PM | $6,120.35 |
| **Embedded** | 1.27 PM | $10,198.38 | 0.86 PM | $6,853.31 |

#### Cumulative Window Since `05301b31b` (`05301b31b..f4f11b45f` — `15,137.728 KLOC` Added)

| COCOMO mode | Nominal effort | Nominal cost (@ $8,000/PM) | EAF-adjusted effort (0.672) | EAF-adjusted cost |
| :--- | ---: | ---: | ---: | ---: |
| **Organic** | 58,786.14 PM | $470,289,151.84 | 39,504.29 PM | $316,034,310.04 |
| **Semi-Detached** | 144,141.57 PM | $1,153,132,527.37 | 96,863.13 PM | $774,905,058.39 |
| **Embedded** | 373,572.88 PM | $2,988,583,020.22 | 251,040.97 PM | $2,008,327,789.59 |

**Deployment record (2026-11-19):** Source commit `f4f11b45f` is synchronized across `main`, `master`, `dev`, `debug`, and `claude` on `base-stream`, `org`, and `origin`. GitHub Actions builds and deploys `gh-pages` automatically from pushed source branches.

**Fully loaded five-year TCO (constant annual run rate):**

$$
\text{TCO}_{5\text{yr},\text{loaded}} = \text{COCOMO TCO}_{5\text{yr}} + \sum_{y=1}^{5} \left( \text{AI / Tool Charges after Credits}_y + \text{CI/CD \& Hosting Charges after Credits}_y \right)
$$

For the credit-covered period, the reported direct operating charge is $0. Future-year charges should only be added for usage not covered by available credits. This adds non-labor operating charges to the selected COCOMO scenario, whose existing maintenance estimate already includes maintenance labor. Credit value is excluded from cash TCO; add it separately only when producing an economic-value view. Future charges remain unestimated until credit balances, expiry, usage forecasts, and applicable rates are known.

---

## 7. Key Value Drivers & Strategic Assets

1. **Rife CAFL Presets & Frequency Research Library:** Comprehensive digital archive of 25 structured laboratory catalogs, providing instant client-side frequency lookup and multi-wave audio playback.
2. **Deterministic Web Audio DSP Engine:** Robust singleton audio architecture with seamless mobile autoplay unlock, stereo panning, dynamic gain smoothing, and AudioWorklet noise synthesis.
3. **Modular SCSS Architecture & Dart Sass Transpiler:** Scalable SCSS partials architecture with automated npm compilation pipeline and cross-device responsive layout consistency.
4. **PWA Offline Precache Capability:** Full Progressive Web App functionality backed by Google Workbox, allowing zero-latency offline operation with 209 precached core assets.
5. **Automated TDD Quality Assurance:** Comprehensive 91-test suite across 15 phases ensuring 100% regression-free updates across synthesis logic, frequency schemas, and service worker assets.
6. **Unified Multi-Cloud CI/CD Infrastructure:** Dual automated deployment pipelines for GitHub Pages and Netlify, fully resilient against cloud API rate-limiting and build timeouts.
7. **Comprehensive Engineering Wiki & Knowledge Base:** Documented 7-part internal technical wiki detailing development workflows, DSP audio pipelines, UI/UX systems, static constant optimization, and QA standards.

---

<div align="center">
<sub>&copy; Brain Beats Pro. All calculations based on COCOMO 81 software economics and maintenance models.</sub>
</div>
