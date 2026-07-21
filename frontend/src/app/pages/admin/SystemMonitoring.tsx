import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Activity, Database, Server, Cpu, HardDrive, Wifi } from "lucide-react";

export function SystemMonitoring() {
    const systemMetrics = [
        { icon: Cpu, label: "CPU Usage", value: "42%", status: "healthy" },
        { icon: HardDrive, label: "Storage", value: "65%", status: "warning" },
        { icon: Database, label: "Database", value: "Online", status: "healthy" },
        { icon: Server, label: "Server Load", value: "Low", status: "healthy" },
        { icon: Wifi, label: "Network", value: "Stable", status: "healthy" },
        { icon: Activity, label: "Uptime", value: "99.9%", status: "healthy" },
    ];

    const recentLogs = [
        { time: "10:45:23", type: "INFO", message: "User login: john.doe@example.com" },
        { time: "10:42:15", type: "SUCCESS", message: "Database backup completed" },
        { time: "10:38:47", type: "WARNING", message: "High memory usage detected" },
        { time: "10:30:12", type: "INFO", message: "Job created: Senior Developer" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
                return "bg-green-500/20 text-green-500 border-green-500/40";
            case "warning":
                return "bg-yellow-500/20 text-yellow-500 border-yellow-500/40";
            case "error":
                return "bg-red-500/20 text-red-500 border-red-500/40";
            default:
                return "";
        }
    };

    const getLogColor = (type: string) => {
        switch (type) {
            case "SUCCESS":
                return "text-green-500";
            case "WARNING":
                return "text-yellow-500";
            case "ERROR":
                return "text-red-500";
            default:
                return "text-blue-500";
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">System Monitoring</h1>
                <p className="text-muted-foreground">Monitor system health and activity logs</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {systemMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <GlassCard key={index} className="p-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="rounded-lg bg-[#D4AF37]/10 p-3 mb-3">
                                    <Icon className="h-6 w-6 text-[#D4AF37]" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                                <p className="font-semibold text-foreground mb-2">{metric.value}</p>
                                <Badge className={getStatusColor(metric.status)}>
                                    {metric.status}
                                </Badge>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Activity Logs</h2>
                <div className="space-y-3">
                    {recentLogs.map((log, index) => (
                        <div
                            key={index}
                            className="flex items-start space-x-4 p-3 rounded-lg bg-secondary/50"
                        >
                            <span className="text-sm text-muted-foreground font-mono">{log.time}</span>
                            <Badge className={getLogColor(log.type)} variant="outline">
                                {log.type}
                            </Badge>
                            <span className="text-sm text-gray-300 flex-1">{log.message}</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </DashboardLayout>
    );
}
