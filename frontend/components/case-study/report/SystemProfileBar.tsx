import type { SystemMetrics } from "@/lib/project-metrics";
import { cn } from "@/lib/utils";

type SystemProfileBarProps = {
  metrics: SystemMetrics;
  className?: string;
  variant?: "grid" | "flagship";
};

const deployTone: Record<SystemMetrics["deploymentStatus"], string> = {
  Production: "text-emerald-600/90",
  Staging: "text-amber-600/90",
  Pilot: "text-sky-600/90",
  Archived: "text-muted-foreground"
};

export function SystemProfileBar({ metrics, className, variant = "grid" }: SystemProfileBarProps) {
  const items = [
    { label: "Agents", value: String(metrics.agents) },
    { label: "Services", value: String(metrics.services) },
    { label: "Latency", value: metrics.latency },
    { label: "Deploy", value: metrics.deploymentStatus },
    { label: "Reliability", value: metrics.reliability }
  ];

  if (variant === "flagship") {
    return (
      <dl className={cn("report-profile-flagship space-y-0", className)} aria-label="System profile">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "flex items-baseline justify-between gap-4 border-b border-border/70 py-4 transition duration-300 hover:border-foreground/20",
              i === 0 && "border-t"
            )}
          >
            <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
            <dd
              className={cn(
                "font-display text-sm tracking-tight tabular-nums sm:text-base",
                item.label === "Deploy" ? deployTone[metrics.deploymentStatus] : "text-foreground"
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/80 bg-border/60 sm:grid-cols-5",
        className
      )}
      aria-label="System profile"
    >
      {items.map((item) => (
        <div key={item.label} className="bg-background px-4 py-4 sm:px-5 sm:py-5">
          <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
          <dd
            className={cn(
              "mt-1.5 font-display text-sm tracking-tight sm:text-base",
              item.label === "Deploy" ? deployTone[metrics.deploymentStatus] : undefined
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </div>
  );
}
