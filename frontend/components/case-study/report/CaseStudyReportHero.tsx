import Link from "next/link";

import { FullWidthDiagram } from "@/components/case-study/report/FullWidthDiagram";
import { SystemProfileBar } from "@/components/case-study/report/SystemProfileBar";
import { Container } from "@/components/layout/container";
import { Stack } from "@/components/layout/stack";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import type { CaseStudyKicker } from "@/lib/case-study/types";
import type { DiagramSpec } from "@/lib/case-study/types";
import type { SystemMetrics } from "@/lib/project-metrics";
import { cn } from "@/lib/utils";

type CaseStudyReportHeroProps = {
  title: string;
  subtitle?: string;
  narrativeIntro: string;
  kicker?: CaseStudyKicker[];
  systemProfile: SystemMetrics;
  heroDiagram?: DiagramSpec;
};

export function CaseStudyReportHero({
  title,
  subtitle,
  narrativeIntro,
  kicker,
  systemProfile,
  heroDiagram
}: CaseStudyReportHeroProps) {
  return (
    <>
      <header className="report-hero relative overflow-hidden border-b border-border/70">
        <div className="hero-atmosphere pointer-events-none absolute inset-0" aria-hidden />
        <div className="arch-texture arch-texture-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <Container className="relative py-[clamp(2.5rem,6vw,4.5rem)]">
          <Stack size="lg" className="max-w-[46rem]">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground">
                ← Systems index
              </Link>
              {kicker?.map((item) => (
                <Badge key={item.label} className={cn("font-normal", item.href && "cursor-pointer")}>
                  {item.label}
                </Badge>
              ))}
            </div>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Engineering case study</p>
              <Heading as="h1" size="lg" className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)]">
                {title}
              </Heading>
              {subtitle ? (
                <Text tone="muted" size="lg" className="mt-4 max-w-prose leading-relaxed">
                  {subtitle}
                </Text>
              ) : null}
            </div>

            <p className="max-w-prose text-base leading-relaxed text-foreground/85 md:text-lg">{narrativeIntro}</p>

            <SystemProfileBar metrics={systemProfile} />
          </Stack>
        </Container>
      </header>

      {heroDiagram ? <FullWidthDiagram spec={heroDiagram} className="border-b border-border/60" /> : null}
    </>
  );
}
