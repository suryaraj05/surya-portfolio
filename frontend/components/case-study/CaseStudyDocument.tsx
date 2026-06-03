import type { ProjectDTO } from "@/src/contracts/types";
import type { CaseStudyContent, ProjectNavItem } from "@/lib/case-study/types";

import { MediaGallery } from "@/components/case-study/MediaGallery";
import {
  CaseStudyReportHero,
  EngineeringDepthBand,
  ReportNarrativeSection
} from "@/components/case-study/report";
import { FullWidthDiagram } from "@/components/case-study/report/FullWidthDiagram";
import { ReportContinueReading } from "@/components/case-study/report/ReportContinueReading";
import { ReportProjectNav } from "@/components/case-study/report/ReportProjectNav";
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
 * Elite editorial engineering report — project detail pages only.
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
    <article className="case-study-report case-study-report-elite w-full">
      <CaseStudyReportHero
        slug={report.slug}
        title={report.hero.title}
        subtitle={report.hero.subtitle}
        narrativeIntro={report.hero.narrativeIntro}
        kicker={report.hero.kicker}
        systemProfile={systemProfile}
      />

      {report.heroDiagram ? (
        <FullWidthDiagram spec={report.heroDiagram} className="border-b border-border/50" />
      ) : null}

      {report.sections.map((section, index) => (
        <ReportNarrativeSection key={section.id} section={section} index={index} />
      ))}

      {report.orchestrationCaption &&
      !report.sections.some((s) => s.layout === "visual-led") ? (
        <OrchestrationVisual slug={report.slug} caption={report.orchestrationCaption} />
      ) : null}

      <EngineeringDepthBand items={report.engineeringDepth} recoveryDiagram={report.recoveryDiagram} />

      <ReportDecisions decisions={report.decisions} />

      <ReportTradeoffs items={report.tradeoffs} />

      <ReportTechStack tech={report.techStack} />

      <ReportOutcomeMetrics metrics={report.outcomeMetrics} />

      {media ? (
        <section className="report-section py-12">
          <div className="mx-auto w-full max-w-layout px-content-x">
            <MediaGallery spec={media} />
          </div>
        </section>
      ) : null}

      {content?.lessonsMarkdown || report.lessonsMarkdown ? (
        <ReportLessons markdown={content?.lessonsMarkdown ?? report.lessonsMarkdown ?? ""} />
      ) : null}

      {relatedProjects?.length ? (
        <ReportContinueReading projects={relatedProjects} currentSlug={project.slug} />
      ) : null}

      <ReportProjectNav previous={previousProject} next={nextProject} />
    </article>
  );
}
