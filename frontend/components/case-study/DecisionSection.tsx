import type { DecisionItem } from "@/lib/case-study/types";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { RichText } from "@/components/case-study/RichText";

export function DecisionSection({ decisions }: { decisions: DecisionItem[] }) {
  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Decisions
        </Heading>
        <div className="grid gap-8 lg:grid-cols-2">
          {decisions.map((d) => (
            <article key={d.title} className="rounded-xl border border-border bg-background p-7">
              <Heading as="h3" size="sm" className="text-lg">
                {d.title}
              </Heading>
              <RichText markdown={d.rationaleMarkdown} className="mt-3" />
              {d.alternativesMarkdown ? <RichText markdown={d.alternativesMarkdown} className="mt-4" /> : null}
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
    </Section>
  );
}

