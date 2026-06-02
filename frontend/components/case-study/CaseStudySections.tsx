import type { ReactNode } from "react";

import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Stack } from "@/components/layout/stack";
import { RichText } from "@/components/case-study/RichText";
import { cn } from "@/lib/utils";

type CaseStudyMarkdownSectionProps = {
  title?: string;
  kicker?: string;
  markdown: string;
  id?: string;
  rightRail?: ReactNode;
};

export function ProblemSection({ title = "Problem", kicker, markdown, id, rightRail }: CaseStudyMarkdownSectionProps) {
  return (
    <Section id={id} className="pt-[clamp(2.5rem,6vw,5rem)]">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <Stack size="lg">
          <Heading as="h2" size="md" className="text-2xl">
            {title}
          </Heading>
          {kicker ? <Text tone="muted" size="md" className="max-w-prose">{kicker}</Text> : null}
          <RichText markdown={markdown} />
        </Stack>
        {rightRail ? <div className="lg:sticky lg:top-6">{rightRail}</div> : null}
      </div>
    </Section>
  );
}

export function ChallengeSection({ title = "Challenge", kicker, markdown, id }: CaseStudyMarkdownSectionProps) {
  return (
    <Section id={id} className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          {title}
        </Heading>
        {kicker ? <Text tone="muted" size="md">{kicker}</Text> : null}
        <RichText markdown={markdown} />
      </Stack>
    </Section>
  );
}

export function LessonsLearned({ markdown, kicker }: { markdown: string; kicker?: string }) {
  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Lessons Learned
        </Heading>
        {kicker ? <Text tone="muted" size="md">{kicker}</Text> : null}
        <RichText markdown={markdown} />
      </Stack>
    </Section>
  );
}

export function TradeoffSection({ items }: { items: Array<{ title: string; markdown: string }> }) {
  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Trade-offs
        </Heading>
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-background p-6">
              <Heading as="h3" size="sm" className={cn("text-lg", "mb-2")}>
                {item.title}
              </Heading>
              <div className="max-w-prose">
                <RichText markdown={item.markdown} />
              </div>
            </div>
          ))}
        </div>
      </Stack>
    </Section>
  );
}

export function MetricsSection({ metrics }: { metrics: Array<{ label: string; value: string; note?: string }> }) {
  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Metrics
        </Heading>
        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-background p-6">
              <div className="text-3xl font-display tracking-tight">{m.value}</div>
              <Text tone="muted" size="sm" className="mt-1">
                {m.label}
              </Text>
              {m.note ? (
                <Text tone="muted" size="sm" className="mt-3">
                  {m.note}
                </Text>
              ) : null}
            </div>
          ))}
        </div>
      </Stack>
    </Section>
  );
}

