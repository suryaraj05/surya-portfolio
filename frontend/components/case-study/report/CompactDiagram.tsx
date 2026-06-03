import type { DiagramSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { DiagramRenderer } from "./DiagramRenderer";

export function CompactDiagram({ spec, className }: { spec: DiagramSpec; className?: string }) {
  return (
    <figure className={cn("report-compact-diagram not-prose my-12 text-muted-foreground/90", className)}>
      <DiagramRenderer spec={spec} />
      {spec.caption ? <figcaption className="mt-3 text-sm text-muted-foreground">{spec.caption}</figcaption> : null}
    </figure>
  );
}
