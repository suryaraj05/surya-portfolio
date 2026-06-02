import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export default function ProjectsLoading() {
  return (
    <Section aria-busy="true" aria-live="polite">
      <Stack size="lg">
        <div className="h-14 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-28 w-full animate-pulse rounded-xl border border-border bg-muted" />
        <div className="space-y-8 pt-4">
          <div className="h-36 w-full animate-pulse rounded border-b border-border bg-muted/60" />
          <div className="h-36 w-full animate-pulse rounded border-b border-border bg-muted/60" />
          <div className="h-36 w-full animate-pulse rounded border-b border-border bg-muted/60" />
        </div>
      </Stack>
    </Section>
  );
}

