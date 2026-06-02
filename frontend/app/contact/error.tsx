"use client";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

type ContactErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ContactError({ error, reset }: ContactErrorProps) {
  return (
    <Section role="alert">
      <Stack size="lg" className="max-w-prose">
        <Heading as="h1" size="md">
          Unable to load contact workflow
        </Heading>
        <Text tone="muted">{error.message || "Please retry in a few moments."}</Text>
        <div>
          <Button onClick={reset}>Retry</Button>
        </div>
      </Stack>
    </Section>
  );
}

