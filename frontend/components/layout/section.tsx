import { cn } from "@/lib/utils";
import { Container } from "./container";
import type { HTMLAttributes, ReactNode } from "react";

type SectionRhythm = "default" | "tight" | "loose" | "none";

const rhythmPadding: Record<SectionRhythm, string> = {
  default: "py-section-y",
  tight: "py-section-tight",
  loose: "py-section-loose",
  none: ""
};

type SectionProps = {
  children: ReactNode;
  className?: string;
  withContainer?: boolean;
  rhythm?: SectionRhythm;
} & HTMLAttributes<HTMLElement>;

export function Section({
  children,
  className,
  withContainer = true,
  rhythm = "default",
  ...props
}: SectionProps) {
  const content = withContainer ? <Container>{children}</Container> : children;
  return (
    <section
      {...props}
      className={cn(rhythmPadding[rhythm], className)}
      role={props.role ?? "region"}
    >
      {content}
    </section>
  );
}
