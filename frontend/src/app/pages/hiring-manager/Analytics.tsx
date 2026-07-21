import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Users, Clock, TrendingUp, Award } from "lucide-react";

const CHART_COLORS = ["#D4AF37", "#E5C158", "#B8961F", "#FFD700", "#C9A227"];

export function ManagerAnalytics() {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "ytd">("ytd");

  const hiringFunnelData = [
    { stage: "Applied", count: 1847 },
    { stage: "Screened", count: 624 },
    { stage: "Interview", count: 218 },
    { stage: "Offer", count: 63 },
    { stage: "Hired", count: 47 },
  ];

  const timeToHireData: Record<string, { month: string; days: number }[]> = {
    "30d": [
      { month: "May W3", days: 24 },
      { month: "May W4", days: 22 },
      { month: "Jun W1", days: 21 },
      { month: "Jun W2", days: 23 },
    ],
    "90d": [
      { month: "Apr", days: 28 },
      { month: "May", days: 25 },
      { month: "Jun", days: 23 },
    ],
    ytd: [
      { month: "Jan", days: 31 },
      { month: "Feb", days: 28 },
      { month: "Mar", days: 26 },
      { month: "Apr", days: 24 },
      { month: "May", days: 22 },
      { month: "Jun", days: 23 },
    ],
  };

  const offerAcceptanceData = [
    { dept: "Engineering", rate: 82 },
    { dept: "Product", rate: 79 },
    { dept: "Design", rate: 88 },
    { dept: "Marketing", rate: 71 },
    { dept: "Data Science", rate: 85 },
    { dept: "Operations", rate: 68 },
  ];

  const candidateQualityData: Record<string, { month: string; score: number; hires: number }[]> = {
    "30d": [
      { month: "May W3", score: 77, hires: 5 },
      { month: "May W4", score: 80, hires: 7 },
      { month: "Jun W1", score: 82, hires: 6 },
      { month: "Jun W2", score: 84, hires: 8 },
    ],
    "90d": [
      { month: "Apr", score: 74, hires: 14 },
      { month: "May", score: 79, hires: 18 },
      { month: "Jun", score: 83, hires: 15 },
    ],
    ytd: [
      { month: "Jan", score: 68, hires: 6 },
      { month: "Feb", score: 71, hires: 8 },
      { month: "Mar", score: 73, hires: 9 },
      { month: "Apr", score: 76, hires: 10 },
      { month: "May", score: 80, hires: 7 },
      { month: "Jun", score: 83, hires: 7 },
    ],
  };

  const timeRangeLabels = { "30d": "30 Days", "90d": "90 Days", ytd: "YTD" };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-muted-foreground text-xs mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-foreground text-sm font-semibold">
              {p.name ? `${p.name}: ` : ""}{p.value}{typeof p.value === "number" && p.name === "days" ? " days" : p.name === "rate" ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout role="hiring-manager">
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Hiring Analytics</h1>
            <p className="text-muted-foreground">Track performance metrics and hiring trends</p>
          </div>
          {/* Time Range Filter */}
          <div className="flex gap-2">
            {(["30d", "90d", "ytd"] as const).map((range) => (
              <Button
                key={range}
                variant="outline"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`border-border transition-all ${
                  timeRange === range
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/60"
                    : "text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                }`}
              >
                {timeRangeLabels[range]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Hires YTD"
          value="47"
          icon={Users}
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Avg Time-to-Hire"
          value="23 days"
          icon={Clock}
          trend={{ value: 11, isPositive: true }}
        />
        <StatCard
          title="Offer Acceptance Rate"
          value="78%"
          icon={Award}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Pipeline Velocity"
          value="+12%"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Row 1: Funnel + Time-to-Hire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Hiring Funnel */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Hiring Funnel</h2>
          <p className="text-sm text-muted-foreground mb-6">Candidate progression through stages</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hiringFunnelData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Time-to-Hire Trend */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Time-to-Hire Trend</h2>
          <p className="text-sm text-muted-foreground mb-6">Average days from open to offer accepted</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={timeToHireData[timeRange]} margin={{ left: -10, right: 10 }}>
              <defs>
                <linearGradient id="tthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} unit=" d" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="days"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                fill="url(#tthGrad)"
                dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: CHART_COLORS[0] }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Row 2: Offer Acceptance + Candidate Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offer Acceptance by Department */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Offer Acceptance by Department</h2>
          <p className="text-sm text-muted-foreground mb-6">Percentage of offers accepted per team</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={offerAcceptanceData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="dept" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill={CHART_COLORS[2]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Candidate Quality Scores */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Candidate Quality Scores</h2>
          <p className="text-sm text-muted-foreground mb-6">Average quality score and hires over time</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={candidateQualityData[timeRange]} margin={{ left: -10, right: 10 }}>
              <defs>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[4]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[4]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="hiresGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke={CHART_COLORS[4]}
                strokeWidth={2}
                fill="url(#qualGrad)"
                dot={{ fill: CHART_COLORS[4], r: 4 }}
                name="Quality Score"
              />
              <Area
                type="monotone"
                dataKey="hires"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                fill="url(#hiresGrad)"
                dot={{ fill: CHART_COLORS[1], r: 4 }}
                name="Hires"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
