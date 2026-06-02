import type { CaseStudyKicker } from "@/lib/case-study/types";
import type { ReactNode } from "react";

import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Stack } from "@/components/layout/stack";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/case-study/RichText";

type CaseStudyHeroProps = {
  title: string;
  subtitle?: string;
  kicker?: CaseStudyKicker[];
  coverDescriptionMarkdown?: string;
  rightRail?: ReactNode;
};

export function CaseStudyHero({ title, subtitle, kicker, coverDescriptionMarkdown, rightRail }: CaseStudyHeroProps) {
  return (
    <Section className="pt-[clamp(2.5rem,7vw,6rem)]">
      <div className="grid gap-12 md:grid-cols-[1fr_360px] md:items-start">
        <Stack size="lg" className="min-w-0">
          {kicker?.length ? (
            <div className="flex flex-wrap gap-2" aria-label="Case study labels">
              {kicker.map((item) => (
                <Badge key={item.label} className={cn(item.href ? "cursor-pointer" : "")}>
                  {item.label}
                </Badge>
              ))}
            </div>
          ) : null}

          <Heading as="h1" size="lg">
            {title}
          </Heading>

          {subtitle ? <Text tone="muted" size="lg">{subtitle}</Text> : null}

          {coverDescriptionMarkdown ? (
            <div className="mt-2">
              <RichText markdown={coverDescriptionMarkdown} />
            </div>
          ) : null}
        </Stack>
        {rightRail ? <div>{rightRail}</div> : null}
      </div>
    </Section>
  );
}

