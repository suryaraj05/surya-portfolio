import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export default function ProjectDetailNotFound() {
  return (
    <Section>
      <Stack size="lg" className="max-w-prose">
        <Heading as="h1" size="md">
          Project not found
        </Heading>
        <Text tone="muted">
          The requested engineering case study is not available or has been unpublished.
        </Text>
      </Stack>
    </Section>
  );
}

