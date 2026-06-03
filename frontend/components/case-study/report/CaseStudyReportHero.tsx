import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { getGhostTopologyMarkup } from "@/lib/case-study/diagrams";
import type { CaseStudyKicker } from "@/lib/case-study/types";
import type { SystemMetrics } from "@/lib/project-metrics";
import { cn } from "@/lib/utils";

import { ReportReveal } from "./ReportMotion";
import { SystemProfileBar } from "./SystemProfileBar";

type CaseStudyReportHeroProps = {
  slug: string;
  title: string;
  subtitle?: string;
  narrativeIntro: string;
  kicker?: CaseStudyKicker[];
  systemProfile: SystemMetrics;
};

export function CaseStudyReportHero({
  slug,
  title,
  subtitle,
  narrativeIntro,
  kicker,
  systemProfile
}: CaseStudyReportHeroProps) {
  const ghostMarkup = getGhostTopologyMarkup(slug);

  return (
    <header className="report-hero-flagship relative overflow-hidden border-b border-border/70">
      <div className="hero-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="arch-texture arch-texture-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      {ghostMarkup ? (
        <div
          className="report-hero-ghost pointer-events-none absolute -right-[8%] top-[10%] hidden h-[min(420px,55vw)] w-[min(640px,70vw)] opacity-[0.07] lg:block"
          aria-hidden
          dangerouslySetInnerHTML={{ __html: ghostMarkup }}
        />
      ) : null}

      <Container className="relative py-[clamp(2.75rem,7vw,5.5rem)]">
        <ReportReveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/projects"
                  className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
                >
                  ← Systems index
                </Link>
                {kicker?.map((item) => (
                  <Badge key={item.label} className={cn("font-normal", item.href && "cursor-pointer")}>
                    {item.label}
                  </Badge>
                ))}
              </div>

              <p className="mt-8 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Infrastructure report</p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.04] tracking-[-0.03em] text-foreground">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
              ) : null}
              <p className="mt-6 max-w-[38rem] text-base leading-[1.8] text-foreground/90 md:text-[1.05rem]">{narrativeIntro}</p>
            </div>

            <div className="lg:col-span-4 lg:pb-2">
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">System profile</p>
              <SystemProfileBar metrics={systemProfile} variant="flagship" />
            </div>
          </div>
        </ReportReveal>
      </Container>
    </header>
  );
}
