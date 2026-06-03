import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EditorialHero } from "@/components/editorial/EditorialHero";
import { EditorialSystemEntry } from "@/components/editorial/EditorialSystemEntry";
import { fetchBlogs, fetchProjects, fetchSettings } from "@/lib/api/endpoints";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "SuryaOS | Systems Engineering Publication",
  description: "Building autonomous systems that behave predictably under uncertainty.",
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
      <EditorialHero
        metadata="SuryaOS · Systems Publication · Production AI Infrastructure"
        title={
          <h1 className="editorial-hero-title">
            Building autonomous systems
            <br />
            <span className="text-foreground/55">that behave predictably under uncertainty.</span>
          </h1>
        }
        signature="Language can be probabilistic. Execution cannot be."
        lead="Agentic AI engineer building production agents, voice infrastructure, and multi-agent orchestration — documented as engineering reports, not portfolio demos."
        primaryHref="/projects"
        primaryLabel="Explore systems"
        secondaryHref={resumeUrl}
        secondaryLabel="Resume"
      />

      <Section rhythm="loose" className="pt-0">
        <Container>
          <div className="mx-auto max-w-wide">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="editorial-section-eyebrow">Index · Featured</span>
                <h2 className="editorial-section-title">Engineering reports</h2>
              </div>
              <Link href="/projects" className="link-premium pb-2 text-sm text-muted-foreground">
                Full index <span aria-hidden>→</span>
              </Link>
            </div>
            {featuredProjects.length ? (
              featuredProjects.map((project, index) => (
                <EditorialSystemEntry key={project.id} project={project} index={index} />
              ))
            ) : (
              <p className="py-12 text-muted-foreground">No featured systems published yet.</p>
            )}
          </div>
        </Container>
      </Section>

      <section className="sys-cinematic-band py-[clamp(4rem,10vw,7rem)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] lg:gap-24">
            <div>
              <span className="editorial-section-eyebrow">Philosophy</span>
              <h2 className="editorial-section-title max-w-[20ch]">Systems thinking over feature chasing.</h2>
              <p className="editorial-pull mt-12 max-w-[28ch]">
                Reliability before spectacle. Observability before autonomy claims.
              </p>
            </div>
            <ul className="space-y-1 lg:pt-16">
              {["Systems thinking", "Reliability", "Agent orchestration", "Production-first mindset"].map((item) => (
                <li key={item} className="editorial-list-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Section rhythm="default">
        <Container>
          <div className="mx-auto max-w-editorial">
            <span className="editorial-section-eyebrow">Recognition</span>
            <h2 className="editorial-section-title">Selected outcomes</h2>
            <dl className="mt-14 space-y-8">
              {[
                { value: "NASSCOM × Siemens", label: "Competition winner" },
                { value: "Yuva Hackathon", label: "National winner" },
                { value: "8+", label: "Production systems shipped" },
                { value: "2.5+", label: "Years building in production" }
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-b border-border/20 pb-8 sm:flex-row sm:items-baseline sm:justify-between">
                  <dt className="font-display text-2xl tracking-tight">{item.value}</dt>
                  <dd className="sys-meta sm:text-right">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <Section rhythm="tight">
        <Container>
          <div className="mx-auto max-w-wide">
            <span className="editorial-section-eyebrow">Writing</span>
            <h2 className="editorial-section-title">Latest notes</h2>
            {blogs.length ? (
              <div className="mt-12">
                {blogs.map((blog, index) => (
                  <article
                    key={blog.id}
                    className={cn("py-10 animate-fade-up motion-reduce:animate-none", index > 0 && "border-t border-border/25")}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className={cn("grid gap-4 lg:grid-cols-12", index % 2 === 1 && "lg:[&>*:last-child]:order-first")}>
                      <div className="lg:col-span-8">
                        <h3 className="font-display text-xl tracking-tight">
                          <a href={`/insights/${blog.slug}`} className="hover:opacity-75">
                            {blog.title}
                          </a>
                        </h3>
                        <p className="mt-3 max-w-prose text-muted-foreground">{compact(blog.excerpt)}</p>
                      </div>
                      <div className="flex items-start lg:col-span-4 lg:justify-end">
                        <a href={`/insights/${blog.slug}`} className="editorial-cta-primary text-sm">
                          Read <span aria-hidden>→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-12 text-muted-foreground">No writing published yet.</p>
            )}
          </div>
        </Container>
      </Section>

      <section className="relative overflow-hidden border-t border-border/25 py-[clamp(4rem,10vw,6rem)]">
        <div className="sys-topology-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <Container className="relative">
          <div className="mx-auto max-w-editorial">
            <span className="editorial-section-eyebrow">Collaborate</span>
            <h2 className="editorial-section-title">Build systems that hold up in production.</h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Voice infrastructure, multi-agent orchestration, and production AI agents.
            </p>
            <Link href="/contact" className="editorial-cta-primary mt-10 inline-flex text-base">
              Start a conversation <span aria-hidden>→</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
