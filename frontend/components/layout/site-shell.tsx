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
      <header role="banner" className="border-b bg-background/90 backdrop-blur">
        <Container className="py-4 text-sm text-muted-foreground">SuryaOS Web Foundation</Container>
      </header>
      <main id="main-content">{children}</main>
      <footer role="contentinfo" className="border-t">
        <Container className="py-6 text-sm text-muted-foreground">Frontend foundation only. No final pages yet.</Container>
      </footer>
    </>
  );
}
