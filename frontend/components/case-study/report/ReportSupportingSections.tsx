import { RichText } from "@/components/case-study/RichText";
import type { DecisionItem, EngineeringDepthItem, MetricItem, TradeoffItem } from "@/lib/case-study/types";

import { ReportEditorialSection } from "./ReportEditorialSection";

export function ReportMechanics({ items }: { items: EngineeringDepthItem[] }) {
  if (!items.length) return null;

  const body = items
    .map((item) => {
      const detail = item.detail ? ` ${item.detail}` : "";
      return `**${item.title}** — ${item.summary}${detail}`;
    })
    .join("\n\n");

  return (
    <ReportEditorialSection eyebrow="04 · Operations" title="Operational mechanics" id="mechanics">
      <RichText markdown={body} className="report-prose" />
    </ReportEditorialSection>
  );
}

export function ReportTradeoffs({ items, decisions }: { items: TradeoffItem[]; decisions?: DecisionItem[] }) {
  if (!items.length && !decisions?.length) return null;

  const parts: string[] = [];

  if (decisions?.length) {
    for (const d of decisions) {
      let block = `### ${d.title}\n\n${d.rationaleMarkdown}`;
      if (d.alternativesMarkdown) block += `\n\n${d.alternativesMarkdown}`;
      if (d.codeBlock) {
        block += `\n\n\`\`\`${d.codeBlock.language ?? ""}\n${d.codeBlock.content}\n\`\`\``;
      }
      parts.push(block);
    }
  }

  for (const t of items) {
    parts.push(`### ${t.title}\n\n${t.markdown}`);
  }

  return (
    <ReportEditorialSection eyebrow="05 · Tradeoffs" title="Explicit compromises" id="tradeoffs">
      <RichText markdown={parts.join("\n\n")} className="report-prose" />
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
