import { cn } from "@/lib/utils";
import { Container } from "./container";
import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  withContainer?: boolean;
} & HTMLAttributes<HTMLElement>;

export function Section({ children, className, withContainer = true, ...props }: SectionProps) {
  const content = withContainer ? <Container>{children}</Container> : children;
  return (
    <section {...props} className={cn("py-section-y", className)} role={props.role ?? "region"}>
      {content}
    </section>
  );
}
