import type { EngineeringDepthItem } from "@/lib/case-study/types";
import { Heading } from "@/components/typography/heading";
import { cn } from "@/lib/utils";

import { DarkInversionBand } from "./DarkInversionBand";

export function EngineeringDepthBand({ items }: { items: EngineeringDepthItem[] }) {
  return (
    <DarkInversionBand id="engineering-depth">
      <div className="mb-8 max-w-prose">
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-white/45">Engineering depth</p>
        <Heading as="h2" size="md" className="mt-3 text-white text-[clamp(1.5rem,2.4vw,2.1rem)]">
          Operational mechanics
        </Heading>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Handoffs, routing, validation gates, recovery paths, and observability — documented as production mechanics.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={cn(
              "rounded-xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:bg-white/[0.06]",
              index === items.length - 1 && items.length % 3 !== 0 ? "lg:col-span-2" : undefined
            )}
          >
            <h3 className="font-display text-sm tracking-tight text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{item.summary}</p>
            {item.detail ? <p className="mt-3 text-xs leading-relaxed text-white/45">{item.detail}</p> : null}
          </article>
        ))}
      </div>
    </DarkInversionBand>
  );
}
