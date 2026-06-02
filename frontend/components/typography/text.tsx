import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const textVariants = cva("text-foreground/90", {
  variants: {
    tone: {
      default: "text-foreground/90",
      muted: "text-muted-foreground"
    },
    size: {
      lg: "text-lg leading-relaxed",
      md: "text-base leading-relaxed",
      sm: "text-sm leading-relaxed"
    }
  },
  defaultVariants: {
    tone: "default",
    size: "md"
  }
});

type TextProps = HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof textVariants>;

export function Text({ className, tone, size, ...props }: TextProps) {
  return <p className={cn(textVariants({ tone, size }), className)} {...props} />;
}
