import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DarkInversionBandProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function DarkInversionBand({ children, className, id }: DarkInversionBandProps) {
  return (
    <section id={id} className={cn("report-dark-band relative left-1/2 -mx-[50vw] w-screen max-w-[100vw]", className)}>
      <div className="arch-texture arch-texture-grid pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="relative mx-auto w-full max-w-layout px-content-x py-section-tight">{children}</div>
    </section>
  );
}
