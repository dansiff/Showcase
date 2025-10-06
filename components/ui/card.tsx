"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // utility to merge Tailwind classes

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

// ✅ MAIN CARD CONTAINER
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ✅ HEADER
export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("mb-2 font-semibold text-lg", className)} {...props}>
      {children}
    </div>
  );
}

// ✅ CONTENT
export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("text-sm text-gray-700", className)} {...props}>
      {children}
    </div>
  );
}

// ✅ FOOTER
export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("mt-4 border-t pt-2 text-xs text-gray-500", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ✅ TITLE
export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-xl font-bold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

// ✅ DESCRIPTION
export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <p className={cn("text-sm text-gray-500", className)} {...props}>
      {children}
    </p>
  );
}

// ✅ MEDIA (for images, videos, etc.)
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

// ✅ ACTIONS
export function CardActions({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("flex justify-end gap-2 pt-2", className)} {...props}>
      {children}
    </div>
  );
}
