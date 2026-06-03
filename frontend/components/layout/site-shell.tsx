import { EditorialNav } from "@/components/editorial/EditorialNav";
import { Container } from "./container";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <EditorialNav />
      <main id="main-content">{children}</main>
      <footer role="contentinfo" className="border-t border-border/25">
        <Container className="flex flex-col gap-2 py-12 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-sm tracking-tight">SuryaOS</span>
          <p className="sys-meta">Systems engineering publication · Agentic infrastructure</p>
        </Container>
      </footer>
    </>
  );
}
