import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { RichText } from "@/components/case-study/RichText";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import type { NarrativeSectionSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { ArchitectureCallout } from "./ArchitectureCallout";
import { DarkInversionBand } from "./DarkInversionBand";
import { FullWidthDiagram } from "./FullWidthDiagram";
import { PayloadBlock } from "./PayloadBlock";
import { PullQuote } from "./PullQuote";

type ReportNarrativeSectionProps = {
  section: NarrativeSectionSpec;
  index: number;
};

export function ReportNarrativeSection({ section, index }: ReportNarrativeSectionProps) {
  const isDark = section.tone === "dark";
  const inner = (
    <div
      className={cn(
        "grid gap-8 lg:gap-12",
        section.layout === "split" && "lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,340px)]",
        section.layout === "diagram-first" && "lg:grid-cols-1"
      )}
    >
      <header className={cn(section.layout === "split" && index % 2 === 1 ? "lg:order-2" : undefined)}>
        {section.eyebrow ? (
          <p className={cn("text-[0.65rem] uppercase tracking-[0.16em]", isDark ? "text-white/45" : "text-muted-foreground")}>
            {section.eyebrow}
          </p>
        ) : null}
        <Heading
          as="h2"
          size="md"
          className={cn(
            "mt-3 text-[clamp(1.45rem,2.5vw,2.15rem)]",
            isDark && "text-white"
          )}
          id={section.id}
        >
          {section.title}
        </Heading>
      </header>

      <div
        className={cn(
          "space-y-8",
          section.layout === "split" && index % 2 === 1 ? "lg:order-1" : undefined
        )}
      >
        {section.pullQuote && section.layout !== "split" ? <PullQuote>{section.pullQuote}</PullQuote> : null}

        <RichText
          markdown={section.markdown}
          className={cn("report-prose max-w-none", isDark && "report-prose-invert")}
        />

        {section.payloads?.map((block) => (
          <PayloadBlock key={block.title} block={block} />
        ))}

        {section.callouts?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {section.callouts.map((c) => (
              <ArchitectureCallout key={c.title} callout={c} />
            ))}
          </div>
        ) : null}

        {section.diagram && section.layout !== "diagram-first" ? (
          <div className="not-prose overflow-hidden rounded-xl border border-border/80 bg-muted/25 p-4 md:p-6">
            <ArchitectureDiagram spec={section.diagram} />
          </div>
        ) : null}
      </div>

      {section.pullQuote && section.layout === "split" ? (
        <div className={cn(index % 2 === 1 ? "lg:order-1" : undefined)}>
          <PullQuote className="lg:sticky lg:top-8">{section.pullQuote}</PullQuote>
        </div>
      ) : null}
    </div>
  );

  if (section.fullWidthDiagram && section.layout === "diagram-first") {
    return (
      <>
        <section className="report-section py-section-tight">
          <Container>{inner}</Container>
        </section>
        <FullWidthDiagram spec={section.fullWidthDiagram} dark={isDark} />
      </>
    );
  }

  if (isDark) {
    return (
      <DarkInversionBand id={section.id} className="report-section">
        {inner}
      </DarkInversionBand>
    );
  }

  return (
    <section className="report-section border-b border-border/50 py-section-tight last:border-b-0">
      <Container>{inner}</Container>
    </section>
  );
}
