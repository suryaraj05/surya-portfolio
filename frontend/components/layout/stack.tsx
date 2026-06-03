import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type StackProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const gapBySize = {
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
  xl: "gap-12"
} as const;

export function Stack({ children, className, size = "md" }: StackProps) {
  return <div className={cn("flex flex-col", gapBySize[size], className)}>{children}</div>;
}
