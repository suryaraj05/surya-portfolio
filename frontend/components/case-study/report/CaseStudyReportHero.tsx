import Link from "next/link";

import { SystemMotif } from "@/components/editorial/SystemMotif";
import { Container } from "@/components/layout/container";
import type { SystemMetrics } from "@/lib/project-metrics";

type CaseStudyReportHeroProps = {
  title: string;
  subtitle?: string;
  narrativeIntro: string;
  systemProfile: SystemMetrics;
};

export function CaseStudyReportHero({ title, subtitle, narrativeIntro, systemProfile }: CaseStudyReportHeroProps) {
  const profileLine = [
    `${systemProfile.agents} agents`,
    `${systemProfile.services} services`,
    systemProfile.latency,
    systemProfile.deploymentStatus
  ].join(" · ");

  return (
    <header className="report-hero-cinematic">
      <div className="sys-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="sys-topology-field pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative py-[clamp(4rem,12vw,8rem)]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-end">
          <article className="report-read mx-auto lg:mx-0">
            <Link href="/projects" className="sys-meta transition hover:text-foreground">
              ← Systems index
            </Link>
            <p className="sys-meta mt-8 sys-meta-signal">Engineering report · {profileLine}</p>
            <h1 className="mt-8 font-display text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.04] tracking-[-0.04em]">
              {title}
            </h1>
            {subtitle ? <p className="mt-6 text-lg text-muted-foreground">{subtitle}</p> : null}
            <p className="editorial-signature mt-8">A flagship infrastructure case study.</p>
            <p className="mt-8 text-[1.05rem] leading-[1.85] text-foreground/90">{narrativeIntro}</p>
          </article>
          <div className="hidden lg:block">
            <SystemMotif variant="compact" />
          </div>
        </div>
      </Container>
    </header>
  );
}
