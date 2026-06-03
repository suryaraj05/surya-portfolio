import type { ProjectNavItem } from "@/lib/case-study/types";
import Link from "next/link";

import { Container } from "@/components/layout/container";

const TAGLINES: Record<string, string> = {
  "nina-voice-ai-agent-sdk": "Voice navigation control plane",
  "visionsync-ai-preproduction-platform": "AI pre-production engine",
  "taxsetu-ai-tax-orchestration-system": "Tax workflow orchestration",
  "suryaos-core": "Platform control plane",
  voxgraph: "Audio intelligence"
};

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
    <section className="border-t border-border/30">
      <Container className="py-16 md:py-20">
        <div className="report-read mx-auto">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            Continue reading engineering reports
          </p>
          <ul className="mt-8 space-y-6">
            {items.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <span className="font-display text-xl tracking-tight text-foreground transition group-hover:underline group-hover:underline-offset-4">
                    {project.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {TAGLINES[project.slug] ?? project.short_description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
