import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const headingVariants = cva("font-display tracking-tight text-foreground", {
  variants: {
    size: {
      xl: "text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]",
      lg: "text-[clamp(2rem,4vw,3.5rem)] leading-[1.08]",
      md: "text-[clamp(1.5rem,2vw,2rem)] leading-[1.15]",
      sm: "text-xl leading-tight"
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
