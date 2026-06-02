import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { DirectLinks } from "@/components/contact/DirectLinks";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { fetchSettings } from "@/lib/api/endpoints";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact | SuryaOS",
  description:
    "Convert ideas into production autonomous systems. Reach out for AI product engineering, voice AI, and multi-agent orchestration.",
  path: "/contact"
});

export default async function ContactPage() {
  const settings = (await fetchSettings()).data;

  const email = (settings.email as string | undefined) ?? undefined;
  const linkedinUrl = (settings.linkedin_url as string | undefined) ?? undefined;
  const githubUrl = (settings.github_url as string | undefined) ?? undefined;
  const resumeUrl = (settings.resume_url as string | undefined) ?? undefined;

  return (
    <>
      <Section className="pt-[clamp(3rem,9vw,8rem)]">
        <Stack size="lg" className="max-w-prose">
          <Heading as="h1" size="xl">
            Let&apos;s Build Autonomous Systems.
          </Heading>
          <Text tone="muted" size="lg">
            Whether you&apos;re building an AI product, multi-agent platform, voice interface, or internal automation
            system, I&apos;d love to hear about it.
          </Text>
        </Stack>
      </Section>

      <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_380px] lg:items-start">
          <Stack size="lg">
            <Heading as="h2" size="md" className="text-2xl">
              Project Inquiry
            </Heading>
            <ContactForm />
          </Stack>

          <Stack size="lg">
            <div>
              <Heading as="h2" size="sm" className="text-xl">
                What I Can Help With
              </Heading>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>Agentic AI Systems</li>
                <li>Voice AI</li>
                <li>Multi-Agent Platforms</li>
                <li>RAG Systems</li>
                <li>AI Product Engineering</li>
                <li>System Architecture</li>
              </ul>
            </div>

            <div>
              <Heading as="h2" size="sm" className="text-xl">
                Direct Contact
              </Heading>
              <div className="mt-4">
                <DirectLinks email={email} linkedinUrl={linkedinUrl} githubUrl={githubUrl} resumeUrl={resumeUrl} />
              </div>
            </div>

            <div>
              <Heading as="h2" size="sm" className="text-xl">
                Trust
              </Heading>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="border-l border-border pl-4">
                  <Text size="md">2.5+ Years Building</Text>
                </div>
                <div className="border-l border-border pl-4">
                  <Text size="md">8+ Production Systems</Text>
                </div>
                <div className="border-l border-border pl-4">
                  <Text size="md">NASSCOM x Siemens Winner</Text>
                </div>
                <div className="border-l border-border pl-4">
                  <Text size="md">Yuva Hackathon Winner</Text>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </Section>
    </>
  );
}

