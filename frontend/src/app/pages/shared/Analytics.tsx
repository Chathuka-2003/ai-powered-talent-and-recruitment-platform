import { GlassCard } from "../../components/GlassCard";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Download, TrendingUp, Users, Briefcase, Target } from "lucide-react";
import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function Analytics() {
  const navigate = useNavigate();

  const hiringTrends = [
    { month: "Jan", applications: 420, interviews: 150, hires: 45 },
    { month: "Feb", applications: 380, interviews: 140, hires: 42 },
    { month: "Mar", applications: 520, interviews: 180, hires: 58 },
    { month: "Apr", applications: 610, interviews: 220, hires: 72 },
    { month: "May", applications: 580, interviews: 210, hires: 68 },
    { month: "Jun", applications: 650, interviews: 240, hires: 85 },
  ];

  const sourceData = [
    { name: "Direct Application", value: 35, color: "#D4AF37" },
    { name: "Referrals", value: 25, color: "#22c55e" },
    { name: "LinkedIn", value: 20, color: "#3b82f6" },
    { name: "Job Boards", value: 15, color: "#a855f7" },
    { name: "Other", value: 5, color: "#f97316" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Recruitment Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your hiring performance</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value="3,420"
            icon={Users}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Interviews Conducted"
            value="1,140"
            icon={Target}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Successful Hires"
            value="370"
            icon={TrendingUp}
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Time to Hire"
            value="24 days"
            icon={Briefcase}
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Hiring Funnel Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hiringTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E1E1E",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#D4AF37" strokeWidth={2} />
                <Line type="monotone" dataKey="interviews" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="hires" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Application Sources</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E1E1E",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Monthly Performance */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={hiringTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1E1E",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="applications" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              <Bar dataKey="interviews" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hires" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
