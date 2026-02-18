import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[96px] w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-2 text-sm text-[color:var(--foreground)] shadow-sm placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
