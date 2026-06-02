import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export default function ContactLoading() {
  return (
    <Section aria-busy="true" aria-live="polite">
      <Stack size="lg">
        <div className="h-14 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-96 w-full animate-pulse rounded-xl border border-border bg-muted/60" />
      </Stack>
    </Section>
  );
}

