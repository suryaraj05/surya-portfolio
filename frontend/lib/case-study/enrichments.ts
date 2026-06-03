import type {
  ArchitectureCallout,
  CaseStudyContent,
  DecisionItem,
  EngineeringDepthItem,
  MetricItem,
  NarrativeSectionSpec,
  PayloadBlock,
  TradeoffItem
} from "@/lib/case-study/types";

export type SlugEnrichment = Partial<CaseStudyContent> & {
  narrativeIntro?: string;
  sections?: NarrativeSectionSpec[];
  engineeringDepth?: EngineeringDepthItem[];
  orchestrationCaption?: string;
  editorialTitles?: {
    problem?: string;
    solution?: string;
    architecture?: string;
  };
};

const NINA_PAYLOAD: PayloadBlock = {
  title: "Query handoff — runtime contract",
  language: "json",
  caption: "Typed instruction returned after parse → resolve → guardrails",
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
  title: "Shot-plan payload",
  language: "json",
  caption: "Structured pre-production output consumed by review UI",
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
  title: "Filing route validation",
  language: "json",
  caption: "Gate output before orchestration commits a path",
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
      "A production voice navigation control plane that separates probabilistic language understanding from deterministic browser execution — designed for teams shipping voice on real websites.",
    editorialTitles: {
      problem: "Why voice breaks in production",
      solution: "Constraining autonomy at the boundary",
      architecture: "Three-plane system topology"
    },
    sections: [
      {
        id: "context",
        eyebrow: "01 · Context",
        title: "Why voice breaks in production",
        layout: "split",
        markdown:
          "Most web voice interfaces fail outside demos: selector drift, auth gates, and unconstrained model behavior collapse reliability. Teams either rebuild per-site logic or accept brittle automation.\n\nNINA's thesis is operational — language can be probabilistic, but execution must be contract-bound and policy-checked.",
        pullQuote:
          "The model interprets intent. The resolver owns execution. Guardrails own safety.",
        callouts: [
          {
            tag: "Insight",
            title: "Parse vs execute split",
            body: "One LLM parse step maps speech to intent; deterministic modules map intent to typed instructions against agent.json."
          },
          {
            tag: "Constraint",
            title: "Production reality",
            body: "Rate limits, session memory, selector failure reporting, and explicit recovery paths are first-class — not add-ons."
          }
        ]
      },
      {
        id: "response",
        eyebrow: "02 · Response",
        title: "Constraining autonomy at the boundary",
        layout: "prose",
        markdown:
          "NINA ships as three packages: offline generator (site intelligence), FastAPI decision engine (runtime), and embeddable SDK (capture + DOM execution).\n\nThe SDK never receives free-form tool output — only typed instructions (`navigate`, `search`, `click`, `needs_login`, `no_match`) after guardrails and auth gating.",
        payloads: [NINA_PAYLOAD]
      },
      {
        id: "architecture",
        eyebrow: "03 · Architecture",
        title: "Three-plane system topology",
        layout: "diagram-first",
        tone: "dark",
        markdown:
          "Control flow is policy-first: validate → rate-limit → load site contract → parse → resolve → safety checks → auth gate → return instruction. On selector failure, the SDK reports upstream and receives a recovery instruction from a failure decision matrix.",
        callouts: [
          {
            tag: "State",
            title: "Hybrid session memory",
            body: "Browser queue + session ID on the SDK; semantic memory and action log on the API; Supabase for site metadata and telemetry."
          },
          {
            tag: "Cache",
            title: "Redis TTL layers",
            body: "Agent config, rate counters, and session keys with in-memory fallback for degraded mode."
          }
        ]
      }
    ],
    engineeringDepth: [
      {
        title: "Handoff examples",
        summary: "QueryRequest → IntentResult → ResolvedIntent → QueryResponse",
        detail: "SelectorFailureReport branches to recovery matrix before re-entering execution."
      },
      {
        title: "Routing logic",
        summary: "Resolver maps intents to agent.json actions with semantic mismatch blocking.",
        detail: "Low-confidence paths return no_match rather than guessing DOM targets."
      },
      {
        title: "Validation gates",
        summary: "Guardrails enforce confidence, risk class, and injection checks pre-response.",
        detail: "Auth gate emits needs_login when contract requires credentials."
      },
      {
        title: "Failure recovery",
        summary: "Runtime selector drift is a standard path, not an exception.",
        detail: "Healer modules and iteration caps prevent unbounded retry loops."
      },
      {
        title: "Observability",
        summary: "Async query logging with structured action and observation history.",
        detail: "Operational teams can replay parse → resolve decisions without reproducing voice input."
      }
    ],
    orchestrationCaption: "Constrained orchestration — modular handoffs without multi-agent sprawl",
    decisions: [
      {
        title: "Hybrid LLM + deterministic execution",
        rationaleMarkdown:
          "Keep the LLM in a parse-only role. Resolve actions deterministically against agent.json for reproducibility and auditability.",
        codeBlock: {
          language: "text",
          content: "speech → parse(IntentResult) → resolve(ResolvedIntent) → guardrails → instruction"
        }
      },
      {
        title: "Conservative guardrails",
        rationaleMarkdown:
          "Block low-confidence or semantically mismatched actions. Incorrect navigation is costlier than a clarifying fallback.",
        alternativesMarkdown: "Alternative: allow model-proposed selectors — rejected for production safety."
      }
    ],
    tradeoffs: [
      {
        title: "Autonomy vs safety",
        markdown: "Less open-ended browser autonomy in exchange for predictable, explainable execution paths."
      },
      {
        title: "Coverage vs precision",
        markdown: "More `no_match` responses at the edge, fewer silent wrong clicks in production."
      }
    ],
    metrics: [
      { label: "Parse latency (p95)", value: "<120ms", note: "Voice loop budget" },
      { label: "Recovery success", value: "87%", note: "Post selector-failure reports" },
      { label: "Sites onboarded", value: "12+", note: "Generator + SDK embed" }
    ]
  },
  "visionsync-ai-preproduction-platform": {
    narrativeIntro:
      "An AI pre-production platform that turns creative briefs into reviewable shot plans — built for teams who need structure before cameras roll, not another generative demo.",
    editorialTitles: {
      problem: "Pre-production without a system of record",
      solution: "Structured planning as the product",
      architecture: "Multi-agent planning pipeline"
    },
    sections: [
      {
        id: "context",
        eyebrow: "01 · Context",
        title: "Pre-production without a system of record",
        markdown:
          "Creative teams lose weeks reconciling spreadsheets, storyboards, and ad-hoc AI outputs. VisionSync treats the shot plan as the canonical artifact — every agent output must land in a reviewable structure.",
        pullQuote: "Generative novelty is cheap. Reviewable structure is the product.",
        layout: "split"
      },
      {
        id: "response",
        eyebrow: "02 · Response",
        title: "Structured planning as the product",
        markdown:
          "Ingest briefs and references, decompose into scenes, generate shot lists with lens and duration metadata, and route through human approval gates before export.",
        payloads: [VISION_PAYLOAD]
      },
      {
        id: "architecture",
        eyebrow: "03 · Architecture",
        title: "Multi-agent planning pipeline",
        layout: "diagram-first",
        tone: "dark",
        markdown:
          "Specialist agents handle breakdown, visual references, and shot grammar. A coordinator enforces schema validity and blocks downstream handoff until review status is green."
      }
    ],
    engineeringDepth: [
      { title: "Handoff examples", summary: "Brief → scene graph → shot board → export package." },
      { title: "Routing logic", summary: "Coordinator selects agent chains based on brief type and media class." },
      { title: "Validation gates", summary: "Schema validation on every agent output before merge." },
      { title: "Failure recovery", summary: "Partial plan regeneration without discarding approved scenes." },
      { title: "Observability", summary: "Per-scene audit trail with model version and reviewer attribution." }
    ],
    decisions: [
      {
        title: "Shot plan as source of truth",
        rationaleMarkdown: "All generative outputs normalize into a single review surface — not disconnected assets."
      }
    ],
    metrics: [
      { label: "Plan generation", value: "<2.5s", note: "Warm path p95" },
      { label: "Reviewer acceptance", value: "94%", note: "First-pass shot boards" }
    ]
  },
  "taxsetu-ai-tax-orchestration-system": {
    narrativeIntro:
      "A tax orchestration system that routes filers through validation gates and agent-assisted preparation — built for correctness under regulatory constraints, not chat novelty.",
    editorialTitles: {
      problem: "Filing paths fail silently",
      solution: "Gate-first orchestration",
      architecture: "Compliance-bound agent graph"
    },
    sections: [
      {
        id: "context",
        eyebrow: "01 · Context",
        title: "Filing paths fail silently",
        markdown:
          "Tax products often optimize for conversational UX while under-investing in validation topology. TaxSetu models filing as a directed graph with explicit gates before any handoff to e-filing adapters.",
        pullQuote: "Correctness is a graph problem — not a prompt problem.",
        layout: "split"
      },
      {
        id: "response",
        eyebrow: "02 · Response",
        title: "Gate-first orchestration",
        markdown:
          "Agents prepare sections; validators enforce caps, consistency rules, and form applicability; orchestration only commits when all gates pass.",
        payloads: [TAX_PAYLOAD]
      },
      {
        id: "architecture",
        eyebrow: "03 · Architecture",
        title: "Compliance-bound agent graph",
        layout: "diagram-first",
        tone: "dark",
        markdown:
          "Specialist agents for income, deductions, and form selection feed a coordinator that cannot bypass validation nodes. Human escalation is a first-class edge, not an error state."
      }
    ],
    engineeringDepth: [
      { title: "Handoff examples", summary: "Section agents → validation node → efiling adapter." },
      { title: "Routing logic", summary: "Form type determines agent chain and gate ordering." },
      { title: "Validation gates", summary: "Identity, income consistency, and deduction caps before commit." },
      { title: "Failure recovery", summary: "Rollback to last gate-passed snapshot on adapter errors." },
      { title: "Observability", summary: "Immutable audit log per filing attempt with gate outcomes." }
    ],
    metrics: [
      { label: "Validation pass rate", value: "98.5%", note: "Pre-handoff" },
      { label: "Orchestration latency", value: "<800ms", note: "Coordinator path" }
    ]
  }
};

const DEFAULT_DEPTH: EngineeringDepthItem[] = [
  { title: "Handoff examples", summary: "Typed contracts between services and agent modules." },
  { title: "Routing logic", summary: "Policy-first dispatch with explicit fallback paths." },
  { title: "Validation gates", summary: "Pre-commit checks before side effects." },
  { title: "Failure recovery", summary: "Structured retry and human escalation edges." },
  { title: "Observability", summary: "Traces and audit logs for production debugging." }
];

export function getSlugEnrichment(slug: string): SlugEnrichment | undefined {
  return ENRICHMENTS[slug];
}

export function getDefaultEditorialTitles() {
  return {
    problem: "Operational context",
    solution: "Engineering response",
    architecture: "Control plane architecture"
  };
}

export function getDefaultDepth(): EngineeringDepthItem[] {
  return DEFAULT_DEPTH;
}
