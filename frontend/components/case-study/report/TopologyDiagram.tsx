import type { DiagramSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { DiagramRenderer } from "./DiagramRenderer";

type TopologyDiagramProps = {
  spec: DiagramSpec;
  className?: string;
  animate?: boolean;
};

export function TopologyDiagram({ spec, className, animate = true }: TopologyDiagramProps) {
  return (
    <div className={cn(animate && "report-diagram-animate", className)}>
      <DiagramRenderer spec={spec} />
      {spec.caption ? <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">{spec.caption}</p> : null}
    </div>
  );
}
