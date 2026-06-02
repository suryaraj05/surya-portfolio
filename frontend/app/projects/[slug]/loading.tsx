import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export default function ProjectDetailLoading() {
  return (
    <Section aria-busy="true" aria-live="polite">
      <Stack size="lg">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="h-14 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-80 w-full animate-pulse rounded-xl border border-border bg-muted" />
        <div className="h-5 w-full animate-pulse rounded bg-muted" />
        <div className="h-5 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-5 w-10/12 animate-pulse rounded bg-muted" />
      </Stack>
    </Section>
  );
}

