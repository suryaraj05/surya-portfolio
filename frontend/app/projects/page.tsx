import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
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

function compact(text?: string | null, fallback = "Not specified"): string {
  if (!text || !text.trim()) return fallback;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 220 ? `${normalized.slice(0, 217)}...` : normalized;
}

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

function ProjectEditorialRow({ project }: { project: ProjectDTO }) {
  return (
    <article className="border-b border-border pb-12 pt-10 first:pt-2">
      <Stack size="md" className="max-w-prose">
        <Heading as="h2" size="md" className="text-[clamp(1.4rem,2.2vw,2rem)]">
          <Link
            href={`/projects/${project.slug}`}
            className="underline-offset-4 hover:underline focus-visible:underline"
          >
            {project.title}
          </Link>
        </Heading>

        <Text tone="muted" size="lg">
          {compact(project.short_description, "Engineering system case study.")}
        </Text>

        <div className="grid gap-6 pt-2 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.08em] text-muted-foreground">Challenge</p>
            <Text size="sm">{compact(project.problem, "Challenge details are documented in the full case study.")}</Text>
          </div>
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.08em] text-muted-foreground">Outcome</p>
            <Text size="sm">{compact(project.solution, "Outcome details are documented in the full case study.")}</Text>
          </div>
        </div>
      </Stack>
    </article>
  );
}

function FeaturedSystems({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return null;
  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          Featured Engineering Systems
        </Heading>
        <div className="space-y-8">
          {projects.map((project) => (
            <article key={project.slug} className="max-w-prose border-l border-border pl-5">
              <Heading as="h3" size="sm" className="text-xl">
                <Link href={`/projects/${project.slug}`} className="underline-offset-4 hover:underline">
                  {project.title}
                </Link>
              </Heading>
              <Text tone="muted" size="md" className="mt-2">
                {compact(project.short_description, "Engineering system case study.")}
              </Text>
            </article>
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

  return (
    <>
      <Section className="pt-[clamp(2.5rem,7vw,6rem)]">
        <Stack size="lg" className="max-w-prose">
          <Heading as="h1" size="lg">
            Engineering Systems
          </Heading>
          <Text tone="muted" size="lg">
            A living index of product and infrastructure systems, documented as engineering case studies.
          </Text>

          <form method="get" className="not-prose mt-4 grid gap-4 rounded-xl border border-border bg-background p-5 sm:grid-cols-[1fr_180px_180px_auto] sm:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Search</span>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search systems, challenges, outcomes..."
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/40 focus:ring-2"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Featured</span>
              <select
                name="featured"
                defaultValue={featured}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/40 focus:ring-2"
              >
                <option value="all">All</option>
                <option value="true">Featured only</option>
                <option value="false">Non-featured</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <select
                name="status"
                defaultValue={status}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/40 focus:ring-2"
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
                className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                Apply
              </button>
              <Link
                href={{
                  pathname: "/projects",
                  query: toNavParams(undefined, "all", "published")
                }}
                className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm"
              >
                Reset
              </Link>
            </div>
          </form>
        </Stack>
      </Section>

      <FeaturedSystems projects={featuredProjects} />

      <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="lg">
          <Heading as="h2" size="md" className="text-2xl">
            All Systems
          </Heading>
          {projects.length ? (
            <div className="not-prose">
              {projects.map((project) => (
                <ProjectEditorialRow key={project.id} project={project} />
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

