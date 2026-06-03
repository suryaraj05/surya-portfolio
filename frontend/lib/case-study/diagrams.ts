import type { DiagramSpec } from "@/lib/case-study/types";

const MARKER = `<defs>
  <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto">
    <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" opacity="0.3"/>
  </marker>
</defs>`;

function wrapSvg(inner: string, viewBox: string, caption?: string): DiagramSpec {
  return {
    type: "svgInline",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1">${MARKER}${inner}</svg>`,
    caption
  };
}

function slugKind(slug: string): "nina" | "vision" | "tax" | "generic" {
  if (slug.includes("nina") || slug.includes("voice")) return "nina";
  if (slug.includes("vision")) return "vision";
  if (slug.includes("tax")) return "tax";
  return "generic";
}

/** Single flagship topology — compact, information-dense */
function compactTopology(slug: string): string {
  if (slugKind(slug) === "nina") {
    return `
      <text x="24" y="28" fill="currentColor" font-size="9" stroke="none" opacity="0.45" letter-spacing="0.1em">VOICE CONTROL PLANE</text>
      <rect x="24" y="44" width="752" height="56" rx="8" stroke-opacity="0.15" fill="currentColor" fill-opacity="0.02"/>
      <text x="40" y="78" fill="currentColor" font-size="9" stroke="none" opacity="0.55">SDK · capture · execute</text>
      <rect x="24" y="112" width="752" height="72" rx="8" stroke-opacity="0.2" fill="currentColor" fill-opacity="0.03"/>
      <rect x="44" y="128" width="88" height="40" rx="6" stroke-opacity="0.25"/>
      <rect x="148" y="128" width="88" height="40" rx="6" stroke-opacity="0.25"/>
      <rect x="252" y="128" width="120" height="40" rx="6" fill="currentColor" fill-opacity="0.05" stroke-opacity="0.3"/>
      <rect x="388" y="128" width="88" height="40" rx="6" stroke-opacity="0.25"/>
      <rect x="492" y="128" width="100" height="40" rx="6" stroke-opacity="0.25"/>
      <text x="56" y="154" fill="currentColor" font-size="8" stroke="none" opacity="0.65">parse</text>
      <text x="160" y="154" fill="currentColor" font-size="8" stroke="none" opacity="0.65">resolve</text>
      <text x="276" y="154" fill="currentColor" font-size="8" stroke="none" opacity="0.7">gates</text>
      <text x="400" y="154" fill="currentColor" font-size="8" stroke="none" opacity="0.65">auth</text>
      <text x="504" y="154" fill="currentColor" font-size="8" stroke="none" opacity="0.65">instruction</text>
      <path d="M132 148 H148 M240 148 H252 M372 148 H388 M476 148 H492" stroke-opacity="0.25" marker-end="url(#arrow)"/>
      <rect x="24" y="200" width="752" height="48" rx="8" stroke-opacity="0.12" stroke-dasharray="4 6"/>
      <text x="40" y="230" fill="currentColor" font-size="8" stroke="none" opacity="0.45">agent.json · session · observability</text>
      <path d="M400 184 V200" stroke-opacity="0.15" stroke-dasharray="3 5"/>
    `;
  }

  if (slugKind(slug) === "vision") {
    return `
      <text x="24" y="28" fill="currentColor" font-size="9" stroke="none" opacity="0.45">PRE-PRODUCTION PIPELINE</text>
      <rect x="24" y="48" width="200" height="48" rx="8" stroke-opacity="0.2"/>
      <rect x="244" y="48" width="280" height="48" rx="8" stroke-opacity="0.22" fill="currentColor" fill-opacity="0.03"/>
      <rect x="544" y="48" width="232" height="48" rx="8" stroke-opacity="0.2"/>
      <text x="44" y="78" fill="currentColor" font-size="8" stroke="none" opacity="0.6">ingest</text>
      <text x="264" y="78" fill="currentColor" font-size="8" stroke="none" opacity="0.65">agents · validate</text>
      <text x="564" y="78" fill="currentColor" font-size="8" stroke="none" opacity="0.6">shot board</text>
      <path d="M224 72 H244 M524 72 H544" stroke-opacity="0.28" marker-end="url(#arrow)"/>
    `;
  }

  if (slugKind(slug) === "tax") {
    return `
      <text x="24" y="28" fill="currentColor" font-size="9" stroke="none" opacity="0.45">FILING ORCHESTRATION</text>
      <rect x="24" y="48" width="120" height="40" rx="6" stroke-opacity="0.2"/>
      <rect x="160" y="48" width="360" height="40" rx="6" stroke-opacity="0.22" fill="currentColor" fill-opacity="0.03"/>
      <rect x="536" y="48" width="240" height="40" rx="6" stroke-opacity="0.2"/>
      <text x="44" y="74" fill="currentColor" font-size="8" stroke="none" opacity="0.6">agents</text>
      <text x="180" y="74" fill="currentColor" font-size="8" stroke="none" opacity="0.65">validation gates</text>
      <text x="556" y="74" fill="currentColor" font-size="8" stroke="none" opacity="0.6">e-filing handoff</text>
      <path d="M144 68 H160 M520 68 H536" stroke-opacity="0.28" marker-end="url(#arrow)"/>
    `;
  }

  return `
    <rect x="24" y="48" width="752" height="40" rx="8" stroke-opacity="0.18"/>
    <rect x="24" y="104" width="500" height="40" rx="8" stroke-opacity="0.15"/>
    <path d="M524 68 H560" stroke-opacity="0.2" marker-end="url(#arrow)"/>
  `;
}

export function getFlagshipDiagram(slug: string): DiagramSpec {
  return wrapSvg(compactTopology(slug), "0 0 800 260", "Production topology — simplified");
}

/** @deprecated Use getFlagshipDiagram only on architecture section */
export function getHeroDiagramForSlug(slug: string): DiagramSpec | undefined {
  return undefined;
}

export function getSectionDiagramForSlug(slug: string, sectionId: string): DiagramSpec | undefined {
  if (sectionId === "architecture") return getFlagshipDiagram(slug);
  return undefined;
}

export function getRecoveryFlowDiagram(_slug: string): DiagramSpec | undefined {
  return undefined;
}

export function getConfidenceRoutingDiagram(_slug: string): DiagramSpec | undefined {
  return undefined;
}

export function getGhostTopologyMarkup(_slug: string): string {
  return "";
}
