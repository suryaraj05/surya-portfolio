import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { RichText } from "@/components/case-study/RichText";
import { fetchProjects } from "@/lib/api/endpoints";
import { getArchitectureContent } from "@/lib/cms/architecture-content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Architecture | SuryaOS",
  description:
    "Principles, patterns, and lessons learned from building production AI systems, multi-agent platforms, and voice infrastructure.",
  path: "/architecture"
});

const agentBoundarySvg = `
<svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Agent boundaries diagram">
  <rect x="20" y="20" width="860" height="380" rx="16" fill="white" stroke="#d7dbe3"/>
  <rect x="70" y="90" width="170" height="90" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="155" y="130" text-anchor="middle" font-size="20" font-family="Inter, system-ui">Parser</text>
  <text x="155" y="155" text-anchor="middle" font-size="13" fill="#556070" font-family="Inter, system-ui">Intent only</text>

  <rect x="290" y="90" width="170" height="90" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="375" y="130" text-anchor="middle" font-size="20" font-family="Inter, system-ui">Resolver</text>
  <text x="375" y="155" text-anchor="middle" font-size="13" fill="#556070" font-family="Inter, system-ui">Policy + mapping</text>

  <rect x="510" y="90" width="170" height="90" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="595" y="130" text-anchor="middle" font-size="20" font-family="Inter, system-ui">Executor</text>
  <text x="595" y="155" text-anchor="middle" font-size="13" fill="#556070" font-family="Inter, system-ui">Deterministic side-effects</text>

  <rect x="730" y="90" width="120" height="90" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="790" y="130" text-anchor="middle" font-size="20" font-family="Inter, system-ui">Recovery</text>
  <text x="790" y="155" text-anchor="middle" font-size="13" fill="#556070" font-family="Inter, system-ui">Fallback path</text>

  <line x1="240" y1="135" x2="290" y2="135" stroke="#6c7788" marker-end="url(#arrow)"/>
  <line x1="460" y1="135" x2="510" y2="135" stroke="#6c7788" marker-end="url(#arrow)"/>
  <line x1="680" y1="135" x2="730" y2="135" stroke="#6c7788" marker-end="url(#arrow)"/>

  <rect x="70" y="240" width="780" height="110" rx="10" fill="#f9fafc" stroke="#d4dae4"/>
  <text x="95" y="275" font-size="18" font-family="Inter, system-ui">Boundary principle:</text>
  <text x="95" y="305" font-size="14" fill="#4f5a6b" font-family="Inter, system-ui">
    No single agent owns interpretation, policy, and execution simultaneously.
  </text>
  <text x="95" y="327" font-size="14" fill="#4f5a6b" font-family="Inter, system-ui">
    Failure isolation keeps drift local and recovery explicit.
  </text>

  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#6c7788"/>
    </marker>
  </defs>
</svg>
`;

const voicePipelineSvg = `
<svg viewBox="0 0 1000 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Voice system pipeline">
  <rect x="20" y="20" width="960" height="320" rx="16" fill="white" stroke="#d7dbe3"/>
  <g font-family="Inter, system-ui">
    <rect x="60" y="130" width="120" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
    <text x="120" y="172" text-anchor="middle" font-size="15">STT</text>
    <rect x="220" y="130" width="140" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
    <text x="290" y="172" text-anchor="middle" font-size="15">Intent</text>
    <rect x="400" y="130" width="140" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
    <text x="470" y="172" text-anchor="middle" font-size="15">Decision</text>
    <rect x="580" y="130" width="140" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
    <text x="650" y="172" text-anchor="middle" font-size="15">Execution</text>
    <rect x="760" y="130" width="180" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
    <text x="850" y="160" text-anchor="middle" font-size="15">Feedback / TTS</text>
    <text x="850" y="183" text-anchor="middle" font-size="12" fill="#5d6878">Streaming + latency control</text>
  </g>
  <line x1="180" y1="165" x2="220" y2="165" stroke="#6c7788" marker-end="url(#a)"/>
  <line x1="360" y1="165" x2="400" y2="165" stroke="#6c7788" marker-end="url(#a)"/>
  <line x1="540" y1="165" x2="580" y2="165" stroke="#6c7788" marker-end="url(#a)"/>
  <line x1="720" y1="165" x2="760" y2="165" stroke="#6c7788" marker-end="url(#a)"/>
  <defs>
    <marker id="a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#6c7788"/>
    </marker>
  </defs>
</svg>
`;

const orchestrationSvg = `
<svg viewBox="0 0 980 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Multi-agent orchestration tree">
  <rect x="20" y="20" width="940" height="380" rx="16" fill="white" stroke="#d7dbe3"/>
  <rect x="410" y="55" width="160" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="490" y="95" text-anchor="middle" font-size="16" font-family="Inter, system-ui">Planner</text>
  <line x1="490" y1="125" x2="490" y2="165" stroke="#6c7788"/>

  <rect x="120" y="175" width="180" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="210" y="215" text-anchor="middle" font-size="14" font-family="Inter, system-ui">Extraction Agent</text>

  <rect x="400" y="175" width="180" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="490" y="215" text-anchor="middle" font-size="14" font-family="Inter, system-ui">Validation Agent</text>

  <rect x="680" y="175" width="180" height="70" rx="10" fill="#f6f8fb" stroke="#cfd5df"/>
  <text x="770" y="215" text-anchor="middle" font-size="14" font-family="Inter, system-ui">Policy Agent</text>

  <line x1="490" y1="165" x2="210" y2="175" stroke="#6c7788"/>
  <line x1="490" y1="165" x2="490" y2="175" stroke="#6c7788"/>
  <line x1="490" y1="165" x2="770" y2="175" stroke="#6c7788"/>

  <rect x="335" y="285" width="310" height="80" rx="10" fill="#f9fafc" stroke="#d4dae4"/>
  <text x="490" y="320" text-anchor="middle" font-size="14" font-family="Inter, system-ui">
    Confidence + retries + failure routing decide next step
  </text>
  <text x="490" y="343" text-anchor="middle" font-size="13" fill="#5d6878" font-family="Inter, system-ui">
    advance | fallback model | manual review | safe stop
  </text>
</svg>
`;

function sectionId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function ArchitecturePage() {
  const { sections, order } = getArchitectureContent();
  const projectsResponse = await fetchProjects({
    page: "1",
    page_size: "100",
    sort_by: "sort_order",
    sort_order: "asc",
    status: "published"
  });

  const projectsBySlug = new Map(projectsResponse.data.items.map((p) => [p.slug, p]));
  const selectedSlugs = [
    "nina-voice-ai-agent-sdk",
    "taxsetu-ai-tax-orchestration-system",
    "visionsync-ai-preproduction-platform"
  ];
  const selectedArchitectures = selectedSlugs
    .map((slug) => projectsBySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Section className="pt-[clamp(3rem,9vw,8rem)]">
        <Stack size="lg" className="max-w-prose">
          <Heading as="h1" size="xl">
            How I Build Autonomous Systems
          </Heading>
          <Text tone="muted" size="lg">
            Principles, patterns, and lessons learned from building production AI systems, multi-agent platforms, and voice infrastructure.
          </Text>
        </Stack>
      </Section>

      {order.map((title) => {
        const markdown = sections[title];
        if (!markdown) return null;

        return (
          <Section key={title} id={sectionId(title)} className="pt-[clamp(2.5rem,6vw,5rem)]">
            <Stack size="lg">
              <Heading as="h2" size="md" className="text-2xl">
                {title}
              </Heading>

              {title === "Agent Boundaries" ? (
                <ArchitectureDiagram spec={{ type: "svgInline", svgMarkup: agentBoundarySvg, caption: "Bounded-role architecture for autonomous execution safety." }} />
              ) : null}

              {title === "Voice System Design" ? (
                <ArchitectureDiagram spec={{ type: "svgInline", svgMarkup: voicePipelineSvg, caption: "Voice runtime designed as a deterministic pipeline, not a single model call." }} />
              ) : null}

              {title === "Multi-Agent Orchestration" ? (
                <ArchitectureDiagram spec={{ type: "svgInline", svgMarkup: orchestrationSvg, caption: "Planner-led orchestration with confidence-based control flow." }} />
              ) : null}

              <div className="max-w-prose">
                <RichText markdown={markdown} />
              </div>
            </Stack>
          </Section>
        );
      })}

      <Section className="pb-[clamp(3rem,8vw,6rem)] pt-[clamp(2.5rem,6vw,5rem)]">
        <Stack size="lg">
          <Heading as="h2" size="md" className="text-2xl">
            Selected Architectures
          </Heading>
          {selectedArchitectures.length ? (
            <div className="not-prose space-y-6">
              {selectedArchitectures.map((project) => (
                <article key={project.id} className="border-b border-border pb-6">
                  <Heading as="h3" size="sm" className="text-xl">
                    <Link href={`/projects/${project.slug}`} className="underline-offset-4 hover:underline">
                      {project.title}
                    </Link>
                  </Heading>
                  <Text tone="muted" size="md" className="mt-2 max-w-prose">
                    {project.short_description ?? "Engineering case study"}
                  </Text>
                </article>
              ))}
            </div>
          ) : (
            <Text tone="muted">Selected architecture case studies will appear here as projects are published.</Text>
          )}
        </Stack>
      </Section>
    </>
  );
}

