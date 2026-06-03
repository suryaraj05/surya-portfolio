import type { ProjectNavItem } from "@/lib/case-study/types";

import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Text } from "@/components/typography/text";

export function ProjectNavigation({
  previous,
  next
}: {
  previous?: ProjectNavItem;
  next?: ProjectNavItem;
}) {
  if (!previous && !next) return null;

  return (
    <div className="pt-[clamp(2rem,5vw,3rem)] pb-[clamp(1.5rem,4vw,2.5rem)]">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {previous ? (
              <Link href={`/projects/${previous.slug}`} className="block rounded-xl border border-border bg-background p-6 transition hover:opacity-95">
                <Text tone="muted" size="sm">Previous case study</Text>
                <div className="mt-2 text-xl font-display tracking-tight">{previous.title}</div>
              </Link>
            ) : null}
          </div>
          <div>
            {next ? (
              <Link href={`/projects/${next.slug}`} className="block rounded-xl border border-border bg-background p-6 transition hover:opacity-95 md:text-right">
                <Text tone="muted" size="sm">Next case study</Text>
                <div className="mt-2 text-xl font-display tracking-tight">{next.title}</div>
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}

