import type { TechItem } from "@/lib/case-study/types";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";

export function TechStackSection({ tech }: { tech: TechItem[] }) {
  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Tech Stack
        </Heading>
        <div className="grid gap-6 md:grid-cols-2">
          {tech.map((t) => {
            const label = t.name;
            return (
              <div key={t.name} className="rounded-xl border border-border bg-background p-6">
                {t.href ? (
                  <a href={t.href} className={cn("underline underline-offset-4")}>
                    <div className="text-lg font-display tracking-tight">{label}</div>
                  </a>
                ) : (
                  <div className="text-lg font-display tracking-tight">{label}</div>
                )}
                {t.description ? (
                  <Text tone="muted" size="sm" className="mt-3">
                    {t.description}
                  </Text>
                ) : null}
              </div>
            );
          })}
        </div>
      </Stack>
    </Section>
  );
}

