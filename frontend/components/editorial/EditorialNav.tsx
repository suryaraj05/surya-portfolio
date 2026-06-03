import Link from "next/link";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Systems" },
  { href: "/contact", label: "Contact" }
] as const;

export function EditorialNav({ className }: { className?: string }) {
  return (
    <header role="banner" className={cn("sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-md", className)}>
      <Container className="flex items-center justify-between py-5">
        <Link href="/" className="font-display text-sm tracking-tight text-foreground transition hover:opacity-70">
          SuryaOS
        </Link>
        <nav className="flex items-center gap-8" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="sys-meta transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
