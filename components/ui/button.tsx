"use client";

import * as React from "react";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "success"
    | "ghost"
    | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean; // for icon-only buttons
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  rounded = "md",
  iconLeft,
  iconRight,
  iconOnly = false,
  children,
  disabled,
  ...props
}) => {
  // 🔹 Base Styles
  const base =
    "inline-flex items-center justify-center font-medium focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none focus:ring-2 focus:ring-offset-2";

  // 🔹 Variant Styles
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
    outline:
      "border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800 focus:ring-gray-200",
    link: "bg-transparent underline-offset-2 hover:underline text-blue-600 focus:ring-blue-400",
  };

  // 🔹 Size Styles
  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
    xl: "h-14 px-8 text-xl",
  };

  // 🔹 Rounded Styles
  const roundedMap: Record<NonNullable<ButtonProps["rounded"]>, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        roundedMap[rounded],
        fullWidth && "w-full",
        iconOnly && "!p-0 aspect-square",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden />}

      {/* Icon Left */}
      {iconLeft && !iconOnly && <span className="mr-2">{iconLeft}</span>}

      {/* Text (hidden if iconOnly) */}
      {!iconOnly && children}

      {/* Icon Right */}
      {iconRight && !iconOnly && <span className="ml-2">{iconRight}</span>}

      {/* Icon-only mode (no text, just centered icon) */}
      {iconOnly && (iconLeft || iconRight)}
    </button>
  );
};

Button.displayName = "Button";
export default Button;
