import type { ProjectNavItem } from "@/lib/case-study/types";
import Link from "next/link";

import { Container } from "@/components/layout/container";

export function ReportProjectNav({ previous, next }: { previous?: ProjectNavItem; next?: ProjectNavItem }) {
  if (!previous && !next) return null;

  return (
    <nav className="border-t border-border/30 text-sm" aria-label="Case study navigation">
      <Container className="report-read mx-auto flex flex-col gap-4 py-10 md:flex-row md:justify-between">
        <div>
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="text-muted-foreground transition hover:text-foreground">
              ← {previous.title}
            </Link>
          ) : null}
        </div>
        <div className="md:text-right">
          {next ? (
            <Link href={`/projects/${next.slug}`} className="text-muted-foreground transition hover:text-foreground">
              {next.title} →
            </Link>
          ) : null}
        </div>
      </Container>
    </nav>
  );
}
