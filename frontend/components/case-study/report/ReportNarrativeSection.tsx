import { RichText } from "@/components/case-study/RichText";
import { Container } from "@/components/layout/container";
import type { NarrativeSectionSpec, SectionDensity } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { ArchitectureCallout } from "./ArchitectureCallout";
import { DarkInversionBand } from "./DarkInversionBand";
import { FullWidthDiagram } from "./FullWidthDiagram";
import { AnnotationsList, MicroNotesRail } from "./MicroNotesRail";
import { PayloadBlock } from "./PayloadBlock";
import { PullQuote } from "./PullQuote";
import { ReportReveal } from "./ReportMotion";
import { TopologyDiagram } from "./TopologyDiagram";

type ReportNarrativeSectionProps = {
  section: NarrativeSectionSpec;
  index: number;
};

const densityPad: Record<SectionDensity, string> = {
  compact: "py-10 md:py-12",
  balanced: "py-12 md:py-16",
  immersive: "py-14 md:py-20"
};

function sectionPadding(section: NarrativeSectionSpec): string {
  return densityPad[section.density ?? "balanced"];
}

function ChapterHeader({
  section,
  dark
}: {
  section: NarrativeSectionSpec;
  dark?: boolean;
}) {
  return (
    <header className="max-w-[42rem]">
      {section.eyebrow ? (
        <p className={cn("text-[0.65rem] uppercase tracking-[0.18em]", dark ? "text-white/45" : "text-muted-foreground")}>
          {section.eyebrow}
        </p>
      ) : null}
      <h2
        id={section.id}
        className={cn(
          "mt-3 font-display text-[clamp(1.75rem,3.2vw,2.65rem)] leading-[1.08] tracking-[-0.025em]",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {section.title}
      </h2>
      <AnnotationsList items={section.annotations ?? []} dark={dark} />
    </header>
  );
}

function AnchoredLayout({ section, dark }: { section: NarrativeSectionSpec; dark?: boolean }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <ChapterHeader section={section} dark={dark} />
        <RichText markdown={section.markdown} className={cn("report-prose report-prose-measure mt-8", dark && "report-prose-invert")} />
      </div>
      <aside className="lg:col-span-5 lg:border-l lg:pl-10 lg:border-border/50">
        <div className="lg:sticky lg:top-10 space-y-8">
          {section.pullQuote ? <PullQuote dark={dark}>{section.pullQuote}</PullQuote> : null}
          {section.callouts?.map((c) => (
            <ArchitectureCallout key={c.title} callout={c} dark={dark} />
          ))}
          <MicroNotesRail notes={section.microNotes ?? []} dark={dark} />
        </div>
      </aside>
    </div>
  );
}

function InsightLayout({ section, dark }: { section: NarrativeSectionSpec; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-[40rem]">
      <ChapterHeader section={section} dark={dark} />
      {section.pullQuote ? <PullQuote className="mt-10" dark={dark}>{section.pullQuote}</PullQuote> : null}
      <RichText markdown={section.markdown} className={cn("report-prose report-prose-measure mt-8", dark && "report-prose-invert")} />
    </div>
  );
}

function DenseLayout({ section, dark }: { section: NarrativeSectionSpec; dark?: boolean }) {
  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] xl:items-start">
      <div>
        <ChapterHeader section={section} dark={dark} />
        <RichText markdown={section.markdown} className={cn("report-prose report-prose-measure mt-6", dark && "report-prose-invert")} />
        {section.payloads?.map((block) => (
          <PayloadBlock key={block.title} block={block} className="mt-8" dark={dark} />
        ))}
      </div>
      {section.diagram ? (
        <div className={cn("overflow-hidden rounded-xl border p-4 md:p-6", dark ? "border-white/10 bg-white/[0.03]" : "border-border/80 bg-muted/25")}>
          <TopologyDiagram spec={section.diagram} />
        </div>
      ) : null}
    </div>
  );
}

function VisualLedLayout({ section, dark }: { section: NarrativeSectionSpec; dark?: boolean }) {
  return (
    <div className="max-w-[44rem]">
      <ChapterHeader section={section} dark={dark} />
      <RichText markdown={section.markdown} className={cn("report-prose report-prose-measure mt-6", dark && "report-prose-invert")} />
      {section.callouts?.length ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {section.callouts.map((c) => (
            <ArchitectureCallout key={c.title} callout={c} dark={dark} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProseLayout({ section, dark }: { section: NarrativeSectionSpec; dark?: boolean }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
      <div>
        <ChapterHeader section={section} dark={dark} />
        <RichText markdown={section.markdown} className={cn("report-prose report-prose-measure mt-8", dark && "report-prose-invert")} />
        {section.payloads?.map((block) => (
          <PayloadBlock key={block.title} block={block} className="mt-8" dark={dark} />
        ))}
      </div>
      <MicroNotesRail notes={section.microNotes ?? []} dark={dark} className="lg:pt-16" />
    </div>
  );
}

export function ReportNarrativeSection({ section, index }: ReportNarrativeSectionProps) {
  const isDark = section.tone === "dark";
  const layout = section.layout ?? "prose";
  const pad = sectionPadding(section);

  const body = (() => {
    switch (layout) {
      case "anchored":
        return <AnchoredLayout section={section} dark={isDark} />;
      case "insight":
        return <InsightLayout section={section} dark={isDark} />;
      case "dense":
        return <DenseLayout section={section} dark={isDark} />;
      case "visual-led":
        return <VisualLedLayout section={section} dark={isDark} />;
      default:
        return <ProseLayout section={section} dark={isDark} />;
    }
  })();

  const visualBand =
    section.fullWidthDiagram && layout === "visual-led" ? (
      <FullWidthDiagram spec={section.fullWidthDiagram} dark className="report-section-transition" />
    ) : null;

  const content = (
    <ReportReveal delay={index * 0.06}>
      {body}
    </ReportReveal>
  );

  if (layout === "visual-led" && section.fullWidthDiagram) {
    return (
      <>
        <section className={cn("report-section", pad)}>
          <Container>{content}</Container>
        </section>
        {visualBand}
      </>
    );
  }

  if (isDark) {
    return (
      <DarkInversionBand id={section.id} className={cn("report-section report-section-transition", pad)}>
        {content}
      </DarkInversionBand>
    );
  }

  return (
    <section className={cn("report-section report-section-transition border-b border-border/40", pad)}>
      <Container>{content}</Container>
    </section>
  );
}
