import type { ProjectNavItem } from "@/lib/case-study/types";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const TAGLINES: Record<string, string> = {
  "nina-voice-ai-agent-sdk": "Voice navigation control plane for the web",
  "visionsync-ai-preproduction-platform": "AI pre-production consistency engine",
  "taxsetu-ai-tax-orchestration-system": "Planner-led orchestration for tax workflows",
  "suryaos-core": "Portfolio platform control plane",
  voxgraph: "Audio intelligence and speech insights"
};

function taglineFor(slug: string, fallback?: string | null) {
  return TAGLINES[slug] ?? fallback ?? "Engineering system case study";
}

export function ReportContinueReading({
  projects,
  currentSlug
}: {
  projects: ProjectNavItem[];
  currentSlug?: string;
}) {
  const items = (currentSlug ? projects.filter((p) => p.slug !== currentSlug) : projects).slice(0, 3);
  if (!items.length) return null;

  return (
    <section className="report-continue border-t border-border/70">
      <Container className="py-[clamp(2.5rem,6vw,4rem)]">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Continue reading</p>
        <h2 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] tracking-tight text-foreground">
          Systems
        </h2>

        <ul className="mt-10 divide-y divide-border/70">
          {items.map((project, index) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className={cn(
                  "group editorial-hover flex flex-col gap-3 py-9 transition sm:flex-row sm:items-center sm:justify-between",
                  index === 0 && "pt-2"
                )}
              >
                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] tracking-tight transition group-hover:text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {taglineFor(project.slug, project.short_description)}
                  </p>
                </div>
                <span
                  className="shrink-0 font-display text-2xl text-foreground/20 transition duration-300 group-hover:translate-x-1 group-hover:text-foreground/70"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
