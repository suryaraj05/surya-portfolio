import type { DiagramSpec } from "@/lib/case-study/types";

function wrapSvg(inner: string, viewBox = "0 0 1200 520"): DiagramSpec {
  return {
    type: "svgInline",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.2">${inner}</svg>`,
    caption: undefined
  };
}

export function getHeroDiagramForSlug(slug: string): DiagramSpec | undefined {
  if (slug.includes("nina") || slug.includes("voice")) {
    return wrapSvg(`
      <rect x="40" y="40" width="1120" height="440" rx="20" stroke-opacity="0.2"/>
      <text x="72" y="88" fill="currentColor" font-size="14" opacity="0.5" stroke="none">NINA control plane</text>
      <rect x="80" y="140" width="200" height="88" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="320" y="140" width="200" height="88" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="560" y="140" width="200" height="88" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="800" y="140" width="280" height="88" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <text x="110" y="192" fill="currentColor" font-size="13" stroke="none" opacity="0.7">SDK</text>
      <text x="350" y="192" fill="currentColor" font-size="13" stroke="none" opacity="0.7">Parse</text>
      <text x="590" y="192" fill="currentColor" font-size="13" stroke="none" opacity="0.7">Resolve</text>
      <text x="830" y="192" fill="currentColor" font-size="13" stroke="none" opacity="0.7">Execute</text>
      <path d="M280 184 H320 M520 184 H560 M760 184 H800" stroke-opacity="0.3"/>
      <rect x="200" y="300" width="800" height="120" rx="14" fill="currentColor" fill-opacity="0.03" stroke-opacity="0.18" stroke-dasharray="6 8"/>
      <text x="240" y="368" fill="currentColor" font-size="12" stroke="none" opacity="0.55">agent.json contract · guardrails · recovery matrix</text>
    `);
  }

  if (slug.includes("vision")) {
    return wrapSvg(`
      <rect x="40" y="40" width="1120" height="440" rx="20" stroke-opacity="0.2"/>
      <text x="72" y="88" fill="currentColor" font-size="14" opacity="0.5" stroke="none">VisionSync pre-production pipeline</text>
      <rect x="100" y="160" width="240" height="100" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="400" y="160" width="240" height="100" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="700" y="160" width="360" height="100" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <text x="140" y="218" fill="currentColor" font-size="13" stroke="none" opacity="0.7">Ingest</text>
      <text x="440" y="218" fill="currentColor" font-size="13" stroke="none" opacity="0.7">Plan</text>
      <text x="740" y="218" fill="currentColor" font-size="13" stroke="none" opacity="0.7">Shot board</text>
      <path d="M340 210 H400 M640 210 H700" stroke-opacity="0.3"/>
    `);
  }

  if (slug.includes("tax")) {
    return wrapSvg(`
      <rect x="40" y="40" width="1120" height="440" rx="20" stroke-opacity="0.2"/>
      <text x="72" y="88" fill="currentColor" font-size="14" opacity="0.5" stroke="none">Tax orchestration graph</text>
      <rect x="120" y="150" width="180" height="90" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="360" y="150" width="180" height="90" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="600" y="150" width="180" height="90" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <rect x="840" y="150" width="200" height="90" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.25"/>
      <path d="M300 195 H360 M540 195 H600 M780 195 H840" stroke-opacity="0.3"/>
      <rect x="280" y="300" width="640" height="100" rx="14" fill="currentColor" fill-opacity="0.03" stroke-opacity="0.18"/>
      <text x="320" y="358" fill="currentColor" font-size="12" stroke="none" opacity="0.55">validation gates · filing handoff</text>
    `);
  }

  return wrapSvg(`
    <rect x="40" y="40" width="1120" height="440" rx="20" stroke-opacity="0.2"/>
    <rect x="120" y="160" width="960" height="72" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
    <rect x="120" y="260" width="640" height="72" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
    <rect x="120" y="360" width="720" height="72" rx="12" fill="currentColor" fill-opacity="0.04" stroke-opacity="0.22"/>
  `);
}

export function getSectionDiagramForSlug(slug: string, sectionId: string): DiagramSpec | undefined {
  if (sectionId !== "architecture" && sectionId !== "orchestration") return undefined;
  const hero = getHeroDiagramForSlug(slug);
  if (!hero || hero.type !== "svgInline") return hero;
  return {
    ...hero,
    caption: sectionId === "orchestration" ? "Orchestration and handoff boundaries" : "System topology"
  };
}
