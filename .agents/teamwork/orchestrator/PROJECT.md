# Project: IT Firm Blueprint & AI-DLC Local Development Platform

## Architecture
- **Client Tier**: Responsive, zero-cloud browser portal (`public/`) presenting firm capabilities, AI-DLC prompt-loop simulator, and COCOMO economics calculator.
- **Server Tier**: Zero-dependency native Node.js HTTP server (`server/local-server.js`) strictly bound to `127.0.0.1:8080` with loopback enforcement and strict CSP headers.
- **Core Engine Tier (`src/`)**:
  - `src/ai-dlc/prompt-engine.js`: Deterministic prompt generation grounded in existing documentation and code interfaces.
  - `src/ai-dlc/tdd-gates.js`: Opaque-box TDD gating rules across 5 prompt iterations.
  - `src/economics/cocomo-calculator.js`: COCOMO 81 effort, schedule, ACT, 5-year TCO, and supply-chain segregation engine.
- **Verification Tier (`tests/`, `scripts/`)**:
  - `tests/unit.test.js`: Multi-phase TDD unit test runner testing syntax, server, AI-DLC engine, COCOMO formulas, and git remotes.
  - `tests/browser.test.js`: Real-browser automation driving installed Google Chrome / Chromium over CDP/Playwright to verify UI, navigation, and console hygiene without triggering WDAC / AppLocker restrictions.
  - `scripts/devops-pipeline.js`: Integrated fail-fast DevOps pipeline combining unit tests, server lifecycle, browser testing, and test report generation.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | IT Firm Blueprint & Org Structure | Define executive leadership, autonomous delivery pods, practice roles, and service offerings | M2 | R1, Survey |
| 2 | AI-DLC Looped Prompting Specification | Formal 5-iteration prompt loop grounded in docs and initial code, detailing inputs/outputs and doc/code evolution | M2 | R1, Survey |
| 3 | TDD Gating Architecture | Opaque-box test gating rules enforcing Red -> Green -> Refactor transitions at each prompt loop | M2, M4 | R1, R3, TEST_REPORT.md |
| 4 | Software Economics & COCOMO Report | COCOMO 81 model, sizing, 3 modes, ACT, 5-yr TCO, WBS, 12-factor EAF, and labor vs AI credit segregation | M2 | R4, cocomo-cost-estimate.md |
| 5 | Developer Guide & Standards | Comprehensive architecture, 4 pillars, local setup, 6-step lifecycle, and security rules | M2 | R4, DEVELOPMENT.md |
| 6 | Dual Licensing Governance | GNU AGPL-3.0 for software/configs/server, CC BY 4.0 for content/documentation | M1 | R4, DEVELOPMENT.md |
| 7 | Multi-Remote Git Push Guards | Push allowed strictly to `origin` and `base-stream`; push to `upstream` forbidden with active pre-push hook | M1, M4 | R5, DEVELOPMENT.md |
| 8 | Local Development Server | Zero-dependency Node HTTP server bound strictly to `127.0.0.1:8080`, with MIME types and CSP headers | M3 | R2, Survey |
| 9 | Local Healthcheck Utility | CLI script verifying local server response, HTTP 200, latency, and CSP headers | M3 | R2, DEVELOPMENT.md |
| 10 | Interactive Firm Portal UI | Web interface showcasing firm offerings, interactive AI-DLC simulator, and live COCOMO calculator | M3 | R1, R2, Survey |
| 11 | TDD Unit Test Suite | Multi-phase unit testing evaluating AST syntax, server routes, AI-DLC logic, COCOMO formulas, and git remotes | M4 | R3, TEST_REPORT.md |
| 12 | Real Browser Automation Test Suite | Headless/live browser automation driving real Google Chrome / Chromium to verify DOM, user flows, and console errors | M4 | R3, Survey |
| 13 | Integrated DevOps Test Pipeline | Unified fail-fast pipeline runner coordinating unit tests, server background spawn, browser automation, teardown, and report generation | M4 | R3, DEVELOPMENT.md |
| 14 | Comprehensive Test Audit Report | Full test report matching TEST_REPORT.md format with Red-Green-Refactor audit matrix, phase breakdowns, and pass metrics | M4 | R3, R4, TEST_REPORT.md |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Workspace Foundation & Governance | Initialize `d:\big-projects\it-firm`, package manifest, Git remotes, pre-push hook blocking `upstream`, dual licenses (AGPLv3 & CC BY 4.0) | None | DONE |
| M2 | IT Firm Blueprint, Economics & AI-DLC Docs | Create conceptual blueprint, AI-DLC specification, `cocomo-cost-estimate.md`, and `DEVELOPMENT.md` | M1 | DONE |
| M3 | Local Development Server & Web Portal | Implement zero-dependency Node HTTP server on `127.0.0.1:8080`, healthcheck, and interactive portal UI | M1, M2 | DONE |
| M4 | TDD Unit Tests, Browser Automation & DevOps Pipeline | Implement multi-phase unit tests, real browser automation suite, DevOps pipeline script, and generate `TEST_REPORT.md` | M3 | DONE |
| M5 | E2E Verification & Forensic Audit | End-to-end pipeline verification, adversarial stress testing, and forensic integrity audit | M4 | DONE |

## Interface Contracts
### Local Dev Server ↔ Client Portal
- Host: `127.0.0.1`, Port: `8080` (fallback 8081-8090)
- Endpoints:
  - `GET /`: Serves `public/index.html` (Content-Type: `text/html; charset=utf-8`)
  - `GET /health`: Returns JSON `{ status: "ok", timestamp: "...", port: 8080 }` (Content-Type: `application/json`)
  - `GET /api/firm/services`: Returns JSON array of firm service offerings
  - `GET /api/ai-dlc/spec`: Returns JSON representation of 5 prompt loop iterations
  - `POST /api/economics/cocomo`: Accepts `{ kloc: number, mode: string, laborRate: number }`, returns calculated effort, schedule, and cost.
- Security Headers:
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:;`
  - `X-Content-Type-Options: nosniff`

### AI-DLC Engine ↔ TDD Gating Interface
- `PromptEngine.generateLoopPrompt(loopNumber, context)`: Returns structured prompt envelope with input docs, constraints, and objective.
- `TddGates.evaluateGate(loopNumber, testExecutionResult)`:
  - Loop 1 (RED): Expects `testExecutionResult.exitCode !== 0` and `testExecutionResult.failures > 0`.
  - Loop 2 (GREEN): Expects `testExecutionResult.exitCode === 0` and `testExecutionResult.failed === 0`.
  - Loop 3 (REFACTOR): Expects `testExecutionResult.exitCode === 0` with zero regressions.
  - Loop 4 (DOC): Validates synchronization of documentation and metrics.
  - Loop 5 (RELEASE): Expects DevOps pipeline exit code 0 across unit and browser tests.

### DevOps Pipeline ↔ Test Suites
- Invocation: `node scripts/devops-pipeline.js`
- Exit Code Semantics:
  - `0`: All stages passed (Unit tests + Server startup + Real browser automation + Teardown).
  - `1`: Any assertion or startup failure.
- Output: Writes execution summary and Red-Green-Refactor matrix to `TEST_REPORT.md`.

## Code Layout
```
d:\big-projects\it-firm\
├── .git/
│   └── hooks/
│       └── pre-push                    # Blocks any push targeting 'upstream'
├── .github/
│   └── workflows/
│       └── devops-pipeline.yml         # CI/CD test workflow
├── config/
│   └── local.json                      # Local server configuration
├── docs/
│   ├── blueprint.md                    # Firm organizational blueprint & services
│   └── ai-dlc.md                       # Grounded AI-DLC looped prompting specification
├── public/
│   ├── css/
│   │   └── style.css                   # Responsive layout & styling
│   ├── js/
│   │   └── app.js                      # Client-side portal application
│   └── index.html                      # Interactive portal & AI-DLC visualizer
├── scripts/
│   ├── dev-server.js                   # Server launcher
│   ├── healthcheck.js                  # Local server healthcheck
│   ├── devops-pipeline.js              # Integrated DevOps test pipeline runner
│   └── verify-remotes.js               # Git remote policy verifier
├── server/
│   └── local-server.js                 # Native Node.js HTTP server engine with CSP
├── src/
│   ├── ai-dlc/
│   │   ├── prompt-engine.js            # Prompt envelope generator
│   │   └── tdd-gates.js                # Prompt loop transition and gate rules
│   ├── economics/
│   │   └── cocomo-calculator.js        # COCOMO 81 economics engine
│   └── firm/
│       ├── organization.js             # Org structure & role definitions
│       └── services.js                 # Service catalog & contracts
├── tests/
│   ├── unit.test.js                    # TDD unit test suite (Phases 1-8)
│   ├── browser.test.js                 # Real browser automation test suite
│   └── artifacts/                      # Test artifacts & logs
├── cocomo-cost-estimate.md             # IT firm software economics & valuation report
├── DEVELOPMENT.md                      # Comprehensive developer guide & architecture
├── TEST_REPORT.md                      # Full TDD Red-Green-Refactor audit report
├── LICENSE                             # GNU AGPL-3.0
├── LICENSE-CONTENT.txt                 # CC BY 4.0
├── package.json                        # Node package manifest
└── PROJECT.md                          # Project roadmap and milestone tracker
```

