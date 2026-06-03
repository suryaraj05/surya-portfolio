import type { ReactNode } from "react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

import { SystemMotif } from "./SystemMotif";

type EditorialHeroProps = {
  metadata: string;
  title: ReactNode;
  signature: string;
  lead: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

export function EditorialHero({
  metadata,
  title,
  signature,
  lead,
  primaryHref = "/projects",
  primaryLabel = "Explore systems",
  secondaryHref,
  secondaryLabel,
  className
}: EditorialHeroProps) {
  return (
    <section className={cn("editorial-hero-cinematic relative overflow-hidden", className)}>
      <div className="sys-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="sys-topology-field pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative py-[clamp(5rem,14vw,11rem)]">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(220px,340px)] lg:gap-20">
          <div className="max-w-[44rem] animate-fade-up motion-reduce:animate-none">
            <p className="sys-meta">{metadata}</p>
            <div className="mt-10">{title}</div>
            <p className="editorial-signature mt-8">{signature}</p>
            <p className="mt-10 max-w-[36rem] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.8] text-foreground/85">{lead}</p>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <Link href={primaryHref} className="editorial-cta-primary">
                {primaryLabel} <span aria-hidden>→</span>
              </Link>
              {secondaryHref && secondaryLabel ? (
                <a
                  href={secondaryHref}
                  target={secondaryHref.startsWith("http") ? "_blank" : undefined}
                  rel={secondaryHref.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="editorial-cta-secondary"
                >
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
          <div className="hidden lg:block">
            <SystemMotif variant="hero" />
          </div>
        </div>
      </Container>
    </section>
  );
}
