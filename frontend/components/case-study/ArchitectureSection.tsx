import type { DiagramSpec } from "@/lib/case-study/types";

import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { RichText } from "@/components/case-study/RichText";

type ArchitectureSectionProps = {
  markdown: string;
  diagram?: DiagramSpec;
  diagrams?: DiagramSpec[];
};

export function ArchitectureSection({ markdown, diagram, diagrams }: ArchitectureSectionProps) {
  const allDiagrams = diagrams?.length ? diagrams : diagram ? [diagram] : [];

  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Architecture
        </Heading>

        {allDiagrams.length ? (
          <div className="not-prose flex flex-col gap-10">
            {allDiagrams.map((spec, idx) => (
              <ArchitectureDiagram key={idx} spec={spec} />
            ))}
          </div>
        ) : null}

        <RichText markdown={markdown} />
      </Stack>
    </Section>
  );
}

