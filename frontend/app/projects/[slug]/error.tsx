"use client";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Stack } from "@/components/layout/stack";

type ProjectDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectDetailError({ error, reset }: ProjectDetailErrorProps) {
  return (
    <Section role="alert">
      <Stack size="lg" className="max-w-prose">
        <Heading as="h1" size="md">
          Unable to load case study
        </Heading>
        <Text tone="muted">
          {error.message || "Something went wrong while loading this project."}
        </Text>
        <div>
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        </div>
      </Stack>
    </Section>
  );
}

