import * as React from "react";
import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
};

export function Skeleton({ className, rounded = "md", ...props }: SkeletonProps) {
  const radius = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={cn(
        "h-4 w-full animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        radius,
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
