import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type ReportEditorialSectionProps = {
  eyebrow?: string;
  title: string;
  id?: string;
  children: ReactNode;
  className?: string;
};

export function ReportEditorialSection({ eyebrow, title, id, children, className }: ReportEditorialSectionProps) {
  return (
    <section id={id} className={cn("report-editorial-section border-b border-border/25 py-16 md:py-20", className)}>
      <Container>
        <article className="report-read mx-auto">
          {eyebrow ? (
            <p className="mb-4 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
          ) : null}
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.35rem)] leading-[1.12] tracking-[-0.02em] text-foreground">
            {title}
          </h2>
          <div className="mt-10">{children}</div>
        </article>
      </Container>
    </section>
  );
}
