import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:brightness-95",
  secondary:
    "bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:brightness-95",
  outline:
    "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-strong)]",
  ghost:
    "bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-strong)]",
  destructive:
    "bg-[color:var(--danger)] text-white hover:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-11 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
