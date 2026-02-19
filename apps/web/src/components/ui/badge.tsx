import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[color:var(--surface-strong)] text-[color:var(--foreground)]",
  success: "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
  warning: "bg-[#fff1d6] text-[#9a6412] dark:bg-[#4f3a11] dark:text-[#f4cd82]",
};

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }
>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className,
    )}
    {...props}
  />
));

Badge.displayName = "Badge";
