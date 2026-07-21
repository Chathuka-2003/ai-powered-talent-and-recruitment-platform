import { useNavigate } from "react-router";
import {
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  Brain,
  LineChart as LineChartIcon,
  Lightbulb,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";

const aiTabs = [
  { label: "Resume Parsing", path: "/ai/resume-parsing", icon: FileText },
  { label: "Job Matching", path: "/ai/job-matching", icon: Target },
  { label: "Candidate Ranking", path: "/ai/candidate-ranking", icon: TrendingUp },
  { label: "AI Analytics", path: "/ai/analytics", icon: BarChart3 },
];

// 30-day usage data
const usageData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: `Jun ${day}`,
    resumeParsing: Math.round(30 + Math.sin(i * 0.4) * 15 + Math.random() * 10 + i * 0.5),
    jobMatching: Math.round(20 + Math.cos(i * 0.3) * 10 + Math.random() * 8 + i * 0.3),
    candidateRanking: Math.round(15 + Math.sin(i * 0.5) * 8 + Math.random() * 6 + i * 0.2),
  };
});

// Accuracy trends (last 10 days)
const accuracyData = Array.from({ length: 10 }, (_, i) => ({
  day: `Jun ${i + 8}`,
  parsingAccuracy: parseFloat((96 + Math.random() * 2.5).toFixed(1)),
  matchingAccuracy: parseFloat((94 + Math.random() * 3).toFixed(1)),
}));

// Time savings by week
const timeSavingsData = [
  { week: "Week 1", aiSaved: 148, manual: 220 },
  { week: "Week 2", aiSaved: 193, manual: 220 },
  { week: "Week 3", aiSaved: 241, manual: 220 },
  { week: "Week 4", aiSaved: 265, manual: 220 },
];

const modelMetrics = [
  { label: "Precision", value: "94.2%", description: "True positive / (TP + FP)", icon: Target },
  { label: "Recall", value: "91.8%", description: "True positive / (TP + FN)", icon: TrendingUp },
  { label: "F1 Score", value: "93.0%", description: "Harmonic mean of P & R", icon: Zap },
  { label: "AUC-ROC", value: "0.97", description: "Area under the ROC curve", icon: LineChartIcon },
];

const aiInsights = [
  {
    insight:
      "Candidates from Stanford have a 23% higher offer acceptance rate for engineering roles compared to other top-10 universities.",
    tag: "Trend",
    icon: Brain,
  },
  {
    insight:
      "Job listings posted on Tuesday receive 41% more qualified applications within the first 48 hours.",
    tag: "Optimization",
    icon: Lightbulb,
  },
  {
    insight:
      "Candidates with 5–8 years of experience show the highest match quality for senior individual contributor roles, outperforming both less and more experienced cohorts.",
    tag: "Insight",
    icon: TrendingUp,
  },
  {
    insight:
      "Resume parsing accuracy for DOCX files is 2.1% higher than PDF on average due to richer metadata preservation.",
    tag: "Performance",
    icon: Zap,
  },
];

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "#1E1E1E",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "12px",
  },
  labelStyle: { color: "rgba(255,255,255,0.6)" },
};

export function AIAnalytics() {
  const navigate = useNavigate();

  return (
    <ModuleLayout
      title="AI Analytics"
      subtitle="Performance metrics and insights for all AI features"
      icon={BarChart3}
      tabs={aiTabs}
      backPath="/recruiter/dashboard"
      backLabel="Recruiter Portal"
    >
      {/* Model Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {modelMetrics.map((metric) => (
          <GlassCard key={metric.label} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                <metric.icon className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs">
                Model
              </Badge>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
            <div className="text-xs text-foreground/60 font-medium">{metric.label}</div>
            <div className="text-xs text-foreground/30 mt-1">{metric.description}</div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* AI Feature Usage */}
        <GlassCard className="p-6">
          <div className="mb-5">
            <h3 className="text-foreground font-semibold">AI Feature Usage</h3>
            <div className="text-xs text-foreground/40 mt-0.5">Daily calls over the last 30 days</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={usageData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorJM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip {...chartTooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
              />
              <Area
                type="monotone"
                dataKey="resumeParsing"
                name="Resume Parsing"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#colorRP)"
              />
              <Area
                type="monotone"
                dataKey="jobMatching"
                name="Job Matching"
                stroke="#60A5FA"
                strokeWidth={2}
                fill="url(#colorJM)"
              />
              <Area
                type="monotone"
                dataKey="candidateRanking"
                name="Candidate Ranking"
                stroke="#A78BFA"
                strokeWidth={2}
                fill="url(#colorCR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Accuracy Trends */}
        <GlassCard className="p-6">
          <div className="mb-5">
            <h3 className="text-foreground font-semibold">Accuracy Trends</h3>
            <div className="text-xs text-foreground/40 mt-0.5">Parsing and matching accuracy over time (%)</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={accuracyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[90, 100]}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip {...chartTooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
              />
              <Line
                type="monotone"
                dataKey="parsingAccuracy"
                name="Parsing Accuracy"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: "#D4AF37", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="matchingAccuracy"
                name="Matching Accuracy"
                stroke="#34D399"
                strokeWidth={2}
                dot={{ fill: "#34D399", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Charts Row 2 + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Time Savings */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-full">
            <div className="mb-5">
              <h3 className="text-foreground font-semibold">Time Savings vs Manual Process</h3>
              <div className="text-xs text-foreground/40 mt-0.5">Hours per week — AI-assisted vs. manual screening</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={timeSavingsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip {...chartTooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
                />
                <Bar
                  dataKey="manual"
                  name="Manual Process"
                  fill="rgba(255,255,255,0.15)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="aiSaved"
                  name="With AI"
                  fill="#D4AF37"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 rounded-lg bg-[#D4AF37]/10 border border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm text-[#D4AF37] font-semibold">
                  847 hours saved this month
                </span>
              </div>
              <div className="text-xs text-foreground/50 mt-1 ml-6">
                The AI screening pipeline replaced an estimated 847 hours of manual candidate review.
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Cost Savings Calculator */}
        <div>
          <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-foreground font-semibold">Cost Savings</h3>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { label: "Hours Saved", value: "847 hrs", sub: "This month" },
                { label: "At Avg Recruiter Rate", value: "$65/hr", sub: "Blended cost" },
                { label: "Total Cost Avoided", value: "$55,055", sub: "This month", highlight: true },
                { label: "Annual Projection", value: "$660,660", sub: "At current pace" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-lg border ${
                    item.highlight
                      ? "bg-[#D4AF37]/10 border-border"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div
                    className={`text-xl font-bold ${
                      item.highlight ? "text-[#D4AF37]" : "text-foreground"
                    }`}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-foreground/60 font-medium">{item.label}</div>
                  <div className="text-xs text-foreground/30">{item.sub}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Insights */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-foreground font-semibold">AI-Generated Insights</h3>
          <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs ml-auto">
            Updated daily
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-border transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 flex-shrink-0 mt-0.5">
                  <item.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <div>
                  <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs mb-2">
                    {item.tag}
                  </Badge>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.insight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </ModuleLayout>
  );
}
