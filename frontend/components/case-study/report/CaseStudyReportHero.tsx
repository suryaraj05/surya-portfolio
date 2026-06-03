import Link from "next/link";

import { Container } from "@/components/layout/container";
import type { CaseStudyKicker } from "@/lib/case-study/types";
import type { SystemMetrics } from "@/lib/project-metrics";

type CaseStudyReportHeroProps = {
  title: string;
  subtitle?: string;
  narrativeIntro: string;
  kicker?: CaseStudyKicker[];
  systemProfile: SystemMetrics;
};

export function CaseStudyReportHero({
  title,
  subtitle,
  narrativeIntro,
  systemProfile
}: CaseStudyReportHeroProps) {
  const profileLine = [
    `${systemProfile.agents} agents`,
    `${systemProfile.services} services`,
    systemProfile.latency,
    systemProfile.deploymentStatus,
    systemProfile.reliability
  ].join(" · ");

  return (
    <header className="border-b border-border/40">
      <Container className="py-14 md:py-20">
        <article className="report-read mx-auto">
          <Link
            href="/projects"
            className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
          >
            ← Engineering reports
          </Link>
          <h1 className="mt-10 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.06] tracking-[-0.03em]">
            {title}
          </h1>
          {subtitle ? <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{subtitle}</p> : null}
          <p className="mt-8 text-[1.05rem] leading-[1.85] text-foreground/90">{narrativeIntro}</p>
          <p className="mt-10 font-mono text-[0.72rem] leading-relaxed text-muted-foreground">{profileLine}</p>
        </article>
      </Container>
    </header>
  );
}
