import { DiagramRenderer } from "@/components/case-study/report/DiagramRenderer";
import type { DiagramSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

type FullWidthDiagramProps = {
  spec: DiagramSpec;
  className?: string;
  dark?: boolean;
};

export function FullWidthDiagram({ spec, className, dark }: FullWidthDiagramProps) {
  return (
    <div
      className={cn(
        "report-diagram-band relative left-1/2 right-1/2 -mx-[50vw] w-screen max-w-[100vw]",
        dark && "report-dark-band",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[min(1200px,92vw)] px-content-x py-8 md:py-12">
        <div className={cn("overflow-hidden rounded-xl border", dark ? "border-white/10 bg-white/[0.03]" : "border-border/80 bg-muted/30")}>
          <div className={cn("p-6 md:p-10", dark ? "text-white/90" : "text-foreground")}>
            <DiagramRenderer spec={spec} />
          </div>
          {spec.caption ? (
            <p className={cn("border-t px-6 py-3 text-sm", dark ? "border-white/10 text-white/45" : "border-border/80 text-muted-foreground")}>
              {spec.caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
