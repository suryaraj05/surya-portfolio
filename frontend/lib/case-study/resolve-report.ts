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
import { getHeroDiagramForSlug, getSectionDiagramForSlug } from "@/lib/case-study/diagrams";
import {
  getDefaultDepth,
  getDefaultEditorialTitles,
  getSlugEnrichment
} from "@/lib/case-study/enrichments";
import { getSystemMetrics } from "@/lib/project-metrics";

function hasText(value?: string | null): value is string {
  return Boolean(value && value.trim().length > 0);
}

function buildSectionsFromProject(
  project: ProjectDTO,
  enrichment: ReturnType<typeof getSlugEnrichment>
): NarrativeSectionSpec[] {
  if (enrichment?.sections?.length) {
    return enrichment.sections.map((section) => ({
      ...section,
      fullWidthDiagram:
        section.fullWidthDiagram ??
        (section.layout === "diagram-first" ? getSectionDiagramForSlug(project.slug, section.id) : undefined),
      diagram: section.diagram ?? getSectionDiagramForSlug(project.slug, section.id)
    }));
  }

  const titles = { ...getDefaultEditorialTitles(), ...enrichment?.editorialTitles };
  const sections: NarrativeSectionSpec[] = [];

  if (hasText(project.problem)) {
    sections.push({
      id: "context",
      eyebrow: "01 · Context",
      title: titles.problem ?? "Operational context",
      markdown: project.problem!.trim(),
      layout: "split",
      pullQuote: enrichment?.narrativeIntro
        ? undefined
        : "Reliability is designed at the boundary between interpretation and execution."
    });
  }

  if (hasText(project.solution)) {
    sections.push({
      id: "response",
      eyebrow: "02 · Response",
      title: titles.solution ?? "Engineering response",
      markdown: project.solution!.trim(),
      layout: "prose"
    });
  }

  if (hasText(project.architecture)) {
    sections.push({
      id: "architecture",
      eyebrow: "03 · Architecture",
      title: titles.architecture ?? "Control plane architecture",
      markdown: project.architecture!.trim(),
      layout: "diagram-first",
      tone: "dark",
      fullWidthDiagram: getSectionDiagramForSlug(project.slug, "architecture")
    });
  }

  return sections;
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

  const outcomeMetrics: MetricItem[] = [
    ...(enrichment?.metrics ?? content?.metrics ?? []),
    { label: "Agents", value: String(metrics.agents) },
    { label: "Services", value: String(metrics.services) },
    { label: "Reliability", value: metrics.reliability }
  ];

  const decisions: DecisionItem[] = enrichment?.decisions ?? content?.decisions ?? [];
  const tradeoffs: TradeoffItem[] = enrichment?.tradeoffs ?? content?.tradeoffs ?? [];

  return {
    slug: project.slug,
    hero: {
      title: project.title,
      subtitle: content?.hero?.subtitle ?? project.short_description ?? undefined,
      kicker: content?.hero?.kicker ?? [
        { label: "Engineering Report" },
        { label: metrics.deploymentStatus },
        { label: project.featured ? "Featured System" : "Case Study" }
      ],
      narrativeIntro:
        enrichment?.narrativeIntro ??
        (hasText(project.full_description)
          ? project.full_description!.trim()
          : project.short_description?.trim() ??
            "A production engineering case study documenting architecture, constraints, and operational outcomes.")
    },
    heroDiagram: getHeroDiagramForSlug(project.slug),
    sections,
    engineeringDepth: enrichment?.engineeringDepth ?? getDefaultDepth(),
    orchestrationCaption: enrichment?.orchestrationCaption,
    decisions,
    tradeoffs,
    techStack: mapTechStack(project, content),
    outcomeMetrics,
    lessonsMarkdown: content?.lessonsMarkdown
  };
}
