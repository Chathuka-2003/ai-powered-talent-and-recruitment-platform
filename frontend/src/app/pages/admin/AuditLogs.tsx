import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Download, Filter, Search, ChevronLeft, ChevronRight, Shield } from "lucide-react";

type LogStatus = "Success" | "Failed" | "Warning";
type ActionType = "Login" | "Create" | "Update" | "Delete" | "Export" | "Config";

interface AuditLogEntry {
    id: number;
    timestamp: string;
    user: string;
    role: string;
    action: ActionType;
    resource: string;
    ip: string;
    status: LogStatus;
}

export function AuditLogs() {
    const [dateFilter, setDateFilter] = useState<"today" | "7d" | "30d">("7d");
    const [roleFilter, setRoleFilter] = useState("All");
    const [actionFilter, setActionFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const allLogs: AuditLogEntry[] = [
        { id: 1, timestamp: "2026-06-17 09:42:11", user: "james.okafor@palantir.com", role: "Admin", action: "Login", resource: "Auth Service", ip: "192.168.1.104", status: "Success" },
        { id: 2, timestamp: "2026-06-17 09:38:05", user: "unknown@attacker.io", role: "—", action: "Login", resource: "Auth Service", ip: "45.33.32.156", status: "Failed" },
        { id: 3, timestamp: "2026-06-17 09:15:44", user: "sarah.mills@talentai.io", role: "Admin", action: "Create", resource: "User: m.chen@stripe.com", ip: "10.0.0.22", status: "Success" },
        { id: 4, timestamp: "2026-06-17 08:58:22", user: "james.okafor@palantir.com", role: "Admin", action: "Update", resource: "Role: recruiter → hiring-manager", ip: "192.168.1.104", status: "Success" },
        { id: 5, timestamp: "2026-06-17 08:44:01", user: "linda.foster@talentai.io", role: "Admin", action: "Export", resource: "Audit Logs (CSV)", ip: "10.0.0.18", status: "Warning" },
        { id: 6, timestamp: "2026-06-16 17:22:33", user: "tom.walsh@talentai.io", role: "Admin", action: "Config", resource: "SMTP Settings", ip: "10.0.0.14", status: "Success" },
        { id: 7, timestamp: "2026-06-16 16:55:10", user: "unknown@bot.ru", role: "—", action: "Login", resource: "Auth Service", ip: "77.88.21.99", status: "Failed" },
        { id: 8, timestamp: "2026-06-16 15:30:48", user: "sarah.mills@talentai.io", role: "Admin", action: "Delete", resource: "User: test.account@temp.com", ip: "10.0.0.22", status: "Success" },
        { id: 9, timestamp: "2026-06-16 14:10:05", user: "james.okafor@palantir.com", role: "Admin", action: "Update", resource: "Security: MFA enforcement enabled", ip: "192.168.1.104", status: "Success" },
        { id: 10, timestamp: "2026-06-16 13:47:22", user: "anna.liu@talentai.io", role: "Admin", action: "Export", resource: "User Data Report (CSV)", ip: "10.0.0.31", status: "Success" },
        { id: 11, timestamp: "2026-06-16 12:05:18", user: "linda.foster@talentai.io", role: "Admin", action: "Create", resource: "API Key: webhook-prod-01", ip: "10.0.0.18", status: "Success" },
        { id: 12, timestamp: "2026-06-16 11:28:44", user: "unknown@192.0.2.1", role: "—", action: "Login", resource: "Auth Service", ip: "192.0.2.1", status: "Failed" },
        { id: 13, timestamp: "2026-06-15 16:42:09", user: "tom.walsh@talentai.io", role: "Admin", action: "Update", resource: "Platform: Maintenance mode ON", ip: "10.0.0.14", status: "Warning" },
        { id: 14, timestamp: "2026-06-15 14:10:55", user: "anna.liu@talentai.io", role: "Admin", action: "Create", resource: "Integration: LinkedIn ATS", ip: "10.0.0.31", status: "Success" },
        { id: 15, timestamp: "2026-06-15 11:33:27", user: "sarah.mills@talentai.io", role: "Admin", action: "Config", resource: "Session timeout: 30min → 60min", ip: "10.0.0.22", status: "Success" },
        { id: 16, timestamp: "2026-06-14 17:58:03", user: "james.okafor@palantir.com", role: "Admin", action: "Delete", resource: "API Key: legacy-webhook-v1", ip: "192.168.1.104", status: "Success" },
        { id: 17, timestamp: "2026-06-14 15:20:44", user: "linda.foster@talentai.io", role: "Admin", action: "Update", resource: "Email template: offer-letter-v3", ip: "10.0.0.18", status: "Success" },
        { id: 18, timestamp: "2026-06-13 10:44:19", user: "unknown@proxynet.org", role: "—", action: "Login", resource: "Auth Service", ip: "185.220.101.3", status: "Failed" },
        { id: 19, timestamp: "2026-06-13 09:15:38", user: "tom.walsh@talentai.io", role: "Admin", action: "Export", resource: "Analytics Report Q2 (CSV)", ip: "10.0.0.14", status: "Success" },
        { id: 20, timestamp: "2026-06-12 14:02:11", user: "anna.liu@talentai.io", role: "Admin", action: "Config", resource: "IP Allowlist: add 203.0.113.0/24", ip: "10.0.0.31", status: "Success" },
    ];

    const getStatusStyle = (status: LogStatus) => {
        switch (status) {
            case "Success": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "Failed": return "bg-red-500/20 text-red-400 border-red-500/30";
            case "Warning": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        }
    };

    const getActionStyle = (action: ActionType) => {
        switch (action) {
            case "Login": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "Create": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "Update": return "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40";
            case "Delete": return "bg-red-500/20 text-red-400 border-red-500/30";
            case "Export": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            case "Config": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
        }
    };

    const filteredLogs = allLogs.filter((log) => {
        if (roleFilter !== "All" && log.role !== roleFilter) return false;
        if (actionFilter !== "All" && log.action !== actionFilter) return false;
        if (statusFilter !== "All" && log.status !== statusFilter) return false;
        if (searchQuery && !log.user.toLowerCase().includes(searchQuery.toLowerCase()) && !log.resource.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const pageSize = 10;
    const totalPages = Math.ceil(filteredLogs.length / pageSize);
    const pagedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleExportCSV = () => {
        const headers = ["Timestamp", "User", "Role", "Action", "Resource", "IP Address", "Status"];
        const rows = filteredLogs.map((l) => [l.timestamp, l.user, l.role, l.action, l.resource, l.ip, l.status]);
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audit-logs.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout role="admin">
            <div className="mb-8">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
                        <p className="text-muted-foreground">Track all system events and user activity</p>
                    </div>
                    <Button
                        onClick={handleExportCSV}
                        className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <GlassCard className="p-5 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search user or resource..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-1">
                        <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                        {(["today", "7d", "30d"] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => { setDateFilter(d); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${dateFilter === d
                                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/60"
                                        : "text-muted-foreground border border-transparent hover:border-border hover:text-gray-200"
                                    }`}
                            >
                                {d === "today" ? "Today" : d === "7d" ? "7 Days" : "30 Days"}
                            </button>
                        ))}
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-secondary border border-border rounded-lg text-gray-300 text-sm px-3 py-2 focus:outline-none focus:border-[#D4AF37]/60"
                    >
                        {["All", "Admin", "Recruiter", "Hiring Manager", "Job Seeker"].map((r) => (
                            <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
                        ))}
                    </select>

                    {/* Action Filter */}
                    <select
                        value={actionFilter}
                        onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-secondary border border-border rounded-lg text-gray-300 text-sm px-3 py-2 focus:outline-none focus:border-[#D4AF37]/60"
                    >
                        {["All", "Login", "Create", "Update", "Delete", "Export", "Config"].map((a) => (
                            <option key={a} value={a}>{a === "All" ? "All Actions" : a}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-secondary border border-border rounded-lg text-gray-300 text-sm px-3 py-2 focus:outline-none focus:border-[#D4AF37]/60"
                    >
                        {["All", "Success", "Failed", "Warning"].map((s) => (
                            <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                        ))}
                    </select>
                </div>
            </GlassCard>

            {/* Log Table */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#D4AF37]" />
                        System Events
                    </h2>
                    <p className="text-sm text-muted-foreground">{filteredLogs.length} events found</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                {["Timestamp", "User", "Role", "Action", "Resource", "IP Address", "Status"].map((h) => (
                                    <th key={h} className="text-left text-muted-foreground font-medium pb-3 pr-4 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedLogs.map((log) => (
                                <tr key={log.id} className="border-b border-border hover:bg-[#D4AF37]/5 transition-colors">
                                    <td className="py-3 pr-4 text-muted-foreground font-mono text-xs whitespace-nowrap">{log.timestamp}</td>
                                    <td className="py-3 pr-4 text-gray-200 max-w-[180px] truncate" title={log.user}>{log.user}</td>
                                    <td className="py-3 pr-4 text-muted-foreground">{log.role}</td>
                                    <td className="py-3 pr-4">
                                        <Badge className={getActionStyle(log.action)}>{log.action}</Badge>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-300 max-w-[200px] truncate" title={log.resource}>{log.resource}</td>
                                    <td className="py-3 pr-4 text-muted-foreground font-mono text-xs">{log.ip}</td>
                                    <td className="py-3 pr-4">
                                        <Badge className={getStatusStyle(log.status)}>{log.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * pageSize + 1, filteredLogs.length)}–{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} entries
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="border-border text-gray-300 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p)}
                                className={`border-border ${currentPage === p ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-gray-300"}`}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="border-border text-gray-300 disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </GlassCard>
        </DashboardLayout>
    );
}
