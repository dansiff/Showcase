import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "soft" | "link";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    default:
      "bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 text-slate-900 hover:from-sky-300 hover:via-indigo-400 hover:to-fuchsia-400 focus:ring-indigo-400/40",
    secondary:
      "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10 focus:ring-slate-400/30",
    soft:
      "bg-white/5 text-white hover:bg-white/10 border border-white/10 backdrop-blur focus:ring-white/20",
    outline:
      "border border-white/15 bg-transparent text-slate-100 hover:bg-white/5 focus:ring-indigo-400/30",
    ghost:
      "text-slate-200 hover:bg-white/5 focus:ring-white/20",
    link:
      "bg-transparent text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline px-0 py-0",
    destructive:
      "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400/40",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-5 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
