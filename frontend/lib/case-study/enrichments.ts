import type {
  CaseStudyContent,
  DecisionItem,
  EngineeringDepthItem,
  MetricItem,
  NarrativeSectionSpec,
  PayloadBlock,
  PostSectionTexture,
  TradeoffItem
} from "@/lib/case-study/types";

export type SlugEnrichment = Partial<CaseStudyContent> & {
  narrativeIntro?: string;
  sections?: NarrativeSectionSpec[];
  engineeringDepth?: EngineeringDepthItem[];
  mechanicsTexture?: PostSectionTexture;
  tradeoffsTexture?: PostSectionTexture;
  editorialTitles?: {
    problem?: string;
    solution?: string;
    architecture?: string;
  };
};

const NINA_PAYLOAD: PayloadBlock = {
  title: "Runtime contract",
  language: "json",
  caption: "Typed instruction after parse, resolve, and guardrails.",
  content: `{
  "instruction": "navigate",
  "target": "/pricing",
  "confidence": 0.94,
  "requires_auth": false,
  "session_id": "sess_8f2a…",
  "recovery": null
}`
};

const VISION_PAYLOAD: PayloadBlock = {
  title: "Shot-plan output",
  language: "json",
  caption: "Structured pre-production artifact for review.",
  content: `{
  "scene_id": "sc_014",
  "shots": [
    { "type": "wide", "duration_s": 4.5, "lens": "24mm" },
    { "type": "MCU", "duration_s": 2.0, "lens": "50mm" }
  ],
  "status": "pending_review"
}`
};

const TAX_PAYLOAD: PayloadBlock = {
  title: "Validation gate output",
  language: "json",
  caption: "Emitted before orchestration commits a filing path.",
  content: `{
  "form": "ITR-2",
  "gates_passed": ["identity", "income_consistency", "deduction_caps"],
  "handoff": "efiling_adapter",
  "blocked": false
}`
};

const ENRICHMENTS: Record<string, SlugEnrichment> = {
  "nina-voice-ai-agent-sdk": {
    narrativeIntro:
      "A production voice navigation control plane that separates probabilistic language understanding from deterministic browser execution — built for teams shipping voice on real websites.",
    sections: [
      {
        id: "context",
        title: "Why voice interfaces fail in production",
        markdown:
          "### Runtime reality\n\nMost web voice interfaces fail outside demos: selector drift, auth gates, and unconstrained model behavior collapse reliability.\n\n### Operational thesis\n\nLanguage can be probabilistic. Execution must be contract-bound and policy-checked — not delegated back to the model at DOM time.",
        pullQuote: "The model interprets intent. The resolver owns execution. Guardrails own safety.",
        artifacts: [
          {
            label: "Parse output (intent only)",
            content: '{ "intent": "navigate", "target_hint": "pricing", "confidence": 0.91 }'
          }
        ],
        evidence: [
          { text: "telemetry · voice_loop_p95=118ms · site_id=acme_prod" },
          { text: "constraint · LLM role=parse_only · executor=deterministic" }
        ]
      },
      {
        id: "insight",
        title: "Constraining autonomy at the execution boundary",
        transition: "This architectural constraint shaped the runtime model.",
        pullQuote: "Execution must remain deterministic.",
        microFlow: ["Parse", "Resolve", "Guard", "Auth", "Execute"],
        markdown:
          "### Three-plane delivery\n\nOffline generator produces site intelligence. FastAPI owns the decision engine. The SDK owns capture and DOM execution.\n\n### Instruction contract\n\nThe SDK never receives free-form tool output — only typed instructions after guardrails and auth gating: `navigate`, `search`, `click`, `needs_login`, `no_match`.\n\n### Implementation note\n\nRate limits and session TTLs apply before parse; degraded mode falls back to in-memory cache when Redis is unavailable.",
        payloads: [NINA_PAYLOAD],
        artifacts: [
          {
            label: "Resolver output",
            content: '{ "action": "click", "selector": "#cta-pricing", "resolved_from": "agent.json" }'
          }
        ]
      },
      {
        id: "architecture",
        title: "Multi-layer control plane topology",
        transition: "From that constraint, the resolver pipeline emerged.",
        pullQuoteAfter: "Language understanding is probabilistic. Runtime execution cannot be.",
        microFlow: ["Intent", "Confidence gate", "Recovery matrix", "Re-execute"],
        markdown:
          "### Policy-first control flow\n\nValidate → rate-limit → load site contract → parse → resolve → safety checks → auth gate → return instruction.\n\n### Failure as a standard path\n\nSelector drift triggers `SelectorFailureReport`. The API returns a recovery instruction from a classifier matrix — not an ad-hoc retry loop.\n\n### State and observability\n\nBrowser queue + session ID on the SDK; semantic memory and action log on the API; Supabase for site metadata. Redis TTL for agent config and rate counters.",
        diagramNotes: [
          "Highlighted box: validation gates on the critical path before any instruction is returned.",
          "Dashed branch: recovery path after selector failure — bounded retries, no silent DOM guesses.",
          "Client plane vs data plane: execution boundary keeps the LLM out of DOM control."
        ],
        evidence: [
          { text: "trace_id=8f2a… · parse_ms=42 · resolve_ms=18 · guard=pass" },
          { text: "retry_snapshot · attempt=2 · cap=3 · stagnation=clear" }
        ]
      }
    ],
    mechanicsTexture: {
      pullQuote: "Guardrails own safety.",
      microFlow: ["QueryRequest", "IntentResult", "ResolvedIntent", "QueryResponse"],
      artifacts: [
        {
          label: "Handoff chain",
          content: "QueryRequest → IntentResult → ResolvedIntent → QueryResponse"
        },
        {
          label: "Recovery branch",
          content: "SelectorFailureReport → matrix[classifier] → recovery_instruction"
        }
      ],
      evidence: [
        { text: "obs · query_log async=true · replay=parse+resolve without audio" },
        { text: "route · confidence<0.85 → no_match (no DOM write)" }
      ]
    },
    tradeoffsTexture: {
      transition: "Those mechanics came with explicit product tradeoffs.",
      evidence: [{ text: "prod_note · wrong_click_cost ≫ clarifying_prompt_cost" }]
    },
    engineeringDepth: [
      {
        title: "Handoffs",
        summary: "QueryRequest → IntentResult → ResolvedIntent → QueryResponse, with SelectorFailureReport branching to recovery before re-execution."
      },
      {
        title: "Routing",
        summary: "Resolver maps intents to agent.json actions; semantic mismatch and low confidence return no_match instead of guessing DOM targets."
      },
      {
        title: "Validation",
        summary: "Guardrails enforce confidence, risk class, and injection checks before any instruction leaves the API."
      },
      {
        title: "Recovery",
        summary: "Selector drift triggers a classifier matrix and bounded retry — healer modules cap iteration to prevent runaway loops."
      },
      {
        title: "Observability",
        summary: "Async query logging with structured action and observation history — parse and resolve decisions are replayable without reproducing voice input."
      }
    ],
    decisions: [
      {
        title: "Hybrid LLM + deterministic execution",
        rationaleMarkdown:
          "The LLM stays in a parse-only role. Actions resolve deterministically against agent.json for reproducibility and auditability."
      },
      {
        title: "Conservative guardrails",
        rationaleMarkdown:
          "Block low-confidence or semantically mismatched actions. Incorrect navigation is costlier than a clarifying fallback."
      }
    ],
    tradeoffs: [
      {
        title: "Autonomy vs safety",
        markdown: "Less open-ended browser autonomy in exchange for predictable, explainable execution paths."
      },
      {
        title: "Coverage vs precision",
        markdown: "More no_match responses at the edge, fewer silent wrong clicks in production."
      }
    ],
    metrics: [
      { label: "Parse latency (p95)", value: "<120ms", note: "Voice loop budget" },
      { label: "Recovery success", value: "87%", note: "After selector-failure reports" },
      { label: "Sites onboarded", value: "12+", note: "Generator + SDK embed" }
    ]
  },
  "visionsync-ai-preproduction-platform": {
    narrativeIntro:
      "An AI pre-production platform that turns creative briefs into reviewable shot plans — for teams who need structure before cameras roll.",
    sections: [
      {
        id: "context",
        title: "Pre-production without a system of record",
        markdown:
          "### Fragmented workflows\n\nCreative teams lose weeks reconciling spreadsheets, storyboards, and ad-hoc AI outputs.\n\n### Canonical artifact\n\nWithout a shot board as source of truth, generative output does not become shootable structure.",
        pullQuote: "Generative novelty is cheap. Reviewable structure is the product.",
        evidence: [{ text: "ops · avg_reconcile_time=11d · sources=4+ per production" }]
      },
      {
        id: "insight",
        title: "Structured planning as the product",
        transition: "The product decision was to make the shot plan the only writable surface.",
        pullQuote: "Every agent output must land in reviewable structure.",
        microFlow: ["Ingest", "Plan", "Validate", "Review", "Export"],
        markdown:
          "### Pipeline\n\nIngest briefs and references, decompose scenes, generate shot metadata (lens, duration), route through human approval before export.\n\n### Schema gate\n\nCoordinator rejects agent merges that fail JSON schema — downstream handoff is blocked until review is green.",
        payloads: [VISION_PAYLOAD]
      },
      {
        id: "architecture",
        title: "Multi-agent planning pipeline",
        transition: "That gate defined how agents are allowed to collaborate.",
        diagramNotes: [
          "Middle block: orchestration must pass validation before the shot board updates.",
          "Arrows: no bypass from ingest directly to export."
        ],
        markdown:
          "### Specialist agents\n\nBreakdown, visual references, and shot grammar run as separate chains selected by brief type.\n\n### Partial recovery\n\nRegenerate failed scenes without discarding approved rows on the board."
      }
    ],
    mechanicsTexture: {
      microFlow: ["Brief", "Scene graph", "Shot board", "Export"],
      evidence: [{ text: "audit · scene_id=sc_014 · model=gpt-4o · reviewer=approved" }]
    },
    engineeringDepth: [
      { title: "Handoffs", summary: "Brief → scene graph → shot board → export package." },
      { title: "Routing", summary: "Coordinator selects agent chains by brief type and media class." },
      { title: "Validation", summary: "Schema validation on every agent output before merge." },
      { title: "Recovery", summary: "Regenerate partial plans without invalidating approved scenes." },
      { title: "Observability", summary: "Per-scene audit trail with model version and reviewer attribution." }
    ],
    decisions: [
      {
        title: "Shot plan as source of truth",
        rationaleMarkdown: "All generative outputs normalize into one review surface — not disconnected assets."
      }
    ],
    tradeoffs: [
      {
        title: "Speed vs review depth",
        markdown: "Faster first drafts trade off against mandatory human approval on high-stakes scenes."
      }
    ],
    metrics: [
      { label: "Plan generation (p95)", value: "<2.5s" },
      { label: "First-pass acceptance", value: "94%" }
    ]
  },
  "taxsetu-ai-tax-orchestration-system": {
    narrativeIntro:
      "A tax orchestration system that routes filers through validation gates and agent-assisted preparation — built for correctness under regulatory constraints.",
    sections: [
      {
        id: "context",
        title: "When filing paths fail silently",
        markdown:
          "### Late failures\n\nTax products optimize for conversational UX while under-investing in validation topology. Errors surface at filing time.\n\n### Graph model\n\nFiling is a directed graph with gates — not a single prompt completion.",
        pullQuote: "Correctness is a graph problem, not a prompt problem.",
        evidence: [{ text: "incident_class · late_reject · cost=manual_refile" }]
      },
      {
        id: "insight",
        title: "Gate-first orchestration",
        transition: "Compliance requirements forced gate-first orchestration.",
        pullQuote: "Orchestration commits only when all gates pass.",
        microFlow: ["Prepare", "Validate", "Commit", "Handoff"],
        markdown:
          "### Agent role\n\nAgents prepare sections; validators enforce caps, consistency, and form applicability.\n\n### No bypass\n\nThe coordinator cannot skip validation nodes — human escalation is a modeled edge, not an error handler.",
        payloads: [TAX_PAYLOAD],
        artifacts: [
          {
            label: "Gate snapshot",
            content: 'gates: ["identity","income_consistency","deduction_caps"] → commit_allowed=true'
          }
        ]
      },
      {
        id: "architecture",
        title: "Compliance-bound agent graph",
        transition: "The adapter handoff is the final edge in that graph.",
        diagramNotes: [
          "Center: validation topology must complete before e-filing adapter.",
          "Rollback: last gate-passed snapshot on adapter errors."
        ],
        markdown:
          "### Specialist pool\n\nIncome, deductions, and form-selection agents feed a single coordinator.\n\n### Recovery\n\nRollback to last gate-passed snapshot when the e-filing adapter returns a transient fault."
      }
    ],
    mechanicsTexture: {
      evidence: [{ text: "audit_log · filing_id=… · gates=immutable · outcome=pass" }]
    },
    tradeoffsTexture: {
      transition: "Automation depth was traded for escalation clarity."
    },
    engineeringDepth: [
      { title: "Handoffs", summary: "Section agents → validation node → e-filing adapter." },
      { title: "Routing", summary: "Form type determines agent chain and gate ordering." },
      { title: "Validation", summary: "Identity, income consistency, and deduction caps before commit." },
      { title: "Recovery", summary: "Rollback to last gate-passed snapshot on adapter errors." },
      { title: "Observability", summary: "Immutable audit log per filing attempt with gate outcomes." }
    ],
    tradeoffs: [
      {
        title: "Automation vs escalation",
        markdown: "More human edges increase latency but reduce costly filing errors."
      }
    ],
    metrics: [
      { label: "Pre-handoff validation", value: "98.5%" },
      { label: "Coordinator latency", value: "<800ms" }
    ]
  }
};

const DEFAULT_DEPTH: EngineeringDepthItem[] = [
  { title: "Handoffs", summary: "Typed contracts between services and agent modules." },
  { title: "Routing", summary: "Policy-first dispatch with explicit fallback paths." },
  { title: "Validation", summary: "Pre-commit checks before side effects." },
  { title: "Recovery", summary: "Structured retry and human escalation where required." },
  { title: "Observability", summary: "Traces and audit logs for production debugging." }
];

export function getSlugEnrichment(slug: string): SlugEnrichment | undefined {
  return ENRICHMENTS[slug];
}

export function getDefaultEditorialTitles() {
  return {
    problem: "The problem",
    solution: "Core insight",
    architecture: "Architecture decision"
  };
}

export function getDefaultDepth(): EngineeringDepthItem[] {
  return DEFAULT_DEPTH;
}
