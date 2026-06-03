import type { MicroNote } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";

export function MicroNotesRail({ notes, className, dark }: { notes: MicroNote[]; className?: string; dark?: boolean }) {
  if (!notes.length) return null;

  return (
    <ul className={cn("report-micro-notes space-y-3", className)}>
      {notes.map((note) => (
        <li
          key={note.label}
          className={cn(
            "flex items-baseline justify-between gap-4 border-b pb-3 text-xs last:border-0",
            dark ? "border-white/10 text-white/55" : "border-border/60 text-muted-foreground"
          )}
        >
          <span className="uppercase tracking-[0.12em]">{note.label}</span>
          <span className={cn("font-mono text-right", dark ? "text-white/80" : "text-foreground/80")}>{note.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function AnnotationsList({ items, dark }: { items: string[]; dark?: boolean }) {
  if (!items.length) return null;

  return (
    <ul className={cn("mt-4 space-y-1.5 text-[0.72rem] italic", dark ? "text-white/40" : "text-muted-foreground")}>
      {items.map((item) => (
        <li key={item}>— {item}</li>
      ))}
    </ul>
  );
}
