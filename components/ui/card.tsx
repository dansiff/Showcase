import * as React from "react";
import { cn } from "@/lib/utils"; // utility to merge Tailwind classes, we’ll create this if missing

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn("mb-2 font-semibold text-lg", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={cn("text-sm text-gray-700", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={cn("mt-4 border-t pt-2 text-xs text-gray-500", className)} {...props} />
  );
}
export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-xl font-bold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export function CardMedia({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={cn("w-full rounded-t-2xl object-cover", className)}
      {...props}
    />
  );
}
export function CardActions({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("flex justify-end gap-2 pt-2", className)}
      {...props}
    />
  );
}
