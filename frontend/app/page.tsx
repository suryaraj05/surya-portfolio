import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { FullWidthBand } from "@/components/visual/full-width-band";
import { HeroAtmosphere } from "@/components/visual/hero-atmosphere";
import { ProjectPreviewCard } from "@/components/visual/project-preview-card";
import { fetchBlogs, fetchProjects, fetchSettings } from "@/lib/api/endpoints";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

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
      <HeroAtmosphere kicker="SuryaOS · Engineering Systems">
        <Stack size="xl" className="max-w-[42rem]">
          <Heading as="h1" size="xl">
            Building autonomous software systems that can reason, plan, and execute.
          </Heading>
          <Text tone="muted" size="lg" className="max-w-prose text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed">
            Agentic AI Engineer focused on production AI agents, voice AI infrastructure, and multi-agent
            orchestration.
          </Text>
          <div className="not-prose flex flex-wrap gap-3 pt-2">
            <Link
              href="/projects"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition duration-300 ease-editorial hover:-translate-y-px hover:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)]"
            >
              View Systems
            </Link>
            <a
              href={resumeUrl}
              target={resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel={resumeUrl.startsWith("http") ? "noreferrer noopener" : undefined}
              className="inline-flex h-11 items-center rounded-lg border border-border/90 px-5 text-sm font-medium transition duration-300 ease-editorial hover:-translate-y-px hover:border-foreground/20"
            >
              Download Resume
            </a>
          </div>
        </Stack>
      </HeroAtmosphere>

      <Section rhythm="tight" className="pt-0">
        <Stack size="xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
              Featured Systems
            </Heading>
            <Link href="/projects" className="link-premium text-sm text-muted-foreground">
              View all systems <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="not-prose">
            {featuredProjects.length ? (
              featuredProjects.map((project, index) => (
                <ProjectPreviewCard key={project.id} project={project} index={index} variant="featured" />
              ))
            ) : (
              <Text tone="muted">No featured systems are available right now.</Text>
            )}
          </div>
        </Stack>
      </Section>

      <FullWidthBand>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:items-start">
          <Stack size="lg" className="max-w-prose lg:pr-8">
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">Engineering Philosophy</p>
            <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
              Systems thinking over feature chasing.
            </Heading>
            <Text tone="muted" size="md" className="leading-relaxed">
              Reliability before spectacle. Agent orchestration designed for production reality, with observability and
              controlled autonomy as first principles.
            </Text>
          </Stack>
          <ul className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:pl-6">
            {["Systems thinking", "Reliability", "Agent orchestration", "Production-first mindset"].map((item, i) => (
              <li
                key={item}
                className={cn(
                  "stat-card py-2 text-base leading-relaxed",
                  i % 2 === 1 ? "lg:ml-8" : undefined
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </FullWidthBand>

      <Section rhythm="default">
        <Stack size="xl">
          <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
            Selected Achievements
          </Heading>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              "NASSCOM x Siemens Winner",
              "Yuva Hackathon Winner",
              "8+ Production Systems",
              "2.5+ Years Building"
            ].map((label, i) => (
              <div key={label} className={cn("stat-card", i === 3 ? "lg:mt-6" : undefined)}>
                <Text size="md" className="font-medium">
                  {label}
                </Text>
              </div>
            ))}
          </div>
        </Stack>
      </Section>

      <Section rhythm="tight">
        <Stack size="xl">
          <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
            Latest Writing
          </Heading>
          {blogs.length ? (
            <div className="not-prose">
              {blogs.map((blog, index) => (
                <article
                  key={blog.id}
                  className="group editorial-hover border-b border-border/80 py-10 first:pt-2 animate-fade-up motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className={cn(
                      "grid gap-6 md:items-start",
                      index % 2 === 0 ? "md:grid-cols-[1.15fr_140px]" : "md:grid-cols-[140px_1.15fr]"
                    )}
                  >
                    <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                      <Heading as="h3" size="sm" className="text-xl">
                        <a href={`/insights/${blog.slug}`} className="underline-offset-4 hover:underline">
                          {blog.title}
                        </a>
                      </Heading>
                      <Text tone="muted" size="md" className="mt-2 max-w-prose">
                        {compact(blog.excerpt, "Latest engineering writing from SuryaOS.")}
                      </Text>
                    </div>
                    <div className={cn("md:text-right", index % 2 === 1 ? "md:order-1 md:text-left" : undefined)}>
                      <a href={`/insights/${blog.slug}`} className="link-premium text-sm">
                        Read <span aria-hidden>→</span>
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

      <FullWidthBand tone="accent" className="border-t border-border/60">
        <Stack size="md" className="max-w-prose">
          <Heading as="h2" size="md" className="text-[clamp(1.65rem,2.5vw,2.25rem)]">
            Let&apos;s build autonomous systems.
          </Heading>
          <Text tone="muted" className="leading-relaxed">
            Collaborations on production AI agents, voice infrastructure, and multi-agent orchestration.
          </Text>
          <div className="not-prose pt-2">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-lg border border-border/90 px-4 text-sm transition duration-300 ease-editorial hover:-translate-y-px hover:border-foreground/25"
            >
              Contact
            </Link>
          </div>
        </Stack>
      </FullWidthBand>
    </>
  );
}
