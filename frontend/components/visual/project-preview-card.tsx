import Link from "next/link";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getSystemMetrics } from "@/lib/project-metrics";
import { cn } from "@/lib/utils";
import type { ProjectDTO } from "@/src/contracts/types";

import { ArchitectureThumbnail } from "./architecture-thumbnail";
import { SystemMetricsRow } from "./system-metrics";

type ProjectPreviewCardProps = {
  project: ProjectDTO;
  index?: number;
  variant?: "featured" | "list";
  className?: string;
};

function compact(text?: string | null, fallback = "Not specified", max = 190): string {
  if (!text || !text.trim()) return fallback;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
}

export function ProjectPreviewCard({ project, index = 0, variant = "list", className }: ProjectPreviewCardProps) {
  const metrics = getSystemMetrics(project.slug, project.tech_stack ?? []);
  const reversed = index % 2 === 1;

  return (
    <article
      className={cn(
        "group editorial-hover border-b border-border/80 py-12 first:pt-2 md:py-14",
        "animate-fade-up motion-reduce:animate-none",
        className
      )}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div
        className={cn(
          "grid items-start gap-8 lg:gap-12",
          variant === "featured"
            ? reversed
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]"
              : "lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]"
            : reversed
              ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(240px,320px)]"
              : "lg:grid-cols-[minmax(240px,320px)_minmax(0,1.05fr)]"
        )}
      >
        <div className={cn(reversed ? "lg:order-2" : "lg:order-1")}>
          <ArchitectureThumbnail slug={project.slug} title={project.title} />
        </div>

        <div className={cn("flex flex-col gap-6", reversed ? "lg:order-1 lg:pr-4" : "lg:order-2 lg:pl-2")}>
          <div className="space-y-3">
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">Engineering System</p>
            <Heading as="h3" size={variant === "featured" ? "md" : "sm"} className={variant === "featured" ? "text-2xl md:text-3xl" : "text-xl"}>
              <Link href={`/projects/${project.slug}`} className="underline-offset-4 hover:underline">
                {project.title}
              </Link>
            </Heading>
            <Text tone="muted" size="lg" className="max-w-prose">
              {compact(project.short_description, "Engineering system case study.")}
            </Text>
          </div>

          <SystemMetricsRow metrics={metrics} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Challenge</p>
              <Text size="sm">{compact(project.problem, "Documented in the full case study.", 140)}</Text>
            </div>
            <div>
              <p className="mb-2 text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Outcome</p>
              <Text size="sm">{compact(project.solution, "Documented in the full case study.", 140)}</Text>
            </div>
          </div>

          <div>
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:translate-x-0.5"
            >
              Read case study
              <span aria-hidden className="transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
