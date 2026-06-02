import { readFileSync } from "node:fs";
import path from "node:path";

type SectionMap = Record<string, string>;

function parseH1Sections(markdown: string): SectionMap {
  const sections: SectionMap = {};
  const regex = /^#\s+(.+)$/gm;
  const matches = [...markdown.matchAll(regex)];

  for (let i = 0; i < matches.length; i++) {
    const title = matches[i]?.[1]?.trim();
    const start = (matches[i]?.index ?? 0) + (matches[i]?.[0]?.length ?? 0);
    const end = i + 1 < matches.length ? matches[i + 1]!.index! : markdown.length;
    if (!title) continue;
    sections[title] = markdown.slice(start, end).trim();
  }

  return sections;
}

export function getArchitectureContent() {
  const markdownPath = path.join(process.cwd(), "content", "architecture.md");
  const markdown = readFileSync(markdownPath, "utf-8");
  const sections = parseH1Sections(markdown);
  return {
    sections,
    order: [
      "Systems Thinking",
      "Agent Boundaries",
      "Structured Handoffs",
      "Reliability First",
      "Voice System Design",
      "Multi-Agent Orchestration",
      "Production Lessons",
      "Engineering Principles"
    ] as const
  };
}

