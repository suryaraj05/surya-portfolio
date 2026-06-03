import type { ProjectDTO } from "@/src/contracts/types";
import type {
  CaseStudyContent,
  CaseStudyReport,
  DecisionItem,
  MetricItem,
  NarrativeSectionSpec,
  TechItem,
  TradeoffItem
} from "@/lib/case-study/types";
import { getSectionDiagramForSlug } from "@/lib/case-study/diagrams";
import {
  getDefaultDepth,
  getDefaultEditorialTitles,
  getSlugEnrichment
} from "@/lib/case-study/enrichments";
import { getSystemMetrics } from "@/lib/project-metrics";

function hasText(value?: string | null): value is string {
  return Boolean(value && value.trim().length > 0);
}

const CHAPTER_EYEBROWS: Record<string, string> = {
  context: "01 · Problem",
  insight: "02 · Core insight",
  response: "02 · Core insight",
  architecture: "03 · Architecture",
  mechanics: "04 · Operations"
};

function enrichSection(project: ProjectDTO, section: NarrativeSectionSpec): NarrativeSectionSpec {
  const eyebrow = section.eyebrow ?? CHAPTER_EYEBROWS[section.id];
  const diagram =
    section.id === "architecture" ? section.diagram ?? getSectionDiagramForSlug(project.slug, "architecture") : undefined;

  return {
    ...section,
    eyebrow,
    layout: "prose",
    density: undefined,
    microNotes: undefined,
    annotations: undefined,
    callouts: undefined,
    fullWidthDiagram: undefined,
    diagram,
    payloads: section.id === "response" || section.id === "insight" ? section.payloads?.slice(0, 1) : undefined
    // preserve transition, microFlow, artifacts, evidence, diagramNotes, pullQuoteAfter from enrichment
  };
}

function buildSectionsFromProject(
  project: ProjectDTO,
  enrichment: ReturnType<typeof getSlugEnrichment>
): NarrativeSectionSpec[] {
  if (enrichment?.sections?.length) {
    return enrichment.sections.map((section) => enrichSection(project, section));
  }

  const titles = { ...getDefaultEditorialTitles(), ...enrichment?.editorialTitles };
  const sections: NarrativeSectionSpec[] = [];

  if (hasText(project.problem)) {
    sections.push({
      id: "context",
      title: titles.problem ?? "The problem",
      markdown: project.problem!.trim()
    });
  }

  if (hasText(project.solution)) {
    sections.push({
      id: "insight",
      title: titles.solution ?? "Core insight",
      markdown: project.solution!.trim()
    });
  }

  if (hasText(project.architecture)) {
    sections.push({
      id: "architecture",
      title: titles.architecture ?? "Architecture decision",
      markdown: project.architecture!.trim()
    });
  }

  return sections.map((s) => enrichSection(project, s));
}

function mapTechStack(project: ProjectDTO, content?: Partial<CaseStudyContent>): TechItem[] {
  if (content?.techStack?.length) return content.techStack;
  return (project.tech_stack ?? []).map((name) => ({ name }));
}

export function resolveCaseStudyReport(
  project: ProjectDTO,
  content?: Partial<CaseStudyContent>
): CaseStudyReport {
  const enrichment = getSlugEnrichment(project.slug);
  const metrics = getSystemMetrics(project.slug, project.tech_stack ?? []);
  const sections = buildSectionsFromProject(project, enrichment);

  const outcomeMetrics: MetricItem[] = enrichment?.metrics ?? content?.metrics ?? [];

  const decisions: DecisionItem[] = enrichment?.decisions ?? content?.decisions ?? [];
  const tradeoffs: TradeoffItem[] = enrichment?.tradeoffs ?? content?.tradeoffs ?? [];

  return {
    slug: project.slug,
    hero: {
      title: project.title,
      subtitle: content?.hero?.subtitle ?? project.short_description ?? undefined,
      narrativeIntro:
        enrichment?.narrativeIntro ??
        (hasText(project.full_description)
          ? project.full_description!.trim()
          : project.short_description?.trim() ??
            "A production engineering case study documenting how the system was designed, built, and operated.")
    },
    sections,
    engineeringDepth: enrichment?.engineeringDepth ?? getDefaultDepth(),
    decisions,
    tradeoffs,
    techStack: mapTechStack(project, content),
    outcomeMetrics,
    lessonsMarkdown: content?.lessonsMarkdown,
    mechanicsTexture: enrichment?.mechanicsTexture,
    tradeoffsTexture: enrichment?.tradeoffsTexture
  };
}
