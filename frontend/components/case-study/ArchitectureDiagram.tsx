import type { ReactNode } from "react";

import type { DiagramSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/section";

type ArchitectureDiagramProps = {
  spec: DiagramSpec;
  caption?: ReactNode;
};

export function ArchitectureDiagram({ spec, caption }: ArchitectureDiagramProps) {
  if (spec.type === "svgInline") {
    return (
      <Section className="py-0" withContainer={false}>
        <div className={cn("not-prose w-full overflow-hidden rounded-xl border border-border bg-background")}>
          <div className="p-6">
            <div
              className="w-full overflow-auto"
              // Treat SVG fences and diagrams as trusted editorial assets.
              dangerouslySetInnerHTML={{ __html: spec.svgMarkup }}
            />
          </div>
        </div>
        {(spec.caption || caption) && (
          <p className="mt-3 text-sm text-muted-foreground">{spec.caption ?? caption}</p>
        )}
      </Section>
    );
  }

  if (spec.type === "svgUrl") {
    return (
      <Section className="py-0" withContainer={false}>
        <div className="not-prose w-full overflow-hidden rounded-xl border border-border bg-background">
          <img src={spec.svgSrc} alt={spec.caption ?? "architecture diagram"} className="w-full" />
        </div>
        {(spec.caption || caption) && (
          <p className="mt-3 text-sm text-muted-foreground">{spec.caption ?? caption}</p>
        )}
      </Section>
    );
  }

  return (
    <Section className="py-0" withContainer={false}>
      <div className="not-prose w-full overflow-hidden rounded-xl border border-border bg-background">
        <img src={spec.src} alt={spec.alt} className="w-full object-contain" loading="lazy" />
      </div>
      {(spec.caption || caption) && <p className="mt-3 text-sm text-muted-foreground">{spec.caption ?? caption}</p>}
    </Section>
  );
}

