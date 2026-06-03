import type { ProjectDTO } from "@/src/contracts/types";
import type { CaseStudyContent, ProjectNavItem } from "@/lib/case-study/types";

import { MediaGallery } from "@/components/case-study/MediaGallery";
import { RelatedProjects } from "@/components/case-study/RelatedProjects";
import { ProjectNavigation } from "@/components/case-study/ProjectNavigation";
import {
  CaseStudyReportHero,
  EngineeringDepthBand,
  ReportNarrativeSection
} from "@/components/case-study/report";
import {
  OrchestrationVisual,
  ReportDecisions,
  ReportLessons,
  ReportOutcomeMetrics,
  ReportTechStack,
  ReportTradeoffs
} from "@/components/case-study/report/ReportSupportingSections";
import { resolveCaseStudyReport } from "@/lib/case-study/resolve-report";
import { getSystemMetrics } from "@/lib/project-metrics";

type CaseStudyDocumentProps = {
  project: ProjectDTO;
  content?: Partial<CaseStudyContent>;
  relatedProjects?: ProjectNavItem[];
  previousProject?: ProjectNavItem;
  nextProject?: ProjectNavItem;
};

function mapMedia(project: ProjectDTO, content?: Partial<CaseStudyContent>) {
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

/**
 * Premium engineering report layout for project detail pages only.
 */
export function CaseStudyDocument({
  project,
  content,
  relatedProjects,
  previousProject,
  nextProject
}: CaseStudyDocumentProps) {
  const report = resolveCaseStudyReport(project, content);
  const systemProfile = getSystemMetrics(project.slug, project.tech_stack ?? []);
  const media = mapMedia(project, content);

  return (
    <article className="case-study-report w-full animate-fade-in motion-reduce:animate-none">
      <CaseStudyReportHero
        title={report.hero.title}
        subtitle={report.hero.subtitle}
        narrativeIntro={report.hero.narrativeIntro}
        kicker={report.hero.kicker}
        systemProfile={systemProfile}
        heroDiagram={report.heroDiagram}
      />

      {report.sections.map((section, index) => (
        <ReportNarrativeSection key={section.id} section={section} index={index} />
      ))}

      {report.orchestrationCaption &&
      !report.sections.some((s) => s.layout === "diagram-first") ? (
        <OrchestrationVisual slug={report.slug} caption={report.orchestrationCaption} />
      ) : null}

      <EngineeringDepthBand items={report.engineeringDepth} />

      <ReportDecisions decisions={report.decisions} />

      <ReportTradeoffs items={report.tradeoffs} />

      <ReportTechStack tech={report.techStack} />

      <ReportOutcomeMetrics metrics={report.outcomeMetrics} />

      {media ? (
        <section className="report-section py-section-tight">
          <div className="mx-auto w-full max-w-layout px-content-x">
            <MediaGallery spec={media} />
          </div>
        </section>
      ) : null}

      {content?.lessonsMarkdown || report.lessonsMarkdown ? (
        <ReportLessons markdown={content?.lessonsMarkdown ?? report.lessonsMarkdown ?? ""} />
      ) : null}

      {relatedProjects?.length ? (
        <div className="report-section border-t border-border/60 py-section-tight">
          <RelatedProjects projects={relatedProjects} currentSlug={project.slug} />
        </div>
      ) : null}

      {previousProject || nextProject ? (
        <div className="border-t border-border/60">
          <ProjectNavigation previous={previousProject} next={nextProject} />
        </div>
      ) : null}
    </article>
  );
}
