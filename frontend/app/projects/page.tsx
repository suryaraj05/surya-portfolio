import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EditorialSystemEntry } from "@/components/editorial/EditorialSystemEntry";
import { SystemMotif } from "@/components/editorial/SystemMotif";
import { fetchProjects } from "@/lib/api/endpoints";
import { buildMetadata } from "@/lib/seo/metadata";
import type { ProjectDTO } from "@/src/contracts/types";

type ProjectsPageProps = {
  searchParams: Promise<{
    q?: string;
    featured?: "all" | "true" | "false";
    status?: string;
  }>;
};

export const metadata: Metadata = buildMetadata({
  title: "Systems Index | SuryaOS",
  description: "Engineering reports on production AI infrastructure and autonomous systems.",
  path: "/projects"
});

function toApiFeatured(value?: "all" | "true" | "false"): string | undefined {
  if (!value || value === "all") return undefined;
  return value;
}

function toNavParams(
  q?: string,
  featured?: "all" | "true" | "false",
  status?: string
): Record<string, string> {
  const out: Record<string, string> = {};
  if (q) out.q = q;
  if (featured && featured !== "all") out.featured = featured;
  if (status && status !== "all") out.status = status;
  return out;
}

function FeaturedSystems({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return null;
  return (
    <Section rhythm="tight" className="pt-0">
      <Container>
        <div className="mx-auto max-w-wide">
          <span className="editorial-section-eyebrow">Featured</span>
          {projects.map((project, index) => (
            <EditorialSystemEntry key={project.slug} project={project} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";
  const featured = (sp.featured ?? "all") as "all" | "true" | "false";
  const status = sp.status?.trim() || "published";

  const listParams: Record<string, string> = {
    page: "1",
    page_size: "100",
    sort_by: "sort_order",
    sort_order: "asc"
  };
  if (status !== "all") listParams.status = status;
  if (q) listParams.search = q;
  const featuredFilter = toApiFeatured(featured);
  if (featuredFilter) listParams.featured = featuredFilter;

  const [listResponse, featuredResponse] = await Promise.all([
    fetchProjects(listParams),
    fetchProjects({
      page: "1",
      page_size: "6",
      sort_by: "sort_order",
      sort_order: "asc",
      status: "published",
      featured: "true"
    })
  ]);

  const projects = listResponse.data.items;
  const featuredProjects = featuredResponse.data.items;
  const showFeaturedBlock = featured === "all" && !q;

  return (
    <>
      <header className="relative overflow-hidden border-b border-border/25">
        <div className="sys-atmosphere pointer-events-none absolute inset-0" aria-hidden />
        <div className="sys-topology-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <Container className="relative py-[clamp(4rem,10vw,7rem)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-end">
            <div className="max-w-wide">
              <p className="sys-meta">Systems Index · Engineering Reports</p>
              <h1 className="editorial-hero-title mt-8 text-[clamp(2.25rem,5vw,3.75rem)]">
                Production systems,
                <br />
                <span className="text-foreground/55">documented as infrastructure.</span>
              </h1>
              <p className="mt-8 max-w-prose text-lg leading-relaxed text-muted-foreground">
                A living index of agentic systems, voice infrastructure, and orchestration — each published as a flagship report.
              </p>

              <form method="get" className="not-prose mt-12 grid gap-6 border-t border-border/25 pt-10 sm:grid-cols-2 lg:grid-cols-[1fr_140px_140px_auto] lg:items-end">
                <label className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                  <span className="sys-meta">Search</span>
                  <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Systems, outcomes, stack..."
                    className="h-11 border-b border-border bg-transparent px-0 text-sm outline-none transition focus:border-foreground"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="sys-meta">Featured</span>
                  <select
                    name="featured"
                    defaultValue={featured}
                    className="h-11 border-b border-border bg-transparent text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="true">Featured</option>
                    <option value="false">Other</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="sys-meta">Status</span>
                  <select
                    name="status"
                    defaultValue={status}
                    className="h-11 border-b border-border bg-transparent text-sm outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                    <option value="all">All</option>
                  </select>
                </label>

                <div className="flex gap-6 sm:col-span-2 lg:col-span-1">
                  <button type="submit" className="editorial-cta-primary text-sm">
                    Apply <span aria-hidden>→</span>
                  </button>
                  <Link
                    href={{ pathname: "/projects", query: toNavParams(undefined, "all", "published") }}
                    className="editorial-cta-secondary text-sm"
                  >
                    Reset
                  </Link>
                </div>
              </form>
            </div>
            <div className="hidden lg:block">
              <SystemMotif variant="compact" />
            </div>
          </div>
        </Container>
      </header>

      {showFeaturedBlock ? <FeaturedSystems projects={featuredProjects} /> : null}

      <Section rhythm="tight" className={showFeaturedBlock ? "pt-0" : undefined}>
        <Container>
          <div className="mx-auto max-w-wide">
            <span className="editorial-section-eyebrow">{showFeaturedBlock ? "All reports" : "Reports"}</span>
            {projects.length ? (
              projects.map((project, index) => (
                <EditorialSystemEntry key={project.id} project={project} index={index} />
              ))
            ) : (
              <p className="py-12 text-muted-foreground">No systems match your query.</p>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
