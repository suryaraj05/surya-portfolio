# NINA: Building a Production-Grade Voice Navigation Platform for the Web

## Executive Summary

NINA is a voice navigation platform that enables websites to add safe, context-aware voice control through three integrated layers: a browser SDK, a FastAPI decision engine, and a site-specific `agent.json` contract generated offline.

The core problem NINA solves is reliability. Most web voice interfaces fail outside demos because they rely on brittle selectors, weak auth handling, and unconstrained model behavior. NINA addresses this by separating natural language interpretation from execution: one LLM parse step for intent extraction, followed by deterministic contract-based action resolution and safety gates.

The result is a reusable architecture for teams that want to ship voice interaction without rebuilding custom voice logic for every site.

## The Problem

Before NINA, typical approaches fell into three weak patterns:

- Custom one-off voice logic per site, which did not scale.
- Generic browser automation, which broke under UI drift and auth flows.
- LLM-heavy direct DOM control, which was too unpredictable for production safety.

The key insight was that production reliability required a hard boundary: language understanding can be probabilistic, but execution must be deterministic and policy-constrained.

## Product Vision and Evolution

NINA began as a universal voice command layer for websites via simple script embed. During development, the vision expanded from command routing into a production orchestration system with:

- Page-aware context injection
- Session-aware memory
- Multi-step planner hooks
- Explicit recovery paths for runtime selector failures
- Strong safety policy enforcement

Two assumptions changed materially:

- **Wrong:** static selectors and single-shot parsing would be enough.
- **Right:** LLM parse + deterministic execution yields better trust, debugging, and operational stability.

## Architecture Overview

NINA is implemented as three packages:

- `nina-generator`: builds validated `agent.json` from URL + optional docs/sitemap/manifest.
- `nina-api`: runtime pipeline from transcript to typed instruction.
- `nina-sdk`: browser runtime for voice capture and DOM execution.

### High-Level Data Flow

1. User speaks in browser.
2. SDK transcribes via Web Speech API and collects `page_context` + `session_id`.
3. SDK sends `POST /api/v1/query`.
4. API performs security checks, rate limiting, site config load, intent parse, deterministic resolve, guardrails, auth gating.
5. API returns typed instruction (`navigate`, `search`, `click`, `needs_login`, `no_match`).
6. SDK executes in DOM and updates UI state.
7. If execution fails (e.g., selector drift), SDK reports to `POST /api/v1/report-broken-selector`.
8. API returns recovery instruction via failure decision matrix.

### Core Components

- **Parser**: LLM-based intent extraction into structured schema (`IntentResult`).
- **Resolver**: deterministic mapping to site contract (`ResolvedIntent`).
- **Guardrails**: confidence/risk/semantic/injection checks.
- **Session state**: hybrid memory (semantic + action log + observations).
- **Task planner**: bounded multi-step decomposition and execution flow.
- **Error recovery/healer**: runtime failure handling and selector adaptation paths.

## Why the Architecture Works

NINA’s core strength is constrained autonomy:

- The model does not execute browser actions directly.
- Execution is contract-bound to `agent.json`.
- Every action path is checked for risk and confidence.
- Failure modes are explicit and recoverable, not silent.

This gives the system two critical production properties:

- **Predictability** under model variance.
- **Operational resilience** under frontend drift.

## Agent Architecture (Constrained Orchestration Model)

NINA does not use a multi-agent framework. Instead, it implements a constrained agent pattern with modular handoffs:

- Parser interprets user intent.
- Deterministic modules decide and enforce execution policy.
- Recovery modules handle runtime failures.

### Contracted Handoffs

- `QueryRequest` -> `IntentResult` -> `ResolvedIntent` -> `QueryResponse`
- `SelectorFailureReport` -> recovery decision -> recovery `QueryResponse`

### Loop and Drift Controls

- Iteration caps for multi-step flows
- Stagnation detection
- Retry ceilings
- Queue depth/TTL constraints
- Deterministic contract enforcement with semantic mismatch blocking

## Key Technical Decisions

### 1) Hybrid LLM + Deterministic Execution

**Decision:** Keep LLM in parse-only role; resolve actions deterministically.  
**Why:** Safety, reproducibility, and debuggability in production.  
**Tradeoff:** Less open-ended autonomy.

### 2) Conservative Guardrails

**Decision:** Block low-confidence or mismatched actions instead of guessing.  
**Why:** Incorrect actions are costlier than fallback prompts.  
**Tradeoff:** More `no_match` responses in edge cases.

### 3) Recovery as a First-Class Path

**Decision:** Treat selector/runtime failure as standard behavior with explicit classifier/matrix.  
**Why:** Real websites change; failure recovery determines real-world reliability.  
**Tradeoff:** Higher system complexity.

## Engineering Challenges and Solutions

### Challenge Areas

1. Balancing model flexibility with deterministic safety.
2. Selector drift under UI changes.
3. Auth-gated continuity across redirects.
4. Voice UX latency variability.
5. Ambiguous intent and low-confidence handling.
6. Multi-step execution loop safety.
7. Input/schema inconsistency from upstream sources.
8. Backend-SDK contract consistency over time.

### Solution Pattern

NINA repeatedly applies the same principle: typed contracts + deterministic policy + bounded recovery.

- Schema-first request/response modeling
- Guardrail gating before execution
- Async logging and cache-first hot path
- Session memory and planner kill switches
- Generator normalization and validation pipeline

## AI Architecture

### Model Use

- Primary runtime model: `qwen-qwq-32b` via Groq.
- Usage is optimized for short, structured intent extraction.

### Prompting Strategy

- Trust separation in prompts: high-trust user intent vs low-trust browser snapshot.
- Strict JSON output schema.
- Minimal generation scope to reduce drift.

### RAG / Grounding Strategy

No vector RAG in current implementation. Grounding is provided by:

- `agent.json`
- `page_context`
- AXTree-like browser snapshot context
- short session memory context

### Hallucination and Safety Control

Hallucinations are bounded by design because model outputs are non-executable until deterministic resolver/guardrail approval.

## Voice Architecture

### STT Flow

- Web Speech API in browser
- interim and final transcript events
- final utterance converted into discrete API call

### TTS Flow

There is no synthesized TTS pipeline currently; response voice is represented through UI messages.

### Runtime UX Controls

- Mic state machine
- silence timeout auto-stop
- hotkey capture
- safe fallback messaging
- auth-aware queue replay

## Security Posture

### Implemented Controls

- API keys hashed at rest
- format validation before DB lookup
- rate limiting with Redis/in-memory fallback
- credential phrase detection and blocking
- PII scrubbing in logs
- action risk classification and block policies
- same-origin navigation enforcement

### Security Risk Identified

Secret hygiene requires immediate operational hardening. A key-like value was observed in local `.env`, which indicates rotation and secret-scanning enforcement are necessary.

## Analytics and Observability

NINA tracks:

- scrubbed transcript
- intent type/target
- resolved status
- instruction type
- latency
- recent failures by site

This supports:

- resolution-rate monitoring
- top-intent analysis
- failure-driven tuning of prompts and `agent.json` coverage

Structured JSON logs and health endpoints provide baseline observability; full distributed tracing/APM integration is a clear next step.

## Deployment Architecture

Current deployment pattern:

- FastAPI in Docker
- Nginx reverse proxy + TLS (Certbot)
- Supabase backing store
- optional Redis cache layer
- SDK built with esbuild and distributed separately

This keeps runtime and packaging concerns cleanly separated while supporting local degraded modes and production-hosted operation.

## Measured and Inferred Outcomes

### Evidenced in Code and Docs

- End-to-end eval suites and categorized tests are in place.
- Accuracy references in repo docs/scripts are in the 90%+ range by mode.
- Query latency is captured as a first-class field.
- Resolution rate is surfaced via analytics endpoints.

### Still Needed for Executive Reporting

- Production request volumes and active user metrics
- p50/p95/p99 latency by environment
- Incident postmortems with severity/timeline
- explicit CI/CD pipeline evidence

## Technical Debt and Risk Register

1. Advanced visual/healing modules are partially scaffolded and not fully hot-path integrated.
2. Potential source-vs-dist SDK artifact drift requires stricter release checks.
3. In-memory fallbacks limit horizontal consistency at larger scale.
4. Secret management process needs stricter enforcement.

## What We Would Redesign Today

- Single shared schema source for API-SDK contracts with CI gate.
- Production activation of multi-provider LLM failover.
- Externalized session state as a default scaling baseline.
- Feature-flagged rollout and confidence policies for healing/visual recovery.
- Stronger observability stack (trace IDs, APM, SLO dashboards).

## Lessons Learned

1. Model intelligence must be bounded by deterministic policy to be production-trustworthy.
2. Failure recovery UX is core product architecture, not an optional add-on.
3. Input normalization quality controls runtime reliability more than expected.
4. Typed execution contracts are a major leverage point for safety and speed.
5. Operational discipline (secrets, artifact consistency, CI checks) is as important as model quality.

## Roadmap

### Near-Term

- Productionize healing and visual recovery loops behind rollout controls.
- Expand multilingual/domain-specific intent quality.
- Improve quality dashboards and category-level analytics.

### Mid-Term

- Distributed session architecture by default.
- Multi-provider model routing and failover.
- Contract-level release gating for SDK/API parity.

### Long-Term

- Multi-region low-latency runtime
- enterprise governance (key management, audit controls, abuse controls)
- mature SRE-quality reliability and observability posture

## Appendix: Clarifications Required for Publication-Grade External Report

- [CLARIFY: Production user/request metrics snapshots are not present in repository artifacts.]
- [CLARIFY: Incident timeline/postmortem records are not present in repository artifacts.]
- [CLARIFY: SQL migration/index definitions are not fully visible in this snapshot.]
- [CLARIFY: CI/CD pipeline config evidence is not visible in this snapshot.]
