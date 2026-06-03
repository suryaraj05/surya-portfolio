import { RichText } from "@/components/case-study/RichText";
import type { DecisionItem, EngineeringDepthItem, MetricItem, PostSectionTexture, TradeoffItem } from "@/lib/case-study/types";

import { EvidenceStrip, InlineArtifact, MicroFlow, SectionTransition } from "./EngineeringTexture";
import { PullQuote } from "./PullQuote";
import { ReportEditorialSection } from "./ReportEditorialSection";

export function ReportMechanics({
  items,
  texture
}: {
  items: EngineeringDepthItem[];
  texture?: PostSectionTexture;
}) {
  if (!items.length) return null;

  const body = items.map((item) => `### ${item.title}\n\n${item.summary}`).join("\n\n");

  return (
    <ReportEditorialSection eyebrow="04 · Operations" title="Operational mechanics" id="mechanics">
      {texture?.transition ? <SectionTransition>{texture.transition}</SectionTransition> : null}
      {texture?.pullQuote ? <PullQuote className="mb-10">{texture.pullQuote}</PullQuote> : null}
      {texture?.microFlow ? <MicroFlow steps={texture.microFlow} vertical /> : null}
      <RichText markdown={body} className="report-prose" />
      {texture?.artifacts?.map((a) => (
        <InlineArtifact key={a.label} artifact={a} />
      ))}
      {texture?.evidence?.length ? <EvidenceStrip lines={texture.evidence} /> : null}
    </ReportEditorialSection>
  );
}

export function ReportTradeoffs({
  items,
  decisions,
  texture
}: {
  items: TradeoffItem[];
  decisions?: DecisionItem[];
  texture?: PostSectionTexture;
}) {
  if (!items.length && !decisions?.length) return null;

  const parts: string[] = [];

  if (decisions?.length) {
    for (const d of decisions) {
      parts.push(`### ${d.title}\n\n${d.rationaleMarkdown}`);
    }
  }

  for (const t of items) {
    parts.push(`### ${t.title}\n\n${t.markdown}`);
  }

  return (
    <ReportEditorialSection eyebrow="05 · Tradeoffs" title="Explicit compromises" id="tradeoffs">
      {texture?.transition ? <SectionTransition>{texture.transition}</SectionTransition> : null}
      <RichText markdown={parts.join("\n\n")} className="report-prose" />
      {texture?.evidence?.length ? <EvidenceStrip lines={texture.evidence} /> : null}
    </ReportEditorialSection>
  );
}

export function ReportResults({ metrics }: { metrics: MetricItem[] }) {
  const unique = metrics.filter((m, i, arr) => arr.findIndex((x) => x.label === m.label) === i).slice(0, 5);
  if (!unique.length) return null;

  return (
    <ReportEditorialSection eyebrow="06 · Results" title="Measured outcomes" id="results">
      <dl className="space-y-6">
        {unique.map((m) => (
          <div key={m.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <dt className="text-sm text-muted-foreground">{m.label}</dt>
            <dd className="font-display text-xl tracking-tight text-foreground sm:text-right">
              {m.value}
              {m.note ? <span className="mt-1 block font-sans text-xs font-normal text-muted-foreground">{m.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </ReportEditorialSection>
  );
}

export function ReportLessons({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null;

  return (
    <ReportEditorialSection eyebrow="07 · Closing" title="Lessons learned" id="lessons">
      <RichText markdown={markdown} className="report-prose" />
    </ReportEditorialSection>
  );
}
