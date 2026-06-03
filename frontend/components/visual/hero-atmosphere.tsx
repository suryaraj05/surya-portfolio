import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type HeroAtmosphereProps = {
  children: ReactNode;
  className?: string;
  kicker?: string;
};

export function HeroAtmosphere({ children, className, kicker }: HeroAtmosphereProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border/70", className)}>
      <div className="hero-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="arch-texture arch-texture-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-accent/40 blur-3xl" aria-hidden />
      <Container className="relative py-[clamp(4rem,11vw,9rem)]">
        {kicker ? (
          <p className="mb-6 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
        ) : null}
        <div className="animate-fade-up motion-reduce:animate-none">{children}</div>
      </Container>
    </section>
  );
}
