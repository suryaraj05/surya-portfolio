import { cn } from "@/lib/utils";

import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("rounded-card border bg-background p-6 shadow-sm", className)} {...props} />;
}
