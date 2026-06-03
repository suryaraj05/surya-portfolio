import type { ProjectDTO } from "@/src/contracts/types";

export type CaseStudyKicker = {
  label: string;
  href?: string;
};

export type DiagramSpec =
  | {
      type: "svgInline";
      svgMarkup: string;
      caption?: string;
    }
  | {
      type: "svgUrl";
      svgSrc: string;
      caption?: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

export type MediaImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type MediaVideo = {
  src: string;
  title?: string;
};

export type MediaGallerySpec = {
  images: MediaImage[];
  videos?: MediaVideo[];
};

export type DecisionItem = {
  title: string;
  rationaleMarkdown: string;
  alternativesMarkdown?: string;
  codeBlock?: {
    language?: string;
    content: string;
  };
};

export type TradeoffItem = {
  title: string;
  markdown: string;
};

export type MetricItem = {
  label: string;
  value: string;
  note?: string;
};

export type TechItem = {
  name: string;
  href?: string;
  description?: string;
};

export type ProjectSummary = Pick<ProjectDTO, "id" | "title" | "slug" | "short_description" | "featured">;

export type ProjectNavItem = {
  slug: string;
  title: string;
  short_description?: string | null;
};

export type CaseStudyContent = {
  hero?: {
    subtitle?: string;
    kicker?: CaseStudyKicker[];
    coverDescriptionMarkdown?: string;
  };
  problemMarkdown?: string;
  challengeMarkdown?: string;
  architectureMarkdown?: string;
  architectureDiagrams?: DiagramSpec[];
  decisions?: DecisionItem[];
  tradeoffs?: TradeoffItem[];
  techStack?: TechItem[];
  metrics?: MetricItem[];
  media?: MediaGallerySpec;
  lessonsMarkdown?: string;
};

export type PayloadBlock = {
  title: string;
  language: string;
  content: string;
  caption?: string;
};

export type ArchitectureCallout = {
  title: string;
  body: string;
  tag?: string;
};

export type EngineeringDepthItem = {
  title: string;
  summary: string;
  detail?: string;
};

export type SectionLayout =
  | "anchored"
  | "insight"
  | "dense"
  | "visual-led"
  | "prose"
  | "split"
  | "diagram-first";

export type SectionDensity = "compact" | "balanced" | "immersive";

export type MicroNote = {
  label: string;
  value: string;
};

export type NarrativeSectionSpec = {
  id: string;
  eyebrow?: string;
  title: string;
  markdown: string;
  pullQuote?: string;
  payloads?: PayloadBlock[];
  callouts?: ArchitectureCallout[];
  diagram?: DiagramSpec;
  fullWidthDiagram?: DiagramSpec;
  tone?: "light" | "dark";
  layout?: SectionLayout;
  density?: SectionDensity;
  microNotes?: MicroNote[];
  annotations?: string[];
};

export type CaseStudyReport = {
  slug: string;
  hero: {
    title: string;
    subtitle?: string;
    narrativeIntro: string;
  };
  sections: NarrativeSectionSpec[];
  engineeringDepth: EngineeringDepthItem[];
  decisions: DecisionItem[];
  tradeoffs: TradeoffItem[];
  techStack: TechItem[];
  outcomeMetrics: MetricItem[];
  lessonsMarkdown?: string;
};

