import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./ui/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card/90 dark:bg-card/60 backdrop-blur-md shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
