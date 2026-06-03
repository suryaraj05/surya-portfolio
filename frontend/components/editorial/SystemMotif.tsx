import { cn } from "@/lib/utils";

type SystemMotifProps = {
  className?: string;
  variant?: "hero" | "compact" | "ghost";
};

/** Signature SuryaOS topology motif — orchestration lines, not decoration */
export function SystemMotif({ className, variant = "hero" }: SystemMotifProps) {
  const opacity = variant === "ghost" ? 0.12 : variant === "compact" ? 0.55 : 0.85;

  return (
    <svg
      viewBox="0 0 400 280"
      className={cn("sys-motif-svg w-full text-foreground", className)}
      style={{ opacity }}
      aria-hidden
    >
      <defs>
        <marker id="sys-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L5,3 L0,6 Z" fill="currentColor" opacity="0.35" />
        </marker>
      </defs>
      <path
        d="M40 140 H120 M120 140 L160 100 M160 100 H240 M240 140 H320"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
        markerEnd="url(#sys-arrow)"
      />
      <path
        d="M160 100 V180 M240 140 V200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.18"
        strokeDasharray="4 5"
      />
      <circle cx="40" cy="140" r="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="120" cy="140" r="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="160" cy="100" r="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="240" cy="140" r="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="320" cy="140" r="5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="160" cy="180" r="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.25" />
      <circle cx="240" cy="200" r="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.25" />
      <text x="28" y="168" fill="currentColor" fontSize="8" stroke="none" opacity="0.4" fontFamily="ui-monospace, monospace">
        ingest
      </text>
      <text x="148" y="88" fill="currentColor" fontSize="8" stroke="none" opacity="0.5" fontFamily="ui-monospace, monospace">
        resolve
      </text>
      <text x="228" y="168" fill="currentColor" fontSize="8" stroke="none" opacity="0.4" fontFamily="ui-monospace, monospace">
        execute
      </text>
      <rect x="300" y="200" width="72" height="24" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.15" />
      <text x="308" y="216" fill="currentColor" fontSize="7" stroke="none" opacity="0.35" fontFamily="ui-monospace, monospace">
        trace
      </text>
    </svg>
  );
}
