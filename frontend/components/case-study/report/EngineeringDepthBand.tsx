import type { EngineeringDepthItem } from "@/lib/case-study/types";
import type { DiagramSpec } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

import { DarkInversionBand } from "./DarkInversionBand";
import { FullWidthDiagram } from "./FullWidthDiagram";
import { ReportReveal } from "./ReportMotion";

const STATUS = ["live", "gated", "trace", "recover", "audit"];

export function EngineeringDepthBand({
  items,
  recoveryDiagram
}: {
  items: EngineeringDepthItem[];
  recoveryDiagram?: DiagramSpec;
}) {
  return (
    <>
      <DarkInversionBand id="engineering-depth" className="py-12 md:py-16">
        <ReportReveal>
          <div className="mb-10 max-w-prose">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/45">Runtime internals</p>
            <h2 className="mt-3 font-display text-[clamp(1.65rem,3vw,2.35rem)] leading-tight tracking-[-0.02em] text-white">
              Operational mechanics
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Handoffs, routing, validation gates, recovery paths, and observability — the production surface area.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <article
                key={item.title}
                className={cn(
                  "group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]",
                  index === 4 && "md:col-span-2 lg:col-span-1"
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm tracking-tight text-white">{item.title}</h3>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-emerald-400/70">
                    {STATUS[index % STATUS.length]}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/72">{item.summary}</p>
                {item.detail ? <p className="mt-3 text-xs leading-relaxed text-white/42">{item.detail}</p> : null}
              </article>
            ))}
          </div>
        </ReportReveal>
      </DarkInversionBand>
      {recoveryDiagram ? <FullWidthDiagram spec={recoveryDiagram} dark className="border-t border-white/5" /> : null}
    </>
  );
}
