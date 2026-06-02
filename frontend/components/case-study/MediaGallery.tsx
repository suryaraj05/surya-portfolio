import type { MediaGallerySpec } from "@/lib/case-study/types";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Heading } from "@/components/typography/heading";
import { cn } from "@/lib/utils";

export function MediaGallery({ spec, title = "Media" }: { spec: MediaGallerySpec; title?: string }) {
  const { images, videos } = spec;

  return (
    <Section className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Stack size="lg">
        <Heading as="h2" size="md" className="text-2xl">
          {title}
        </Heading>

        {images?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {images.map((img) => (
              <figure
                key={img.src}
                className={cn("rounded-xl border border-border bg-background p-4", "not-prose")}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-auto w-full rounded-lg border border-border/60 bg-background object-contain"
                  loading="lazy"
                  decoding="async"
                />
                {img.caption ? (
                  <figcaption className="mt-3 text-sm text-muted-foreground">{img.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        {videos?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((v) => (
              <figure key={v.src} className="rounded-xl border border-border bg-background p-4 not-prose">
                <video src={v.src} controls preload="metadata" className="w-full rounded-lg bg-background" />
                {v.title ? <figcaption className="mt-3 text-sm text-muted-foreground">{v.title}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}
      </Stack>
    </Section>
  );
}

