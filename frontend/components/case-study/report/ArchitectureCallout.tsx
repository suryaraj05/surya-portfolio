import type { ArchitectureCallout as CalloutType } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

export function ArchitectureCallout({ callout, className, dark }: { callout: CalloutType; className?: string; dark?: boolean }) {
  return (
    <article
      className={cn(
        "report-callout rounded-xl border p-5 transition duration-300",
        dark ? "border-white/10 bg-white/[0.04] hover:border-white/20" : "border-border/80 bg-background hover:border-border",
        className
      )}
    >
      {callout.tag ? (
        <p className={cn("mb-2 text-[0.65rem] uppercase tracking-[0.14em]", dark ? "text-white/45" : "text-muted-foreground")}>
          {callout.tag}
        </p>
      ) : null}
      <h4 className={cn("font-display text-base tracking-tight", dark ? "text-white" : "text-foreground")}>{callout.title}</h4>
      <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/60" : "text-muted-foreground")}>{callout.body}</p>
    </article>
  );
}
