import { Container } from "./container";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <header role="banner" className="border-b border-border/80 bg-background/85 backdrop-blur-sm">
        <Container className="py-4 text-sm tracking-wide text-muted-foreground">SuryaOS</Container>
      </header>
      <main id="main-content">{children}</main>
      <footer role="contentinfo" className="border-t border-border/80">
        <Container className="py-8 text-sm text-muted-foreground">
          Engineering systems · Agentic AI infrastructure
        </Container>
      </footer>
    </>
  );
}
