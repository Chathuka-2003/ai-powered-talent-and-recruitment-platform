import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "./ui/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-foreground">{value}</h3>
          {trend && (
            <p className={cn(
              "mt-2 text-sm",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="rounded-lg bg-[#D4AF37]/10 p-3">
          <Icon className="h-6 w-6 text-[#D4AF37]" />
        </div>
      </div>
    </GlassCard>
  );
}
