export function PullQuote({ children, className }: { children: string; className?: string }) {
  return (
    <figure className={className}>
      <blockquote className="border-l border-foreground/15 pl-6 font-display text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.35] tracking-[-0.015em] text-foreground/90">
        {children}
      </blockquote>
    </figure>
  );
}
