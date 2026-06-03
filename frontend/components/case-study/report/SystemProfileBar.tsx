import type { SystemMetrics } from "@/lib/project-metrics";
import { cn } from "@/lib/utils";

type SystemProfileBarProps = {
  metrics: SystemMetrics;
  className?: string;
};

const deployTone: Record<SystemMetrics["deploymentStatus"], string> = {
  Production: "text-emerald-600/90",
  Staging: "text-amber-600/90",
  Pilot: "text-sky-600/90",
  Archived: "text-muted-foreground"
};

export function SystemProfileBar({ metrics, className }: SystemProfileBarProps) {
  const items = [
    { label: "Agents", value: String(metrics.agents) },
    { label: "Services", value: String(metrics.services) },
    { label: "Latency", value: metrics.latency },
    { label: "Deployment", value: metrics.deploymentStatus },
    { label: "Reliability", value: metrics.reliability }
  ];

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
              "mt-1.5 font-display text-sm tracking-tight text-foreground sm:text-base",
              item.label === "Deployment" ? deployTone[metrics.deploymentStatus] : undefined
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </div>
  );
}
