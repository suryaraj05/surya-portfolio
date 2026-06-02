import type { ReactNode } from "react";

import type { DiagramSpec } from "@/lib/case-study/types";

type MarkdownProps = {
  markdown: string;
  diagrams?: {
    svg?: DiagramSpec[];
  };
};

function InlineMarkdown({ text }: { text: string }): ReactNode {
  // Minimal inline parser: inline code, images, links.
  const parts: ReactNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const codeRe = /`([^`]+)`/;
    const imgRe = /!\[([^\]]*)\]\(([^)]+)\)/;
    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/;

    const codeMatch = codeRe.exec(remaining);
    const imgMatch = imgRe.exec(remaining);
    const linkMatch = linkRe.exec(remaining);

    const candidates = [
      codeMatch ? { kind: "code" as const, index: codeMatch.index ?? 0, match: codeMatch } : null,
      imgMatch ? { kind: "img" as const, index: imgMatch.index ?? 0, match: imgMatch } : null,
      linkMatch ? { kind: "link" as const, index: linkMatch.index ?? 0, match: linkMatch } : null
    ].filter(Boolean) as Array<{ kind: "code" | "img" | "link"; index: number; match: RegExpExecArray }>;

    if (candidates.length === 0) {
      parts.push(remaining);
      break;
    }

    candidates.sort((a, b) => a.index - b.index);
    const next = candidates[0]!;

    if (next.index > 0) {
      parts.push(remaining.slice(0, next.index));
      remaining = remaining.slice(next.index);
    }

    if (next.kind === "code") {
      const value = next.match[1] ?? "";
      parts.push(
        <code key={parts.length} className="rounded-md bg-accent px-1.5 py-0.5 font-mono text-sm">
          {value}
        </code>
      );
      remaining = remaining.replace(next.match[0]!, "");
    } else if (next.kind === "img") {
      const alt = next.match[1] ?? "";
      const src = next.match[2] ?? "";
      parts.push(
        <img
          key={parts.length}
          src={src}
          alt={alt}
          loading="lazy"
          className="my-3 max-h-[420px] w-full rounded-xl border border-border bg-background object-contain"
        />
      );
      remaining = remaining.replace(next.match[0]!, "");
    } else if (next.kind === "link") {
      const label = next.match[1] ?? "";
      const href = next.match[2] ?? "";
      parts.push(
        <a key={parts.length} href={href} className="underline underline-offset-4">
          {label}
        </a>
      );
      remaining = remaining.replace(next.match[0]!, "");
    }
  }

  return <>{parts}</>;
}

function CodeBlock({ language, content }: { language?: string; content: string }) {
  const lang = language?.trim().toLowerCase();
  const lines = content.replace(/\n$/, "").split("\n");

  if (lang === "svg") {
    return (
      <div className="not-prose my-8 w-full overflow-hidden rounded-xl border border-border bg-background">
        <div
          className="p-6"
          // Treat SVG fences as trusted editorial assets.
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

  return (
    <div className="not-prose my-8 w-full overflow-hidden rounded-xl border border-border bg-background">
      <div className="bg-muted px-4 py-3 text-xs text-muted-foreground">{lang ? `${lang}` : "code"}</div>
      <pre className="overflow-x-auto p-4">
        <code className="block whitespace-pre font-mono text-sm leading-6">{lines.join("\n")}</code>
      </pre>
    </div>
  );
}

export function Markdown({ markdown }: MarkdownProps) {
  const blocks: ReactNode[] = [];

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();
    if (!text) return;
    blocks.push(
      <p key={blocks.length} className="mb-6 leading-relaxed">
        <InlineMarkdown text={text} />
      </p>
    );
    paragraphBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i]!;

    // Trusted raw HTML blocks (for embedded videos/iframes from CMS).
    const rawTagMatch = line.trim().match(/^<\s*([a-zA-Z][a-zA-Z0-9]*)\b/);
    if (rawTagMatch) {
      const tag = rawTagMatch[1]!.toLowerCase();
      if (tag === "video" || tag === "iframe") {
        flushParagraph();
        const htmlLines: string[] = [];
        while (i < lines.length && lines[i]!.trim() !== "") {
          htmlLines.push(lines[i]!);
          i++;
        }
        blocks.push(
          <div
            key={blocks.length}
            className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background"
            dangerouslySetInnerHTML={{ __html: htmlLines.join("\n") }}
          />
        );
        continue;
      }
    }

    // Code fence
    const fenceMatch = line.match(/^```(\w+)?\s*$/);
    if (fenceMatch) {
      flushParagraph();
      const language = fenceMatch[1];
      i++;
      const contentLines: string[] = [];
      while (i < lines.length && !lines[i]!.match(/^```/)) {
        contentLines.push(lines[i]!);
        i++;
      }
      // Skip closing fence
      if (i < lines.length) i++;
      const content = contentLines.join("\n");
      blocks.push(<CodeBlock key={blocks.length} language={language} content={content} />);
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      flushParagraph();
      blocks.push(<hr key={blocks.length} className="my-10 border-border/80" />);
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1]!.length;
      const text = headingMatch[2]!;
      if (level === 1) {
        blocks.push(
          <h1 key={blocks.length} className="mb-4 font-display tracking-tight text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]">
            <InlineMarkdown text={text} />
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={blocks.length} className="mb-4 font-display tracking-tight text-[clamp(1.5rem,2vw,2rem)] leading-[1.15]">
            <InlineMarkdown text={text} />
          </h2>
        );
      } else if (level === 3) {
        blocks.push(
          <h3 key={blocks.length} className="mb-3 mt-8 font-display text-xl tracking-tight">
            <InlineMarkdown text={text} />
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={blocks.length} className="mb-3 mt-8 font-display text-lg tracking-tight">
            <InlineMarkdown text={text} />
          </h4>
        );
      }
      i++;
      continue;
    }

    // Blockquote
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (i < lines.length) {
        const m = lines[i]!.match(/^>\s?(.*)$/);
        if (!m) break;
        quoteLines.push(m[1]!);
        i++;
      }
      blocks.push(
        <blockquote
          key={blocks.length}
          className="not-prose mb-8 border-l border-border pl-4 text-muted-foreground"
        >
          <InlineMarkdown text={quoteLines.join(" ").trim()} />
        </blockquote>
      );
      continue;
    }

    // Unordered list
    const listMatch = line.match(/^(\-|\*)\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i]!.match(/^(\-|\*)\s+(.+)$/);
        if (!m) break;
        items.push(m[2]!);
        i++;
      }
      blocks.push(
        <ul key={blocks.length} className="mb-8 list-disc pl-6 leading-relaxed">
          {items.map((item) => (
            <li key={item} className="mb-2">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Blank line = paragraph boundary
    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    // Paragraph line
    paragraphBuffer.push(line.trim());
    i++;
  }

  flushParagraph();
  return <div>{blocks}</div>;
}

