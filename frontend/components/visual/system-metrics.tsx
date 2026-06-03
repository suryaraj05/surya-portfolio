import type { SystemMetrics } from "@/lib/project-metrics";
import { cn } from "@/lib/utils";

type SystemMetricsProps = {
  metrics: SystemMetrics;
  className?: string;
};

const statusTone: Record<SystemMetrics["deploymentStatus"], string> = {
  Production: "text-emerald-700/90",
  Staging: "text-amber-700/90",
  Pilot: "text-sky-700/90",
  Archived: "text-muted-foreground"
};

export function SystemMetricsRow({ metrics, className }: SystemMetricsProps) {
  const items = [
    { label: "Agents", value: String(metrics.agents) },
    { label: "Services", value: String(metrics.services) },
    { label: "Latency", value: metrics.latency },
    { label: "Deploy", value: metrics.deploymentStatus }
  ];

  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">{item.label}</dt>
          <dd
            className={cn(
              "mt-1 font-display text-sm tracking-tight text-foreground",
              item.label === "Deploy" ? statusTone[metrics.deploymentStatus] : undefined
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
