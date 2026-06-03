import type { ProjectNavItem } from "@/lib/case-study/types";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export function ReportProjectNav({ previous, next }: { previous?: ProjectNavItem; next?: ProjectNavItem }) {
  if (!previous && !next) return null;

  return (
    <nav className="border-t border-border/60 bg-muted/30" aria-label="Case study navigation">
      <Container className="grid divide-y divide-border/60 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="py-8 md:pr-10">
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="link-premium group block">
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Previous report</span>
              <span className="mt-2 block font-display text-lg tracking-tight">{previous.title}</span>
            </Link>
          ) : null}
        </div>
        <div className={cn("py-8 md:pl-10", next && "md:text-right")}>
          {next ? (
            <Link href={`/projects/${next.slug}`} className="link-premium group block md:ml-auto">
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Next report</span>
              <span className="mt-2 block font-display text-lg tracking-tight">{next.title}</span>
            </Link>
          ) : null}
        </div>
      </Container>
    </nav>
  );
}
