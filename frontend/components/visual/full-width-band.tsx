import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FullWidthBandProps = {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "accent";
};

export function FullWidthBand({ children, className, tone = "muted" }: FullWidthBandProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-[clamp(3.5rem,8vw,6.5rem)]",
        tone === "muted" ? "bg-muted/30" : "bg-accent/25",
        className
      )}
    >
      <div className="arch-texture arch-texture-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="mx-auto w-full max-w-layout px-content-x relative">{children}</div>
    </section>
  );
}
