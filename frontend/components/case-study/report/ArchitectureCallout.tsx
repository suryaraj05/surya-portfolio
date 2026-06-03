import type { ArchitectureCallout as CalloutType } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

export function ArchitectureCallout({ callout, className }: { callout: CalloutType; className?: string }) {
  return (
    <article className={cn("report-callout rounded-xl border border-border/80 bg-background p-5 transition duration-300 hover:border-border", className)}>
      {callout.tag ? (
        <p className="mb-2 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{callout.tag}</p>
      ) : null}
      <h4 className="font-display text-base tracking-tight text-foreground">{callout.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{callout.body}</p>
    </article>
  );
}
