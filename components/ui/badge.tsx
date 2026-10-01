import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-emerald-700/40 bg-emerald-900/50 px-2.5 py-1 text-xs font-semibold text-emerald-100 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
