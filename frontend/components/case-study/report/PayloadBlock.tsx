import type { PayloadBlock as PayloadBlockType } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

export function PayloadBlock({ block, className }: { block: PayloadBlockType; className?: string }) {
  return (
    <figure className={cn("report-payload not-prose", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <figcaption className="text-sm text-foreground">{block.title}</figcaption>
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{block.language}</span>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-[hsl(222,22%,10%)] px-4 py-4 md:px-5 md:py-5">
        <code className="block whitespace-pre font-mono text-[0.78rem] leading-[1.7] text-white/88">{block.content}</code>
      </pre>
      {block.caption ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{block.caption}</p> : null}
    </figure>
  );
}
