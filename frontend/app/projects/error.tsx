"use client";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";

type ProjectsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  return (
    <Section role="alert">
      <Stack size="lg" className="max-w-prose">
        <Heading as="h1" size="md">
          Unable to load engineering systems
        </Heading>
        <Text tone="muted">{error.message || "An unexpected error occurred while loading projects."}</Text>
        <div>
          <Button type="button" onClick={reset}>
            Retry
          </Button>
        </div>
      </Stack>
    </Section>
  );
}

