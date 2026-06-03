import { RichText } from "@/components/case-study/RichText";
import type { NarrativeSectionSpec } from "@/lib/case-study/types";

import { CompactDiagram } from "./CompactDiagram";
import { PayloadBlock } from "./PayloadBlock";
import { PullQuote } from "./PullQuote";
import { ReportEditorialSection } from "./ReportEditorialSection";

type ReportNarrativeSectionProps = {
  section: NarrativeSectionSpec;
};

export function ReportNarrativeSection({ section }: ReportNarrativeSectionProps) {
  const payload = section.payloads?.[0];
  const diagram = section.id === "architecture" ? section.diagram ?? section.fullWidthDiagram : undefined;

  return (
    <ReportEditorialSection eyebrow={section.eyebrow} title={section.title} id={section.id}>
      {section.pullQuote ? <PullQuote className="mb-10">{section.pullQuote}</PullQuote> : null}
      <RichText markdown={section.markdown} className="report-prose" />
      {diagram ? <CompactDiagram spec={diagram} /> : null}
      {payload ? <PayloadBlock block={payload} className="mt-10" /> : null}
    </ReportEditorialSection>
  );
}
