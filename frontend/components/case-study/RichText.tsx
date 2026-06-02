import type { ReactNode } from "react";

import { Markdown } from "@/lib/markdown/Markdown";

type RichTextProps = {
  markdown: string;
  className?: string;
  fallback?: ReactNode;
};

export function RichText({ markdown, className, fallback }: RichTextProps) {
  if (!markdown) return <>{fallback ?? null}</>;
  return <div className={className ?? "prose max-w-prose"}><Markdown markdown={markdown} /></div>;
}

