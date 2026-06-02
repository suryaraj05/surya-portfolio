import type { ProjectDTO } from "@/src/contracts/types";
import type {
  CaseStudyContent,
  MediaGallerySpec,
  MetricItem,
  ProjectNavItem,
  TechItem,
  TradeoffItem
} from "@/lib/case-study/types";

import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { ProblemSection, ChallengeSection, TradeoffSection, MetricsSection, LessonsLearned } from "@/components/case-study/CaseStudySections";
import { ArchitectureSection } from "@/components/case-study/ArchitectureSection";
import { DecisionSection } from "@/components/case-study/DecisionSection";
import { TechStackSection } from "@/components/case-study/TechStackSection";
import { MediaGallery } from "@/components/case-study/MediaGallery";
import { RelatedProjects } from "@/components/case-study/RelatedProjects";
import { ProjectNavigation } from "@/components/case-study/ProjectNavigation";
import { Stack } from "@/components/layout/stack";

type CaseStudyDocumentProps = {
  project: ProjectDTO;
  content?: Partial<CaseStudyContent>;
  relatedProjects?: ProjectNavItem[];
  previousProject?: ProjectNavItem;
  nextProject?: ProjectNavItem;
};

function hasMarkdown(markdown?: string | null): markdown is string {
  return Boolean(markdown && markdown.trim().length > 0);
}

function mapTechStack(project: ProjectDTO, content?: Partial<CaseStudyContent>): TechItem[] {
  if (content?.techStack?.length) return content.techStack;
  return (project.tech_stack ?? []).map((name) => ({ name }));
}

function mapMedia(project: ProjectDTO, content?: Partial<CaseStudyContent>): MediaGallerySpec | null {
  if (content?.media) return content.media;

  const images = [
    ...(project.cover_image ? [{ src: project.cover_image, alt: `${project.title} cover` }] : []),
    ...(project.gallery_images ?? []).map((src, idx) => ({
      src,
      alt: `${project.title} gallery image ${idx + 1}`
    }))
  ];

  if (!images.length) return null;
  return { images };
}

function mapMetrics(content?: Partial<CaseStudyContent>): MetricItem[] {
  return content?.metrics ?? [];
}

function mapTradeoffs(content?: Partial<CaseStudyContent>): TradeoffItem[] {
  return content?.tradeoffs ?? [];
}

/**
 * CaseStudyDocument
 * Final composition layer for rendering an engineering case study from ProjectDTO + optional CMS enrichments.
 * Server component safe: no client hooks, no browser-only APIs.
 */
export function CaseStudyDocument({
  project,
  content,
  relatedProjects,
  previousProject,
  nextProject
}: CaseStudyDocumentProps) {
  const problemMarkdown = content?.problemMarkdown ?? project.problem ?? "";
  const challengeMarkdown = content?.challengeMarkdown ?? project.solution ?? "";
  const architectureMarkdown = content?.architectureMarkdown ?? project.architecture ?? "";
  const decisions = content?.decisions ?? [];
  const tradeoffs = mapTradeoffs(content);
  const tech = mapTechStack(project, content);
  const metrics = mapMetrics(content);
  const media = mapMedia(project, content);
  const lessonsMarkdown = content?.lessonsMarkdown ?? "";

  return (
    <Stack size="lg" className="w-full">
      <CaseStudyHero
        title={project.title}
        subtitle={content?.hero?.subtitle ?? project.short_description ?? undefined}
        kicker={content?.hero?.kicker}
        coverDescriptionMarkdown={content?.hero?.coverDescriptionMarkdown ?? undefined}
      />

      {hasMarkdown(problemMarkdown) ? <ProblemSection markdown={problemMarkdown} /> : null}

      {hasMarkdown(challengeMarkdown) ? <ChallengeSection markdown={challengeMarkdown} /> : null}

      {hasMarkdown(architectureMarkdown) || (content?.architectureDiagrams?.length ?? 0) > 0 ? (
        <ArchitectureSection
          markdown={architectureMarkdown}
          diagrams={content?.architectureDiagrams}
        />
      ) : null}

      {decisions.length ? <DecisionSection decisions={decisions} /> : null}

      {tradeoffs.length ? <TradeoffSection items={tradeoffs} /> : null}

      {tech.length ? <TechStackSection tech={tech} /> : null}

      {metrics.length ? <MetricsSection metrics={metrics} /> : null}

      {media ? <MediaGallery spec={media} /> : null}

      {hasMarkdown(lessonsMarkdown) ? <LessonsLearned markdown={lessonsMarkdown} /> : null}

      {relatedProjects?.length ? (
        <RelatedProjects projects={relatedProjects} currentSlug={project.slug} />
      ) : null}

      {previousProject || nextProject ? (
        <ProjectNavigation previous={previousProject} next={nextProject} />
      ) : null}
    </Stack>
  );
}

