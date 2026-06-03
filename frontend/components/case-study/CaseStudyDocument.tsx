import type { ProjectDTO } from "@/src/contracts/types";
import type { CaseStudyContent, ProjectNavItem } from "@/lib/case-study/types";

import { CaseStudyReportHero } from "@/components/case-study/report/CaseStudyReportHero";
import { ReportContinueReading } from "@/components/case-study/report/ReportContinueReading";
import { ReportNarrativeSection } from "@/components/case-study/report/ReportNarrativeSection";
import { ReportProjectNav } from "@/components/case-study/report/ReportProjectNav";
import {
  ReportLessons,
  ReportMechanics,
  ReportResults,
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

/**
 * Calm editorial case study — project detail pages only.
 * Problem → insight → architecture → mechanics → tradeoffs → results → lessons.
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

  return (
    <article className="case-study-report w-full">
      <CaseStudyReportHero
        title={report.hero.title}
        subtitle={report.hero.subtitle}
        narrativeIntro={report.hero.narrativeIntro}
        systemProfile={systemProfile}
      />

      {report.sections.map((section) => (
        <ReportNarrativeSection key={section.id} section={section} />
      ))}

      <ReportMechanics items={report.engineeringDepth} />

      <ReportTradeoffs items={report.tradeoffs} decisions={report.decisions} />

      <ReportResults metrics={report.outcomeMetrics} />

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
