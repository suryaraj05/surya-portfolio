import type { PayloadBlock as PayloadBlockType } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { ReportReveal } from "./ReportMotion";

export function PayloadBlock({
  block,
  className,
  dark
}: {
  block: PayloadBlockType;
  className?: string;
  dark?: boolean;
}) {
  return (
    <ReportReveal>
      <figure className={cn("report-payload not-prose", className)}>
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-4 py-3",
            dark ? "border border-white/10 bg-white/[0.04]" : "border border-border/80 bg-muted/40"
          )}
        >
          <figcaption className={cn("text-sm font-medium", dark ? "text-white" : "text-foreground")}>{block.title}</figcaption>
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{block.language}</span>
        </div>
        <pre
          className={cn(
            "report-payload-body overflow-x-auto border border-t-0 p-4 md:p-5",
            dark ? "border-white/10 bg-[hsl(222,30%,5%)]" : "border-border/80 bg-[hsl(222,24%,8%)]"
          )}
        >
          <code className="block whitespace-pre font-mono text-[0.78rem] leading-[1.65] text-white/90">{block.content}</code>
        </pre>
        {block.caption ? <p className="mt-2 text-sm text-muted-foreground">{block.caption}</p> : null}
      </figure>
    </ReportReveal>
  );
}
