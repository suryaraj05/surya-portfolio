import { RichText } from "@/components/case-study/RichText";
import type { NarrativeSectionSpec } from "@/lib/case-study/types";

import { CompactDiagram } from "./CompactDiagram";
import { DiagramNotes, EvidenceStrip, InlineArtifact, MicroFlow, SectionTransition } from "./EngineeringTexture";
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
      {section.transition ? <SectionTransition>{section.transition}</SectionTransition> : null}

      {section.pullQuote ? <PullQuote className="mb-10">{section.pullQuote}</PullQuote> : null}

      {section.microFlow && !section.pullQuote ? <MicroFlow steps={section.microFlow} /> : null}

      <RichText markdown={section.markdown} className="report-prose" />

      {section.microFlow && section.pullQuote ? <MicroFlow steps={section.microFlow} /> : null}

      {section.artifacts?.map((artifact) => (
        <InlineArtifact key={artifact.label} artifact={artifact} />
      ))}

      {section.pullQuoteAfter ? <PullQuote className="my-10">{section.pullQuoteAfter}</PullQuote> : null}

      {diagram ? (
        <div className="my-10">
          <CompactDiagram spec={diagram} />
          {section.diagramNotes?.length ? <DiagramNotes notes={section.diagramNotes} /> : null}
        </div>
      ) : null}

      {section.evidence?.length ? <EvidenceStrip lines={section.evidence} /> : null}

      {payload ? <PayloadBlock block={payload} className="mt-8" /> : null}
    </ReportEditorialSection>
  );
}
