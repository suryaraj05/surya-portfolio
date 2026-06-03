import type {
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
          "Most web voice interfaces fail outside demos: selector drift, auth gates, and unconstrained model behavior collapse reliability. Teams either rebuild per-site logic or accept brittle automation.\n\nThe operational thesis is simple — language can be probabilistic, but execution must be contract-bound and policy-checked.",
        pullQuote: "The model interprets intent. The resolver owns execution. Guardrails own safety."
      },
      {
        id: "insight",
        title: "Constraining autonomy at the execution boundary",
        markdown:
          "NINA ships as three packages: an offline generator for site intelligence, a FastAPI decision engine at runtime, and an embeddable SDK for capture and DOM execution.\n\nThe SDK never receives free-form tool output. It receives typed instructions — navigate, search, click, needs_login, no_match — only after guardrails and auth gating pass.",
        payloads: [NINA_PAYLOAD]
      },
      {
        id: "architecture",
        title: "Multi-layer control plane topology",
        markdown:
          "Control flow is policy-first: validate, rate-limit, load the site contract, parse intent, resolve deterministically, run safety checks, apply auth gating, then return an instruction.\n\nWhen selector execution fails, the SDK reports upstream and receives a recovery instruction from a failure decision matrix — a standard path, not an exceptional one.\n\nSession state spans browser queue and session identifiers on the SDK, semantic memory and action logs on the API, and Supabase for site metadata and query telemetry. Redis backs TTL caches for agent config, rate counters, and session keys."
      }
    ],
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
          "Creative teams lose weeks reconciling spreadsheets, storyboards, and ad-hoc AI outputs. Without a canonical artifact, generative novelty does not translate into shootable plans.",
        pullQuote: "Generative novelty is cheap. Reviewable structure is the product."
      },
      {
        id: "insight",
        title: "Structured planning as the product",
        markdown:
          "VisionSync ingests briefs and references, decomposes into scenes, generates shot lists with lens and duration metadata, and routes through human approval before export. Every agent output must normalize into the shot board.",
        payloads: [VISION_PAYLOAD]
      },
      {
        id: "architecture",
        title: "Multi-agent planning pipeline",
        markdown:
          "Specialist agents handle breakdown, visual references, and shot grammar. A coordinator enforces schema validity and blocks downstream handoff until review status is green. Partial regeneration is supported without discarding approved scenes."
      }
    ],
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
          "Tax products often optimize for conversational UX while under-investing in validation topology. Failures surface late — at filing time — when correction is expensive.",
        pullQuote: "Correctness is a graph problem, not a prompt problem."
      },
      {
        id: "insight",
        title: "Gate-first orchestration",
        markdown:
          "Agents prepare sections; validators enforce caps, consistency rules, and form applicability; orchestration commits only when all gates pass.",
        payloads: [TAX_PAYLOAD]
      },
      {
        id: "architecture",
        title: "Compliance-bound agent graph",
        markdown:
          "Specialist agents for income, deductions, and form selection feed a coordinator that cannot bypass validation nodes. Human escalation is a first-class edge. Rollback returns to the last gate-passed snapshot on adapter errors."
      }
    ],
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
