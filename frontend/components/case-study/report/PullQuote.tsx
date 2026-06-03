import { cn } from "@/lib/utils";

export function PullQuote({ children, className, dark }: { children: string; className?: string; dark?: boolean }) {
  return (
    <figure className={cn("report-pull-quote not-prose", className)}>
      <blockquote
        className={cn(
          "font-display text-[clamp(1.35rem,2.8vw,2rem)] leading-[1.2] tracking-[-0.02em]",
          dark ? "text-white/92" : "text-foreground"
        )}
      >
        {children}
      </blockquote>
    </figure>
  );
}
