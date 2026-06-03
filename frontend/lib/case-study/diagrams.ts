import type { DiagramSpec } from "@/lib/case-study/types";

const MARKER = `<defs>
  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
    <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.35"/>
  </marker>
</defs>`;

function wrapSvg(inner: string, viewBox = "0 0 1200 640", caption?: string): DiagramSpec {
  return {
    type: "svgInline",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.1" class="report-topology-svg">${MARKER}${inner}</svg>`,
    caption
  };
}

function ninaTopology(): string {
  return `
  <rect x="32" y="28" width="1136" height="584" rx="24" stroke-opacity="0.12"/>
  <text x="56" y="64" fill="currentColor" font-size="11" stroke="none" letter-spacing="0.12em" opacity="0.45">PRODUCTION TOPOLOGY · NINA</text>

  <!-- Client plane -->
  <rect x="56" y="88" width="1088" height="108" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <text x="80" y="112" fill="currentColor" font-size="10" stroke="none" opacity="0.4">CLIENT PLANE</text>
  <rect x="88" y="128" width="168" height="52" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
  <rect x="280" y="128" width="168" height="52" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
  <rect x="472" y="128" width="168" height="52" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
  <text x="118" y="160" fill="currentColor" font-size="11" stroke="none" opacity="0.75">Voice capture</text>
  <text x="310" y="160" fill="currentColor" font-size="11" stroke="none" opacity="0.75">Session queue</text>
  <text x="502" y="160" fill="currentColor" font-size="11" stroke="none" opacity="0.75">DOM executor</text>

  <!-- Control plane -->
  <rect x="56" y="212" width="1088" height="200" rx="14" fill="currentColor" fill-opacity="0.03" stroke-opacity="0.18"/>
  <text x="80" y="236" fill="currentColor" font-size="10" stroke="none" opacity="0.4">CONTROL PLANE</text>
  <rect x="88" y="256" width="140" height="64" rx="10" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.32"/>
  <rect x="252" y="256" width="140" height="64" rx="10" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.32"/>
  <rect x="416" y="256" width="140" height="64" rx="10" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.32"/>
  <rect x="580" y="256" width="180" height="64" rx="10" fill="currentColor" fill-opacity="0.08" stroke-opacity="0.38"/>
  <rect x="784" y="256" width="160" height="64" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
  <rect x="964" y="256" width="148" height="64" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
  <text x="108" y="294" fill="currentColor" font-size="10" stroke="none" opacity="0.8">Parse</text>
  <text x="272" y="294" fill="currentColor" font-size="10" stroke="none" opacity="0.8">Resolve</text>
  <text x="436" y="294" fill="currentColor" font-size="10" stroke="none" opacity="0.8">Guardrails</text>
  <text x="600" y="294" fill="currentColor" font-size="10" stroke="none" opacity="0.85">Validation gates</text>
  <text x="804" y="294" fill="currentColor" font-size="10" stroke="none" opacity="0.8">Auth gate</text>
  <text x="984" y="294" fill="currentColor" font-size="10" stroke="none" opacity="0.8">Instruction</text>

  <path class="trace-line" d="M228 288 H252 M392 288 H416 M556 288 H580 M740 288 H784 M944 288 H964" stroke-opacity="0.35" marker-end="url(#arrow)"/>

  <!-- Validation layer highlight -->
  <rect x="572" y="332" width="196" height="36" rx="8" stroke-dasharray="4 6" stroke-opacity="0.25" fill="currentColor" fill-opacity="0.04"/>
  <text x="592" y="355" fill="currentColor" font-size="9" stroke="none" opacity="0.5">confidence · risk · injection checks</text>

  <!-- Recovery path -->
  <path class="trace-line trace-recovery" d="M1040 320 C1040 380 920 400 820 420 C720 440 400 440 320 400" stroke-opacity="0.22" stroke-dasharray="6 8"/>
  <text x="720" y="448" fill="currentColor" font-size="9" stroke="none" opacity="0.4">recovery matrix ← selector failure report</text>

  <!-- Data plane -->
  <rect x="56" y="428" width="1088" height="108" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <text x="80" y="452" fill="currentColor" font-size="10" stroke="none" opacity="0.4">DATA PLANE</text>
  <rect x="88" y="468" width="220" height="52" rx="10" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
  <rect x="332" y="468" width="220" height="52" rx="10" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
  <rect x="576" y="468" width="220" height="52" rx="10" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
  <rect x="820" y="468" width="292" height="52" rx="10" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
  <text x="120" y="500" fill="currentColor" font-size="10" stroke="none" opacity="0.65">agent.json</text>
  <text x="364" y="500" fill="currentColor" font-size="10" stroke="none" opacity="0.65">Redis cache</text>
  <text x="608" y="500" fill="currentColor" font-size="10" stroke="none" opacity="0.65">Session store</text>
  <text x="852" y="500" fill="currentColor" font-size="10" stroke="none" opacity="0.65">Observability · query logs</text>

  <path class="trace-line" d="M172 196 V212 M360 196 V240 M552 196 V256" stroke-opacity="0.2"/>
  <path class="trace-line" d="M660 320 V428 M400 320 V468" stroke-opacity="0.18"/>
  `;
}

function visionTopology(): string {
  return `
  <rect x="32" y="28" width="1136" height="584" rx="24" stroke-opacity="0.12"/>
  <text x="56" y="64" fill="currentColor" font-size="11" stroke="none" letter-spacing="0.12em" opacity="0.45">PRE-PRODUCTION PIPELINE · VISIONSYNC</text>
  <rect x="56" y="100" width="320" height="420" rx="16" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <text x="80" y="128" fill="currentColor" font-size="10" stroke="none" opacity="0.4">INGEST LAYER</text>
  <rect x="400" y="100" width="360" height="420" rx="16" fill="currentColor" fill-opacity="0.03" stroke-opacity="0.16"/>
  <text x="424" y="128" fill="currentColor" font-size="10" stroke="none" opacity="0.4">AGENT ORCHESTRATION</text>
  <rect x="784" y="100" width="360" height="420" rx="16" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <text x="808" y="128" fill="currentColor" font-size="10" stroke="none" opacity="0.4">REVIEW & EXPORT</text>
  <rect x="88" y="160" width="256" height="48" rx="8" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.25"/>
  <rect x="88" y="228" width="256" height="48" rx="8" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.25"/>
  <rect x="432" y="160" width="140" height="56" rx="8" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.3"/>
  <rect x="592" y="160" width="140" height="56" rx="8" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.3"/>
  <rect x="432" y="240" width="296" height="72" rx="10" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
  <text x="452" y="284" fill="currentColor" font-size="10" stroke="none" opacity="0.55">schema validation gate</text>
  <rect x="816" y="160" width="296" height="120" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
  <text x="836" y="220" fill="currentColor" font-size="11" stroke="none" opacity="0.75">Shot board (canonical)</text>
  <path class="trace-line" d="M376 184 H432 M760 216 H816" stroke-opacity="0.35" marker-end="url(#arrow)"/>
  <path class="trace-line" d="M580 296 V360 H900" stroke-opacity="0.25" stroke-dasharray="5 7"/>
  `;
}

function taxTopology(): string {
  return `
  <rect x="32" y="28" width="1136" height="584" rx="24" stroke-opacity="0.12"/>
  <text x="56" y="64" fill="currentColor" font-size="11" stroke="none" letter-spacing="0.12em" opacity="0.45">FILING ORCHESTRATION · TAXSETU</text>
  <rect x="56" y="120" width="200" height="360" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <rect x="280" y="120" width="640" height="200" rx="14" fill="currentColor" fill-opacity="0.03" stroke-opacity="0.16"/>
  <rect x="280" y="340" width="640" height="140" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.12"/>
  <rect x="944" y="120" width="184" height="360" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <text x="80" y="148" fill="currentColor" font-size="10" stroke="none" opacity="0.4">AGENT POOL</text>
  <text x="304" y="148" fill="currentColor" font-size="10" stroke="none" opacity="0.4">VALIDATION TOPOLOGY</text>
  <text x="968" y="148" fill="currentColor" font-size="10" stroke="none" opacity="0.4">E-FILING</text>
  <rect x="304" y="172" width="120" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.25"/>
  <rect x="440" y="172" width="120" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.25"/>
  <rect x="576" y="172" width="120" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.25"/>
  <rect x="712" y="172" width="180" height="44" rx="8" fill="currentColor" fill-opacity="0.08" stroke-opacity="0.32"/>
  <text x="324" y="200" fill="currentColor" font-size="9" stroke="none" opacity="0.7">identity</text>
  <text x="460" y="200" fill="currentColor" font-size="9" stroke="none" opacity="0.7">income</text>
  <text x="596" y="200" fill="currentColor" font-size="9" stroke="none" opacity="0.7">deductions</text>
  <text x="732" y="200" fill="currentColor" font-size="9" stroke="none" opacity="0.75">commit gate</text>
  <path class="trace-line" d="M256 200 H280 M424 194 H440 M560 194 H576 M696 194 H712" stroke-opacity="0.3" marker-end="url(#arrow)"/>
  <path class="trace-line trace-recovery" d="M892 216 H944" stroke-opacity="0.28" marker-end="url(#arrow)"/>
  <rect x="304" y="368" width="600" height="72" rx="10" stroke-dasharray="5 8" stroke-opacity="0.2" fill="currentColor" fill-opacity="0.03"/>
  <text x="324" y="412" fill="currentColor" font-size="10" stroke="none" opacity="0.5">rollback snapshot · human escalation edge</text>
  `;
}

function genericTopology(): string {
  return `
  <rect x="32" y="28" width="1136" height="584" rx="24" stroke-opacity="0.12"/>
  <text x="56" y="64" fill="currentColor" font-size="11" stroke="none" opacity="0.45">SYSTEM TOPOLOGY</text>
  <rect x="56" y="120" width="1088" height="120" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <rect x="56" y="268" width="720" height="200" rx="14" fill="currentColor" fill-opacity="0.03" stroke-opacity="0.16"/>
  <rect x="800" y="268" width="344" height="200" rx="14" fill="currentColor" fill-opacity="0.02" stroke-opacity="0.14"/>
  <path class="trace-line" d="M600 240 V268 M920 240 V268" stroke-opacity="0.25" marker-end="url(#arrow)"/>
  `;
}

function slugKind(slug: string): "nina" | "vision" | "tax" | "generic" {
  if (slug.includes("nina") || slug.includes("voice")) return "nina";
  if (slug.includes("vision")) return "vision";
  if (slug.includes("tax")) return "tax";
  return "generic";
}

export function getHeroDiagramForSlug(slug: string): DiagramSpec | undefined {
  const kind = slugKind(slug);
  const inner =
    kind === "nina" ? ninaTopology() : kind === "vision" ? visionTopology() : kind === "tax" ? taxTopology() : genericTopology();
  return wrapSvg(inner, "0 0 1200 640", "Multi-layer production topology");
}

export function getRecoveryFlowDiagram(slug: string): DiagramSpec | undefined {
  if (slugKind(slug) !== "nina") return undefined;
  return wrapSvg(
    `
    <text x="48" y="48" fill="currentColor" font-size="11" stroke="none" opacity="0.45">FAILURE RECOVERY MAP</text>
    <rect x="48" y="80" width="200" height="56" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
    <text x="68" y="114" fill="currentColor" font-size="10" stroke="none" opacity="0.75">Selector failure</text>
    <path class="trace-line" d="M248 108 H320" marker-end="url(#arrow)" stroke-opacity="0.35"/>
    <rect x="320" y="80" width="220" height="56" rx="10" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.32"/>
    <text x="340" y="114" fill="currentColor" font-size="10" stroke="none" opacity="0.75">Classifier matrix</text>
    <path class="trace-line" d="M540 108 H612" marker-end="url(#arrow)" stroke-opacity="0.35"/>
    <rect x="612" y="80" width="240" height="56" rx="10" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.28"/>
    <text x="632" y="114" fill="currentColor" font-size="10" stroke="none" opacity="0.75">Recovery instruction</text>
    <path class="trace-line trace-recovery" d="M852 108 H920" marker-end="url(#arrow)" stroke-opacity="0.3"/>
    <rect x="920" y="80" width="200" height="56" rx="10" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
    <text x="940" y="114" fill="currentColor" font-size="10" stroke="none" opacity="0.7">Re-execute DOM</text>
    `,
    "0 0 1200 200",
    "Runtime recovery path"
  );
}

export function getConfidenceRoutingDiagram(slug: string): DiagramSpec | undefined {
  if (slugKind(slug) !== "nina") return undefined;
  return wrapSvg(
    `
    <text x="48" y="40" fill="currentColor" font-size="11" stroke="none" opacity="0.45">CONFIDENCE ROUTING</text>
    <rect x="48" y="60" width="160" height="48" rx="8" stroke-opacity="0.25"/>
    <text x="68" y="90" fill="currentColor" font-size="10" stroke="none" opacity="0.7">intent ≥ 0.85</text>
    <path class="trace-line" d="M208 84 H280" marker-end="url(#arrow)"/>
    <rect x="280" y="60" width="200" height="48" rx="8" fill="currentColor" fill-opacity="0.06" stroke-opacity="0.3"/>
    <text x="300" y="90" fill="currentColor" font-size="10" stroke="none" opacity="0.8">resolve + execute</text>
    <path class="trace-line" d="M128 108 V160 H128" stroke-opacity="0.2"/>
    <rect x="48" y="160" width="160" height="48" rx="8" stroke-dasharray="4 6" stroke-opacity="0.22"/>
    <text x="68" y="190" fill="currentColor" font-size="10" stroke="none" opacity="0.55">intent &lt; threshold</text>
    <path class="trace-line" d="M208 184 H360" marker-end="url(#arrow)"/>
    <rect x="360" y="160" width="180" height="48" rx="8" fill="currentColor" fill-opacity="0.04"/>
    <text x="380" y="190" fill="currentColor" font-size="10" stroke="none" opacity="0.65">no_match fallback</text>
    `,
    "0 0 600 240"
  );
}

export function getSectionDiagramForSlug(slug: string, sectionId: string): DiagramSpec | undefined {
  if (sectionId === "architecture" || sectionId === "orchestration") {
    const d = getHeroDiagramForSlug(slug);
    if (!d) return d;
    return { ...d, caption: "Control plane · validation layers · data plane" };
  }
  if (sectionId === "response" && slugKind(slug) === "nina") {
    return getConfidenceRoutingDiagram(slug);
  }
  return undefined;
}

export function getGhostTopologyMarkup(slug: string): string {
  const d = getHeroDiagramForSlug(slug);
  if (!d || d.type !== "svgInline") return "";
  return d.svgMarkup.replace('class="report-topology-svg"', 'class="report-topology-svg report-topology-ghost"');
}
