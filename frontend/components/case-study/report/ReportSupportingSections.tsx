import { RichText } from "@/components/case-study/RichText";
import { Container } from "@/components/layout/container";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import type { DecisionItem, MetricItem, TechItem, TradeoffItem } from "@/lib/case-study/types";
import { getHeroDiagramForSlug } from "@/lib/case-study/diagrams";

import { DarkInversionBand } from "./DarkInversionBand";
import { FullWidthDiagram } from "./FullWidthDiagram";

export function ReportDecisions({ decisions }: { decisions: DecisionItem[] }) {
  if (!decisions.length) return null;

  return (
    <section className="report-section py-section-tight">
      <Container>
        <Stack size="lg">
          <div className="max-w-prose">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">04 · Decisions</p>
            <Heading as="h2" size="md" className="mt-3 text-[clamp(1.45rem,2.4vw,2rem)]">
              Design decisions under constraint
            </Heading>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {decisions.map((d) => (
              <article key={d.title} className="rounded-xl border border-border/80 bg-muted/20 p-6 md:p-7">
                <Heading as="h3" size="sm" className="text-lg">
                  {d.title}
                </Heading>
                <RichText markdown={d.rationaleMarkdown} className="report-prose mt-4 max-w-none text-sm" />
                {d.alternativesMarkdown ? (
                  <RichText markdown={d.alternativesMarkdown} className="report-prose mt-4 max-w-none text-sm text-muted-foreground" />
                ) : null}
                {d.codeBlock ? (
                  <RichText
                    markdown={`\`\`\`${d.codeBlock.language ?? ""}\n${d.codeBlock.content}\n\`\`\``}
                    className="mt-4"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </Stack>
      </Container>
    </section>
  );
}

export function ReportTradeoffs({ items }: { items: TradeoffItem[] }) {
  if (!items.length) return null;

  return (
    <section className="report-section border-b border-border/50 py-section-tight">
      <Container>
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Trade-offs</p>
        <Heading as="h2" size="md" className="mt-3 text-[clamp(1.35rem,2vw,1.85rem)]">
          Explicit compromises
        </Heading>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className="border-l-2 border-foreground/15 pl-5">
              <h3 className="font-display text-base tracking-tight">{item.title}</h3>
              <RichText markdown={item.markdown} className="report-prose mt-2 max-w-none text-sm" />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ReportTechStack({ tech }: { tech: TechItem[] }) {
  if (!tech.length) return null;

  return (
    <section className="report-section py-section-tight">
      <Container>
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Stack</p>
        <Heading as="h2" size="md" className="mt-3 text-[clamp(1.35rem,2vw,1.85rem)]">
          Production stack
        </Heading>
        <div className="mt-8 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t.name}
              className="rounded-lg border border-border/80 bg-background px-3 py-2 font-mono text-xs text-foreground/90 transition hover:border-foreground/20"
            >
              {t.name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ReportOutcomeMetrics({ metrics }: { metrics: MetricItem[] }) {
  if (!metrics.length) return null;

  const unique = metrics.filter(
    (m, i, arr) => arr.findIndex((x) => x.label === m.label) === i
  );

  return (
    <DarkInversionBand>
      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-white/45">Outcomes</p>
      <Heading as="h2" size="md" className="mt-3 text-white text-[clamp(1.35rem,2vw,1.85rem)]">
        Measured results
      </Heading>
      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
        {unique.slice(0, 6).map((m) => (
          <div key={m.label} className="bg-[hsl(222,28%,7%)] px-5 py-6">
            <div className="font-display text-2xl tracking-tight text-white">{m.value}</div>
            <Text tone="muted" size="sm" className="mt-1 text-white/55">
              {m.label}
            </Text>
            {m.note ? <p className="mt-2 text-xs text-white/40">{m.note}</p> : null}
          </div>
        ))}
      </div>
    </DarkInversionBand>
  );
}

export function OrchestrationVisual({ slug, caption }: { slug: string; caption?: string }) {
  const diagram = getHeroDiagramForSlug(slug);
  if (!diagram) return null;

  return (
    <section className="py-section-tight">
      <Container className="mb-6 max-w-prose">
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Orchestration</p>
        <Heading as="h2" size="md" className="mt-3 text-[clamp(1.35rem,2vw,1.85rem)]">
          Control flow and handoffs
        </Heading>
        {caption ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{caption}</p> : null}
      </Container>
      <FullWidthDiagram spec={{ ...diagram, caption: caption ?? "System orchestration" }} />
    </section>
  );
}

export function ReportLessons({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null;

  return (
    <DarkInversionBand>
      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-white/45">Closing</p>
      <Heading as="h2" size="md" className="mt-3 text-white">
        Lessons from production
      </Heading>
      <RichText markdown={markdown} className="report-prose report-prose-invert mt-6 max-w-prose" />
    </DarkInversionBand>
  );
}
