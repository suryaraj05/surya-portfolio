import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const headingVariants = cva("font-display tracking-tight text-foreground", {
  variants: {
    size: {
      xl: "text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.04] tracking-[-0.02em]",
      lg: "text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.07] tracking-[-0.015em]",
      md: "text-[clamp(1.55rem,2.4vw,2.15rem)] leading-[1.12] tracking-[-0.01em]",
      sm: "text-[clamp(1.125rem,1.5vw,1.35rem)] leading-snug"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4";
  };

export function Heading({ as = "h2", size, className, ...props }: HeadingProps) {
  const Tag = as;
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />;
}
