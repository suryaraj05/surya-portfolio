import type { DiagramSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { ReportReveal } from "./ReportMotion";
import { TopologyDiagram } from "./TopologyDiagram";

type FullWidthDiagramProps = {
  spec: DiagramSpec;
  className?: string;
  dark?: boolean;
};

export function FullWidthDiagram({ spec, className, dark }: FullWidthDiagramProps) {
  return (
    <ReportReveal>
      <div
        className={cn(
          "report-diagram-band relative left-1/2 -mx-[50vw] w-screen max-w-[100vw]",
          dark && "report-dark-band",
          className
        )}
      >
        <div className="arch-texture arch-texture-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto w-full max-w-[min(1280px,94vw)] px-content-x py-10 md:py-14">
          <div
            className={cn(
              "overflow-hidden rounded-2xl border",
              dark ? "border-white/10 bg-white/[0.02] shadow-[0_40px_80px_-48px_rgba(0,0,0,0.8)]" : "border-border/80 bg-muted/20"
            )}
          >
            <div className={cn("p-5 md:p-10", dark ? "text-white/90" : "text-foreground")}>
              <TopologyDiagram spec={spec} />
            </div>
          </div>
        </div>
      </div>
    </ReportReveal>
  );
}
