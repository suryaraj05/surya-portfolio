import { cn } from "@/lib/utils";

export function PullQuote({ children, className }: { children: string; className?: string }) {
  return (
    <figure className={cn("report-pull-quote not-prose", className)}>
      <blockquote className="font-display text-[clamp(1.25rem,2vw,1.65rem)] leading-snug tracking-tight text-foreground">
        {children}
      </blockquote>
    </figure>
  );
}
