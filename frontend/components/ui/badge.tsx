import { cn } from "@/lib/utils";

import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-xs font-medium", className)} {...props} />;
}
