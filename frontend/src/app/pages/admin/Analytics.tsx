import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { StatCard } from "../../components/StatCard";
import { Badge } from "../../components/ui/badge";
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
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Users, Briefcase, FileText, Activity } from "lucide-react";

const CHART_COLORS = ["#D4AF37", "#E5C158", "#B8961F", "#FFD700", "#C9A227"];

export function AdminAnalytics() {
    const [_timeRange] = useState("30d");

    // Daily active users — last 30 days
    const dauData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2026, 4, 18 + i); // May 18 – Jun 16
        const label = `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`;
        const base = 4200 + Math.sin(i * 0.4) * 600 + i * 30;
        return { date: label, users: Math.round(base + (Math.random() - 0.5) * 400) };
    });

    // User registration by role
    const userRegData = [
        { month: "Jan", jobSeekers: 1240, recruiters: 88, managers: 34 },
        { month: "Feb", jobSeekers: 1380, recruiters: 102, managers: 41 },
        { month: "Mar", jobSeekers: 1520, recruiters: 115, managers: 55 },
        { month: "Apr", jobSeekers: 1710, recruiters: 128, managers: 62 },
        { month: "May", jobSeekers: 1890, recruiters: 147, managers: 70 },
        { month: "Jun", jobSeekers: 2040, recruiters: 162, managers: 78 },
    ];

    // Job postings & applications
    const jobAppData = [
        { month: "Jan", jobs: 480, applications: 4210 },
        { month: "Feb", jobs: 540, applications: 4890 },
        { month: "Mar", jobs: 610, applications: 5540 },
        { month: "Apr", jobs: 680, applications: 6120 },
        { month: "May", jobs: 740, applications: 6870 },
        { month: "Jun", jobs: 800, applications: 7480 },
    ];

    // Feature usage
    const featureUsageData = [
        { name: "AI Resume Parsing", value: 38 },
        { name: "Job Matching", value: 29 },
        { name: "Video Interviews", value: 21 },
        { name: "Messages", value: 12 },
    ];

    // Top orgs
    const topOrgs = [
        { org: "Palantir Technologies", jobs: 124, hires: 38, avgTTH: "19 days" },
        { org: "Stripe", jobs: 98, hires: 31, avgTTH: "21 days" },
        { org: "Figma", jobs: 87, hires: 28, avgTTH: "24 days" },
        { org: "Vercel", jobs: 74, hires: 22, avgTTH: "18 days" },
        { org: "Anthropic", jobs: 68, hires: 19, avgTTH: "22 days" },
        { org: "Notion", jobs: 61, hires: 17, avgTTH: "26 days" },
        { org: "Linear", jobs: 55, hires: 14, avgTTH: "20 days" },
    ];

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name?: string; value: number }[]; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                    <p className="text-muted-foreground text-xs mb-2">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} className="text-foreground text-sm font-semibold">
                            {p.name ? `${p.name}: ` : ""}{p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: {
        cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; name: string;
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="#9CA3AF" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11}>
                {name} ({(percent * 100).toFixed(0)}%)
            </text>
        );
    };

    return (
        <DashboardLayout role="admin">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Platform Analytics</h1>
                <p className="text-muted-foreground">Platform-wide performance metrics and usage insights</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value="12,847"
                    icon={Users}
                    trend={{ value: 14, isPositive: true }}
                />
                <StatCard
                    title="Active Jobs"
                    value="3,421"
                    icon={Briefcase}
                    trend={{ value: 9, isPositive: true }}
                />
                <StatCard
                    title="Applications This Month"
                    value="28,903"
                    icon={FileText}
                    trend={{ value: 22, isPositive: true }}
                />
                <StatCard
                    title="Platform Uptime"
                    value="99.97%"
                    icon={Activity}
                    trend={{ value: 0.02, isPositive: true }}
                />
            </div>

            {/* Row 1: DAU */}
            <GlassCard className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">Daily Active Users</h2>
                <p className="text-sm text-muted-foreground mb-6">Platform activity over the last 30 days</p>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={dauData} margin={{ left: -10, right: 10 }}>
                        <defs>
                            <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "#9CA3AF", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            interval={4}
                        />
                        <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke={CHART_COLORS[0]}
                            strokeWidth={2}
                            fill="url(#dauGrad)"
                            name="Active Users"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </GlassCard>

            {/* Row 2: User Reg + Job/App Volume */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Registration Trend */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">User Registration Trend</h2>
                    <p className="text-sm text-muted-foreground mb-6">New users by role type (YTD)</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={userRegData} margin={{ left: -10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                            <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="jobSeekers" name="Job Seekers" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} stackId="a" />
                            <Bar dataKey="recruiters" name="Recruiters" fill={CHART_COLORS[2]} radius={[0, 0, 0, 0]} stackId="a" />
                            <Bar dataKey="managers" name="Managers" fill={CHART_COLORS[3]} radius={[2, 2, 0, 0]} stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>

                {/* Job Posting & Application Volume */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Jobs & Applications</h2>
                    <p className="text-sm text-muted-foreground mb-6">Monthly job postings and application volume</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={jobAppData} margin={{ left: -10, right: 10 }}>
                            <defs>
                                <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="appsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                            <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="jobs" name="Jobs Posted" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#jobsGrad)" dot={{ r: 3, fill: CHART_COLORS[0] }} />
                            <Area type="monotone" dataKey="applications" name="Applications" stroke={CHART_COLORS[2]} strokeWidth={2} fill="url(#appsGrad)" dot={{ r: 3, fill: CHART_COLORS[2] }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* Row 3: Feature Usage Pie + Top Orgs Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Usage Pie */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Feature Usage Breakdown</h2>
                    <p className="text-sm text-muted-foreground mb-4">Percentage of total feature interactions</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={featureUsageData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                labelLine
                                label={PieLabel}
                            >
                                {featureUsageData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: "#1E1E1E", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </GlassCard>

                {/* Top Organizations Table */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Top Performing Organizations</h2>
                    <p className="text-sm text-muted-foreground mb-6">Ranked by hiring activity</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left text-muted-foreground font-medium pb-3">Organization</th>
                                    <th className="text-right text-muted-foreground font-medium pb-3">Jobs</th>
                                    <th className="text-right text-muted-foreground font-medium pb-3">Hires</th>
                                    <th className="text-right text-muted-foreground font-medium pb-3">Avg TTH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topOrgs.map((org, i) => (
                                    <tr key={i} className="border-b border-border hover:bg-[#D4AF37]/5 transition-colors">
                                        <td className="py-3 text-foreground font-medium">{org.org}</td>
                                        <td className="py-3 text-right text-gray-300">{org.jobs}</td>
                                        <td className="py-3 text-right">
                                            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">{org.hires}</Badge>
                                        </td>
                                        <td className="py-3 text-right text-gray-300">{org.avgTTH}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>
        </DashboardLayout>
    );
}
