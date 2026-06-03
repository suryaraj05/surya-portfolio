import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ProjectDTO } from "@/src/contracts/types";

import { getSystemMetrics } from "@/lib/project-metrics";

type EditorialSystemEntryProps = {
  project: ProjectDTO;
  index: number;
};

function compact(text?: string | null, max = 160): string {
  if (!text?.trim()) return "Engineering system report.";
  const n = text.replace(/\s+/g, " ").trim();
  return n.length > max ? `${n.slice(0, max - 3)}...` : n;
}

export function EditorialSystemEntry({ project, index }: EditorialSystemEntryProps) {
  const metrics = getSystemMetrics(project.slug, project.tech_stack ?? []);
  const reversed = index % 2 === 1;

  return (
    <article
      className={cn(
        "group py-14 animate-fade-up motion-reduce:animate-none",
        index > 0 && "border-t border-border/25"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={cn(
          "grid gap-6 lg:grid-cols-12 lg:items-baseline lg:gap-10",
          reversed && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div className={cn("lg:col-span-4", reversed ? "lg:text-right" : undefined)}>
          <p className="sys-meta">Report · {String(index + 1).padStart(2, "0")}</p>
          <p className="mt-3 font-mono text-[0.7rem] text-muted-foreground">
            {metrics.agents} agents · {metrics.latency} · {metrics.deploymentStatus}
          </p>
        </div>
        <div className="lg:col-span-8">
          <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.1rem)] leading-tight tracking-[-0.02em]">
            <Link href={`/projects/${project.slug}`} className="transition hover:opacity-75">
              {project.title}
            </Link>
          </h3>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
            {compact(project.short_description)}
          </p>
          <Link
            href={`/projects/${project.slug}`}
            className="editorial-cta-primary mt-6 inline-flex text-sm"
          >
            Read report <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
