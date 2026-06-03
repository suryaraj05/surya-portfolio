import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { HeroAtmosphere } from "@/components/visual/hero-atmosphere";
import { ProjectPreviewCard } from "@/components/visual/project-preview-card";
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
  title: "Engineering Systems | SuryaOS",
  description: "A curated index of engineering case studies and product systems.",
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
      <Stack size="xl">
        <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
          Featured Engineering Systems
        </Heading>
        <div className="not-prose">
          {projects.map((project, index) => (
            <ProjectPreviewCard key={project.slug} project={project} index={index} variant="featured" />
          ))}
        </div>
      </Stack>
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
      <HeroAtmosphere kicker="Systems Index">
        <Stack size="lg" className="max-w-prose">
          <Heading as="h1" size="lg">
            Engineering Systems
          </Heading>
          <Text tone="muted" size="lg" className="leading-relaxed">
            A living index of product and infrastructure systems, documented as engineering case studies.
          </Text>

          <form
            method="get"
            className="not-prose mt-6 grid gap-4 rounded-xl border border-border/80 bg-background/90 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] transition duration-300 hover:border-border sm:grid-cols-[1fr_180px_180px_auto] sm:items-end"
          >
            <label className="flex flex-col gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Search</span>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search systems, challenges, outcomes..."
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Featured</span>
              <select
                name="featured"
                defaultValue={featured}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              >
                <option value="all">All</option>
                <option value="true">Featured only</option>
                <option value="false">Non-featured</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">Status</span>
              <select
                name="status"
                defaultValue={status}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="all">All</option>
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition duration-300 hover:-translate-y-px"
              >
                Apply
              </button>
              <Link
                href={{
                  pathname: "/projects",
                  query: toNavParams(undefined, "all", "published")
                }}
                className="inline-flex h-10 items-center rounded-lg border border-border/90 px-4 text-sm transition duration-300 hover:-translate-y-px"
              >
                Reset
              </Link>
            </div>
          </form>
        </Stack>
      </HeroAtmosphere>

      {showFeaturedBlock ? <FeaturedSystems projects={featuredProjects} /> : null}

      <Section rhythm="tight" className={showFeaturedBlock ? "pt-0" : undefined}>
        <Stack size="xl">
          <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
            {showFeaturedBlock ? "All Systems" : "Systems"}
          </Heading>
          {projects.length ? (
            <div className="not-prose">
              {projects.map((project, index) => (
                <ProjectPreviewCard key={project.id} project={project} index={index} variant="list" />
              ))}
            </div>
          ) : (
            <Text tone="muted">No projects match your current query and filters.</Text>
          )}
        </Stack>
      </Section>
    </>
  );
}
