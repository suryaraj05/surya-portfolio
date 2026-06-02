import type { ProjectNavItem } from "@/lib/case-study/types";

import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export function RelatedProjects({
  projects,
  currentSlug
}: {
  projects: ProjectNavItem[];
  currentSlug?: string;
}) {
  const filtered = currentSlug ? projects.filter((p) => p.slug !== currentSlug) : projects;

  if (!filtered.length) return null;

  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Related
        </Heading>
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.slice(0, 4).map((p) => (
            <article
              key={p.slug}
              className="rounded-xl border border-border bg-background p-6 not-prose transition hover:opacity-95"
            >
              <Link href={p.slug ? `/case-studies/${p.slug}` : "/case-studies"} className="block">
                <div className="text-lg font-display tracking-tight">{p.title}</div>
                {p.short_description ? (
                  <Text tone="muted" size="sm" className="mt-2">
                    {p.short_description}
                  </Text>
                ) : null}
              </Link>
            </article>
          ))}
        </div>
      </Stack>
    </Section>
  );
}

