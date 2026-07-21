import { DashboardLayout } from "../../components/DashboardLayout";
import { StatCard } from "../../components/StatCard";
import { GlassCard } from "../../components/GlassCard";
import { Users, Building, Briefcase, Activity, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
    const activityData = [
        { date: "Jun 10", users: 120, jobs: 45, applications: 234 },
        { date: "Jun 11", users: 135, jobs: 52, applications: 289 },
        { date: "Jun 12", users: 149, jobs: 48, applications: 312 },
        { date: "Jun 13", users: 168, jobs: 61, applications: 345 },
        { date: "Jun 14", users: 182, jobs: 58, applications: 378 },
        { date: "Jun 15", users: 195, jobs: 64, applications: 421 },
        { date: "Jun 16", users: 210, jobs: 71, applications: 456 },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">System Overview</h1>
                <p className="text-muted-foreground">Monitor platform performance and usage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value="1,248" icon={Users} trend={{ value: 12, isPositive: true }} />
                <StatCard title="Organizations" value="86" icon={Building} trend={{ value: 8, isPositive: true }} />
                <StatCard title="Active Jobs" value="324" icon={Briefcase} trend={{ value: 15, isPositive: true }} />
                <StatCard title="System Health" value="99.9%" icon={Activity} trend={{ value: 0.1, isPositive: true }} />
            </div>

            <GlassCard className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Platform Activity</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                        <XAxis dataKey="date" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1E1E1E",
                                border: "1px solid rgba(212, 175, 55, 0.2)",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                        />
                        <Line type="monotone" dataKey="users" stroke="#D4AF37" strokeWidth={2} />
                        <Line type="monotone" dataKey="jobs" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </GlassCard>

            <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activities</h2>
                    <div className="space-y-3">
                        {[
                            "New user registered: john.doe@company.com",
                            "Job posted: Senior Developer at Tech Corp",
                            "Organization created: Digital Solutions Inc.",
                            "System backup completed successfully",
                        ].map((activity, i) => (
                            <div key={i} className="p-3 rounded-lg bg-secondary/50 text-gray-300 text-sm">
                                {activity}
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">System Alerts</h2>
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-500 text-sm">
                            Storage usage at 75%
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/40 text-green-500 text-sm">
                            All systems operational
                        </div>
                    </div>
                </GlassCard>
            </div>
        </DashboardLayout>
    );
}
