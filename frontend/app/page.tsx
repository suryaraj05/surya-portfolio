import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { fetchBlogs, fetchProjects, fetchSettings } from "@/lib/api/endpoints";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "SuryaOS | Engineering Systems Company",
  description: "Building autonomous software systems that can reason, plan, and execute.",
  path: "/"
});

function compact(text?: string | null, fallback = "No summary available"): string {
  if (!text || !text.trim()) return fallback;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 190 ? `${normalized.slice(0, 187)}...` : normalized;
}

export default async function HomePage() {
  const [featuredResponse, blogsResponse, settingsResponse] = await Promise.all([
    fetchProjects({
      page: "1",
      page_size: "3",
      sort_by: "sort_order",
      sort_order: "asc",
      featured: "true",
      status: "published"
    }),
    fetchBlogs({
      page: "1",
      page_size: "3",
      sort_by: "published_at",
      sort_order: "desc",
      published: "true"
    }),
    fetchSettings()
  ]);

  const featuredProjects = featuredResponse.data.items;
  const blogs = blogsResponse.data.items;
  const resumeUrl = (settingsResponse.data.resume_url as string | undefined) || "#";

  return (
    <>
      <Section className="pt-[clamp(3rem,9vw,8rem)]">
        <Stack size="lg" className="max-w-prose">
          <Heading as="h1" size="xl">
            Building autonomous software systems that can reason, plan, and execute.
          </Heading>
          <Text tone="muted" size="lg">
            Agentic AI Engineer focused on production AI agents, voice AI infrastructure, and multi-agent orchestration.
          </Text>
          <div className="not-prose flex flex-wrap gap-3 pt-2">
            <Link
              href="/projects"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              View Systems
            </Link>
            <a
              href={resumeUrl}
              target={resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel={resumeUrl.startsWith("http") ? "noreferrer noopener" : undefined}
              className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium"
            >
              Download Resume
            </a>
          </div>
        </Stack>
      </Section>

      <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="lg">
          <Heading as="h2" size="md" className="text-2xl">
            Featured Systems
          </Heading>
          <div className="not-prose">
            {featuredProjects.length ? (
              featuredProjects.map((project) => (
                <article key={project.id} className="border-b border-border py-10 first:pt-2">
                  <div className="grid gap-6 md:grid-cols-[1.2fr_1fr_180px] md:items-start">
                    <div>
                      <Heading as="h3" size="sm" className="text-xl">
                        <Link href={`/projects/${project.slug}`} className="underline-offset-4 hover:underline">
                          {project.title}
                        </Link>
                      </Heading>
                      <Text tone="muted" size="md" className="mt-2 max-w-prose">
                        {compact(project.short_description, "Engineering system case study.")}
                      </Text>
                    </div>
                    <div>
                      <p className="mb-2 text-sm uppercase tracking-[0.08em] text-muted-foreground">Outcome</p>
                      <Text size="sm">
                        {compact(project.solution, "Outcome is documented in the full case study.")}
                      </Text>
                    </div>
                    <div className="md:text-right">
                      <Link href={`/projects/${project.slug}`} className="text-sm underline underline-offset-4">
                        Read Case Study
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <Text tone="muted">No featured systems are available right now.</Text>
            )}
          </div>
        </Stack>
      </Section>

      <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="lg" className="max-w-prose">
          <Heading as="h2" size="md" className="text-2xl">
            Engineering Philosophy
          </Heading>
          <Text tone="muted" size="md">
            Systems thinking over feature chasing. Reliability before spectacle. Agent orchestration designed for
            production reality, with observability and controlled autonomy as first principles.
          </Text>
          <ul className="not-prose list-disc pl-6 text-base leading-relaxed">
            <li>Systems thinking</li>
            <li>Reliability</li>
            <li>Agent orchestration</li>
            <li>Production-first mindset</li>
          </ul>
        </Stack>
      </Section>

      <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="lg">
          <Heading as="h2" size="md" className="text-2xl">
            Selected Achievements
          </Heading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-l border-border pl-4">
              <Text size="md">NASSCOM x Siemens Winner</Text>
            </div>
            <div className="border-l border-border pl-4">
              <Text size="md">Yuva Hackathon Winner</Text>
            </div>
            <div className="border-l border-border pl-4">
              <Text size="md">8+ Production Systems</Text>
            </div>
            <div className="border-l border-border pl-4">
              <Text size="md">2.5+ Years Building</Text>
            </div>
          </div>
        </Stack>
      </Section>

      <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="lg">
          <Heading as="h2" size="md" className="text-2xl">
            Latest Writing
          </Heading>
          {blogs.length ? (
            <div className="not-prose">
              {blogs.map((blog) => (
                <article key={blog.id} className="border-b border-border py-8 first:pt-2">
                  <div className="grid gap-4 md:grid-cols-[1fr_160px] md:items-start">
                    <div>
                      <Heading as="h3" size="sm" className="text-xl">
                        <a href={`/insights/${blog.slug}`} className="underline-offset-4 hover:underline">
                          {blog.title}
                        </a>
                      </Heading>
                      <Text tone="muted" size="md" className="mt-2 max-w-prose">
                        {compact(blog.excerpt, "Latest engineering writing from SuryaOS.")}
                      </Text>
                    </div>
                    <div className="md:text-right">
                      <a href={`/insights/${blog.slug}`} className="text-sm underline underline-offset-4">
                        Read
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Text tone="muted">No writing published yet.</Text>
          )}
        </Stack>
      </Section>

      <Section className="pb-[clamp(3rem,8vw,6rem)] pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="md" className="max-w-prose">
          <Heading as="h2" size="md" className="text-2xl">
            Let&apos;s build autonomous systems.
          </Heading>
          <Text tone="muted">
            Collaborations on production AI agents, voice infrastructure, and multi-agent orchestration.
          </Text>
          <div className="not-prose">
            <Link href="/contact" className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm">
              Contact
            </Link>
          </div>
        </Stack>
      </Section>
    </>
  );
}
