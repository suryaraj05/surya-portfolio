import { cn } from "@/lib/utils";

type ArchitectureThumbnailProps = {
  slug: string;
  title: string;
  className?: string;
};

function thumbnailVariant(slug: string): "voice" | "orchestration" | "vision" | "platform" {
  if (slug.includes("nina") || slug.includes("voice")) return "voice";
  if (slug.includes("tax") || slug.includes("orchestr")) return "orchestration";
  if (slug.includes("vision")) return "vision";
  return "platform";
}

function VoicePipelineSvg() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect x="8" y="8" width="304" height="184" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.18" />
      <rect x="28" y="78" width="52" height="44" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="96" y="78" width="52" height="44" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="164" y="78" width="52" height="44" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="232" y="78" width="60" height="44" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="80" y1="100" x2="96" y2="100" stroke="currentColor" strokeOpacity="0.25" />
      <line x1="148" y1="100" x2="164" y2="100" stroke="currentColor" strokeOpacity="0.25" />
      <line x1="216" y1="100" x2="232" y2="100" stroke="currentColor" strokeOpacity="0.25" />
    </svg>
  );
}

function OrchestrationSvg() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect x="8" y="8" width="304" height="184" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.18" />
      <rect x="120" y="28" width="80" height="36" rx="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.22" />
      <rect x="40" y="108" width="72" height="36" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="124" y="108" width="72" height="36" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="208" y="108" width="72" height="36" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="160" y1="64" x2="76" y2="108" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="160" y1="64" x2="160" y2="108" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="160" y1="64" x2="244" y2="108" stroke="currentColor" strokeOpacity="0.2" />
    </svg>
  );
}

function VisionSvg() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect x="8" y="8" width="304" height="184" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.18" />
      <rect x="48" y="48" width="224" height="104" rx="10" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="48" y1="100" x2="272" y2="100" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="4 6" />
      <line x1="160" y1="48" x2="160" y2="152" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="4 6" />
      <circle cx="160" cy="100" r="28" fill="none" stroke="currentColor" strokeOpacity="0.28" />
    </svg>
  );
}

function PlatformSvg() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect x="8" y="8" width="304" height="184" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.18" />
      <rect x="36" y="56" width="248" height="28" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.18" />
      <rect x="36" y="96" width="180" height="28" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.18" />
      <rect x="36" y="136" width="210" height="28" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.18" />
    </svg>
  );
}

export function ArchitectureThumbnail({ slug, title, className }: ArchitectureThumbnailProps) {
  const variant = thumbnailVariant(slug);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/80 bg-muted/30 text-foreground",
        "transition duration-500 ease-out group-hover:border-border group-hover:shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)]",
        className
      )}
      aria-hidden
    >
      <div className="arch-texture arch-texture-dots absolute inset-0 opacity-40" />
      <div className="image-reveal relative aspect-[16/10] p-4 md:p-5">
        {variant === "voice" ? <VoicePipelineSvg /> : null}
        {variant === "orchestration" ? <OrchestrationSvg /> : null}
        {variant === "vision" ? <VisionSvg /> : null}
        {variant === "platform" ? <PlatformSvg /> : null}
      </div>
      <p className="sr-only">Architecture preview for {title}</p>
    </div>
  );
}
