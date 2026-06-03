import type { EngineeringArtifact, EvidenceLine } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

export function SectionTransition({ children }: { children: string }) {
  return <p className="report-transition mb-10 text-[0.95rem] italic leading-relaxed text-muted-foreground">{children}</p>;
}

export function MicroFlow({ steps, vertical }: { steps: string[]; vertical?: boolean }) {
  if (!steps.length) return null;

  if (vertical) {
    return (
      <div className="report-micro-flow-vertical my-10 font-mono text-[0.72rem] leading-relaxed text-muted-foreground" aria-label="Flow">
        {steps.map((step, i) => (
          <div key={step} className="flex gap-3">
            <span className="w-4 shrink-0 text-foreground/25">{i < steps.length - 1 ? "↓" : " "}</span>
            <span className={cn(i === steps.length - 1 ? "text-foreground/70" : undefined)}>{step}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className="report-micro-flow my-10 font-mono text-[0.72rem] tracking-wide text-muted-foreground" aria-label="Flow">
      {steps.map((step, i) => (
        <span key={step}>
          {i > 0 ? <span className="mx-2 text-foreground/20">→</span> : null}
          {step}
        </span>
      ))}
    </p>
  );
}

export function InlineArtifact({ artifact }: { artifact: EngineeringArtifact }) {
  return (
    <figure className="report-artifact my-8">
      <figcaption className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
        {artifact.label}
      </figcaption>
      <pre className="overflow-x-auto rounded-md bg-[hsl(222,20%,12%)] px-3 py-3">
        <code className="block whitespace-pre font-mono text-[0.72rem] leading-[1.65] text-white/82">{artifact.content}</code>
      </pre>
    </figure>
  );
}

export function EvidenceStrip({ lines }: { lines: EvidenceLine[] }) {
  if (!lines.length) return null;

  return (
    <ul className="report-evidence my-8 space-y-2 border-l border-border/60 pl-4 font-mono text-[0.72rem] leading-relaxed text-muted-foreground">
      {lines.map((line) => (
        <li key={line.text}>{line.text}</li>
      ))}
    </ul>
  );
}

export function DiagramNotes({ notes }: { notes: string[] }) {
  if (!notes.length) return null;

  return (
    <ul className="report-diagram-notes mt-4 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
      {notes.map((note) => (
        <li key={note}>
          <span className="mr-2 text-foreground/30">—</span>
          {note}
        </li>
      ))}
    </ul>
  );
}
