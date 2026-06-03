import type { PayloadBlock as PayloadBlockType } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

export function PayloadBlock({ block, className }: { block: PayloadBlockType; className?: string }) {
  return (
    <figure className={cn("report-payload not-prose", className)}>
      <div className="flex items-center justify-between gap-4 border border-border/80 bg-muted/40 px-4 py-3">
        <figcaption className="text-sm font-medium text-foreground">{block.title}</figcaption>
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{block.language}</span>
      </div>
      <pre className="overflow-x-auto border border-t-0 border-border/80 bg-[hsl(222,24%,8%)] p-4 md:p-5">
        <code className="block whitespace-pre font-mono text-[0.8rem] leading-6 text-white/88">{block.content}</code>
      </pre>
      {block.caption ? <p className="mt-2 text-sm text-muted-foreground">{block.caption}</p> : null}
    </figure>
  );
}
