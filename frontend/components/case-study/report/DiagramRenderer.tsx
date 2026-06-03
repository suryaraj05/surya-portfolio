import type { DiagramSpec } from "@/lib/case-study/types";

export function DiagramRenderer({ spec }: { spec: DiagramSpec }) {
  if (spec.type === "svgInline") {
    return (
      <div
        className="w-full overflow-auto [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: spec.svgMarkup }}
      />
    );
  }

  if (spec.type === "svgUrl") {
    return <img src={spec.svgSrc} alt={spec.caption ?? "Architecture diagram"} className="w-full" />;
  }

  return <img src={spec.src} alt={spec.alt} className="w-full object-contain" loading="lazy" />;
}
