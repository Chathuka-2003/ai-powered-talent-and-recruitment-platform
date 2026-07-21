import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, useSearchParams, useLocation, useParams } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { AccountSettingsView } from "../shared/AccountSettingsView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, BarChart3, Bell, Briefcase, Building, Calendar, CheckCircle2, Database, Download, Edit3, Eye, FileText, Filter, Lock, Monitor, Plus, RefreshCcw, Search, Server, Settings, Shield, Sparkles, Trash2, UserCog, Users, XCircle } from "lucide-react";
import { api } from "../../api";
import { NotificationsView } from "../shared/NotificationsView";

const gold = "#D4AF37";
const users = [
    ["Kavishi Rajasekara", "kavishi@email.com", "Job Seeker", "Active", "TalentAI", "18/06/2026"],
    ["Sarah Jenkins", "sarah@acme.com", "Recruiter", "Active", "Acme Corp", "11/06/2026"],
    ["David Kim", "david@acme.com", "Hiring Manager", "Suspended", "Acme Corp", "05/06/2026"],
    ["Elena Rodriguez", "elena@talentai.com", "Administrator", "Active", "TalentAI", "01/06/2026"],
];
const orgs = [["Acme Corp", "Software", "128", "Enterprise", "Active"], ["Virtusa", "Technology Services", "86", "Growth", "Active"], ["LankaFin", "Finance", "42", "Starter", "Suspended"]];
const jobs = [["Software Engineer Intern", "Acme Corp", "Active", "18/06/2026", "420"], ["QA Intern", "Virtusa", "Closed", "12/06/2026", "118"], ["Backend Developer", "LankaFin", "Active", "09/06/2026", "84"]];
const apps = [["Kavishi Rajasekara", "Software Engineer Intern", "Acme Corp", "Under Review", "18/06/2026"], ["Nimal Perera", "QA Intern", "Virtusa", "Shortlisted", "17/06/2026"]];
const chart = [{ name: "Users", value: 12480 }, { name: "Jobs", value: 642 }, { name: "Apps", value: 18420 }, { name: "Interviews", value: 1284 }, { name: "Hires", value: 326 }];

function Header({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-6"><p className="text-sm text-[#D4AF37]">Administrator / {title}</p><h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1><p className="text-muted-foreground max-w-4xl">{subtitle}</p></div>; }
function AdminCard({ title, value, icon: Icon, to }: { title: string; value: string; icon: typeof Users; to: string }) { const navigate = useNavigate(); return <button onClick={() => navigate(to)} className="text-left rounded-lg border border-border bg-card/60 backdrop-blur-md p-5 hover:border-[#D4AF37]/50 hover:bg-secondary/60 transition-all"><div className="flex justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</p><h3 className="mt-2 text-2xl font-semibold text-foreground">{value}</h3></div><div className="rounded-xl bg-[#D4AF37]/10 p-3 h-fit"><Icon className="h-5 w-5 text-[#D4AF37]" /></div></div></button>; }
function Toolbar({ children }: { children: ReactNode }) { return <GlassCard className="p-4 mb-5"><div className="flex flex-wrap gap-3">{children}</div></GlassCard>; }
function Table({ heads, rows, actions }: { heads: string[]; rows: string[][]; actions: (row: string[]) => ReactNode }) { return <GlassCard className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-sm"><thead><tr>{heads.map(h => <th key={h} className="px-5 py-4 text-left text-xs uppercase tracking-[.18em] text-muted-foreground border-b border-border">{h}</th>)}<th className="px-5 py-4 text-left text-xs uppercase tracking-[.18em] text-muted-foreground border-b border-border">Actions</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i} className="hover:bg-[#D4AF37]/5">{r.map((c, j) => <td key={j} className="px-5 py-4 border-b border-border text-gray-300">{j === 0 ? <b className="text-foreground">{c}</b> : c}</td>)}<td className="px-5 py-4 border-b border-border">{actions(r)}</td></tr>)}</tbody></table></div></GlassCard>; }
const Action = ({ children, to, variant = "outline" }: { children: ReactNode; to: string; variant?: "outline" | "default" | "destructive" | "ghost" }) => { const n = useNavigate(); return <Button size="sm" variant={variant} onClick={() => n(to)}>{children}</Button>; };

export function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
// Load dashboard statistics when the component is first rendered.

    useEffect(() => {
        api.admin.getDashboardStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <DashboardLayout role="admin"><Header title="Platform Dashboard" subtitle="Loading metrics..." /></DashboardLayout>;

    return <DashboardLayout role="admin"><Header title="Platform Dashboard" subtitle="Complete overview of TalentAI performance, user activity, organizations, jobs, applications, interviews, AI usage, and infrastructure health." /><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">{[
        ["Total Users", stats.totalUsers.toLocaleString(), Users, "/admin/users"], ["Total Recruiters", stats.totalRecruiters.toLocaleString(), UserCog, "/admin/users?role=recruiter"], ["Total Hiring Managers", stats.totalHiringManagers.toLocaleString(), Users, "/admin/users?role=hiring-manager"], ["Total Job Seekers", stats.totalJobSeekers.toLocaleString(), Users, "/admin/users?role=jobseeker"], ["Total Organizations", stats.totalOrganizations.toLocaleString(), Building, "/admin/organizations"], ["Total Jobs Posted", stats.totalJobsPosted.toLocaleString(), Briefcase, "/admin/jobs"], ["Active Jobs", stats.activeJobs.toLocaleString(), CheckCircle2, "/admin/jobs/active"], ["Closed Jobs", stats.closedJobs.toLocaleString(), XCircle, "/admin/jobs/closed"], ["Applications Received", stats.applicationsReceived.toLocaleString(), FileText, "/admin/applications"], ["Interviews Scheduled", stats.interviewsScheduled.toLocaleString(), Calendar, "/admin/interviews"], ["Hires Completed", stats.hiresCompleted.toLocaleString(), Shield, "/admin/reports/hiring"], ["AI Resume Screenings", stats.aiResumeScreenings.toLocaleString(), Sparkles, "/admin/ai-monitoring"], ["AI Candidate Rankings", stats.aiCandidateRankings.toLocaleString(), Sparkles, "/admin/ai-monitoring"], ["AI Recommendations Generated", stats.aiRecommendationsGenerated.toLocaleString(), Sparkles, "/admin/ai-monitoring"], ["AI Accuracy Score", stats.aiAccuracyScore + "%", BarChart3, "/admin/ai-analytics"], ["System Health", stats.systemHealth + "%", Activity, "/admin/monitoring"], ["Server Status", stats.serverStatus || "Operational", Server, "/admin/infrastructure"], ["Database Status", stats.databaseStatus || "Healthy", Database, "/admin/database"], ["API Response Time", stats.apiResponseTime || "142ms", Monitor, "/admin/api-analytics"]].map(([t, v, I, to]) => <AdminCard key={t as string} title={t as string} value={v as string} icon={I as typeof Users} to={to as string} />)}</div><div className="grid xl:grid-cols-3 gap-6"><GlassCard className="xl:col-span-2 p-6"><h2 className="text-xl text-foreground font-semibold mb-4">Platform Statistics</h2><ResponsiveContainer width="100%" height={300}><BarChart data={stats.chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" /><XAxis dataKey="name" stroke="#999" /><YAxis stroke="#999" /><Tooltip contentStyle={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(212,175,55,.25)", color: "#fff" }} /><Bar dataKey="value" fill={gold} radius={[8, 8, 0, 0]} onClick={() => location.assign('/admin/analytics/detail')} /></BarChart></ResponsiveContainer></GlassCard><NotificationsMini /></div></DashboardLayout>;
}
function NotificationsMini() {
    const n = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("talentai.user");
            if (userStr) {
                const u = JSON.parse(userStr);
                api.notifications.getByUser(u.id).then(data => setNotifications(data.slice(0, 4))).catch(console.error);
            }
        } catch { }
    }, []);

    return (
        <GlassCard className="p-6">
            <h2 className="text-xl text-foreground font-semibold mb-4">Recent Notifications</h2>
            {notifications.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent notifications</p>
            ) : (
                notifications.map((notif) => (
                    <button key={notif.id} onClick={() => n('/admin/notifications')} className="block w-full text-left p-3 rounded-xl bg-secondary/50 border border-border mb-3 text-gray-300 hover:border-[#D4AF37]/40">
                        🔔 {notif.title}
                    </button>
                ))
            )}
        </GlassCard>
    );
}

export function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const roleFilter = searchParams.get("role");

    useEffect(() => {
        api.admin.getAllUsers()
            .then(data => {
                if (roleFilter) {
                    const roleMap: Record<string, number> = { "admin": 0, "recruiter": 1, "hiring-manager": 2, "jobseeker": 3 };
                    const mappedRole = roleMap[roleFilter];
                    setUsers(data.filter((u: any) => u.role === mappedRole));
                } else {
                    setUsers(data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [roleFilter]);

    const handleStatusUpdate = (id: string, isActive: boolean) => {
        api.admin.updateUserStatus(id, isActive).then(() => {
            setUsers(users.map(u => u.id === id ? { ...u, isActive } : u));
        }).catch(console.error);
    };

    const handleDelete = (id: string) => {
        api.admin.deleteUser(id).then(() => {
            setUsers(users.map(u => u.id === id ? { ...u, isActive: false } : u));
        }).catch(console.error);
    };

    if (loading) return <DashboardLayout role="admin"><Header title="User Management" subtitle="Loading users..." /></DashboardLayout>;

    return <DashboardLayout role="admin"><Header title="User Management" subtitle="Manage all platform users, roles, and access levels" /><Table heads={["Name", "Email", "Role", "Status", "Organization", "Joined"]} rows={users.map((u) => [
        `${u.firstName} ${u.lastName}`, u.email, u.role === 0 ? "Admin" : u.role === 1 ? "Recruiter" : u.role === 2 ? "Hiring Manager" : "Candidate", u.isActive ? "Active" : "Inactive", u.organization?.name || "None", new Date(u.createdAt).toLocaleDateString()
    ])} actions={(row) => {
        const user = users.find(u => u.email === row[1]);
        return <div className="flex gap-2">
            <Action to={`/admin/users/${user?.id}`} variant="outline">View</Action>
            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(user?.id, !user?.isActive)}>{user?.isActive ? "Deactivate" : "Activate"}</Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(user?.id)}>Delete</Button>
        </div>
    }} /></DashboardLayout>;
}
export function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (id) {
            api.admin.getUserById(id).then(setUser).catch(console.error);
        }
    }, [id]);

    if (!user) return <DashboardLayout role="admin"><Header title="User Profile" subtitle="Loading..." /></DashboardLayout>;

    return <DashboardLayout role="admin">
        <Header title="User Profile" subtitle={`Detailed record view for ${user.firstName} ${user.lastName}.`} />
        <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Profile Information</h3>
                <p className="text-muted-foreground mb-1"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p className="text-muted-foreground mb-1"><strong>Email:</strong> {user.email}</p>
                <p className="text-muted-foreground mb-1"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p className="text-muted-foreground"><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</p>
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Organization & Role</h3>
                <p className="text-muted-foreground mb-1"><strong>Role:</strong> {user.role === 0 ? "Administrator" : user.role === 1 ? "Recruiter" : user.role === 2 ? "Hiring Manager" : "Job Seeker"}</p>
                <p className="text-muted-foreground mb-1"><strong>Organization:</strong> {user.organization?.name || "None"}</p>
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Activity History</h3>
                <p className="text-muted-foreground">Audit logs and activity history will be displayed here.</p>
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Login History</h3>
                <p className="text-muted-foreground">Recent login attempts and session data will be tracked here.</p>
            </GlassCard>
        </div>
    </DashboardLayout>;
}
export function UserForm() { return <DashboardLayout role="admin"><Header title="Employee Account" subtitle="Only administrators can create employee accounts, assign employee roles, edit details, and activate or deactivate access." /><GlassCard className="p-6"><div className="grid md:grid-cols-2 gap-4"><Input placeholder="Full Name" className="bg-secondary border-border text-foreground" /><Input placeholder="Email" className="bg-secondary border-border text-foreground" /><Select><SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Employee Role" /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="recruiter">Recruiter</SelectItem><SelectItem value="hiring-manager">Hiring Manager</SelectItem></SelectContent></Select><Select><SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Account Status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><Input placeholder="Organization" className="bg-secondary border-border text-foreground" /><Input placeholder="Phone Number" className="bg-secondary border-border text-foreground" /></div><div className="mt-5 flex flex-wrap gap-3"><Button>Save Employee</Button><Button variant="outline">Activate Account</Button><Button variant="outline">Deactivate Account</Button><Button variant="outline">Cancel</Button></div></GlassCard></DashboardLayout> }

export function RoleManagement() { const rows = [["Administrator", "Full platform control", "4"], ["Recruiter", "Company hiring workflows", "842"], ["Hiring Manager", "Candidate evaluation and decisions", "516"], ["Job Seeker", "Candidate job search experience", "11,122"]]; return <DashboardLayout role="admin"><Header title="Role Management" subtitle="Manage platform RBAC roles, details, and permissions." /><Toolbar><Action to="/admin/roles/create" variant="default"><Plus className="mr-2 h-4 w-4" />Create Role</Action></Toolbar><Table heads={["Role Name", "Description", "User Count"]} rows={rows} actions={() => <div className="flex flex-wrap gap-2"><Action to="/admin/roles/details">View Role</Action><Action to="/admin/roles/edit">Edit Role</Action><Action to="/admin/roles/permissions">Manage Permissions</Action><Button size="sm" variant="destructive">Delete Role</Button></div>} /></DashboardLayout> }
export function PermissionsPage() { return <DashboardLayout role="admin"><Header title="Permissions" subtitle="Module-level read, create, update, and delete access configuration." /><Table heads={["Module Name", "Read Access", "Create Access", "Update Access", "Delete Access"]} rows={[["Users", "Enabled", "Enabled", "Enabled", "Enabled"], ["Jobs", "Enabled", "Enabled", "Enabled", "Enabled"], ["AI Monitoring", "Enabled", "Disabled", "Enabled", "Disabled"], ["Audit Logs", "Enabled", "Disabled", "Disabled", "Disabled"]]} actions={() => <Button size="sm">Save</Button>} /></DashboardLayout> }

export function OrganizationManagement() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.admin.getAllOrganizations()
            .then(setOrganizations)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <DashboardLayout role="admin"><Header title="Organizations" subtitle="Loading organizations..." /></DashboardLayout>;

    const filteredOrgs = organizations.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

    return <DashboardLayout role="admin"><Header title="Organizations" subtitle="Manage registered companies and their hiring teams" /><Toolbar><Action to="/admin/organizations/create" variant="default"><Plus className="mr-2 h-4 w-4" />Create Organization</Action><Input placeholder="Search organization" className="max-w-xs bg-secondary border-border text-foreground" value={search} onChange={(e) => setSearch(e.target.value)} /></Toolbar><Table heads={["Organization", "Recruiters & HMs", "Active Jobs", "Status", "Joined"]} rows={filteredOrgs.map((o) => [
        o.name, o.userCount.toString(), o.jobCount.toString(), "Active", new Date(o.createdAt).toLocaleDateString()
    ])} actions={(row) => {
        const org = organizations.find(o => o.name === row[0]);
        return <div className="flex gap-2">
            <Action to={`/admin/organizations/${org?.id}`}>View Details</Action>
            <Button size="sm" variant="outline">Suspend</Button>
        </div>
    }} /></DashboardLayout>;
}
export function OrganizationProfile() {
    const { id } = useParams();
    const [org, setOrg] = useState<any>(null);

    useEffect(() => {
        if (id) {
            api.organizations.getById(id).then(setOrg).catch(console.error);
        }
    }, [id]);

    if (!org) return <DashboardLayout role="admin"><Header title="Organization Profile" subtitle="Loading..." /></DashboardLayout>;

    return <DashboardLayout role="admin">
        <Header title="Organization Profile" subtitle={`Detailed record view for ${org.name}.`} />
        <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Company Details</h3>
                <p className="text-muted-foreground mb-1"><strong>Name:</strong> {org.name}</p>
                <p className="text-muted-foreground mb-1"><strong>Website:</strong> {org.website || "N/A"}</p>
                <p className="text-muted-foreground mb-1"><strong>Description:</strong> {org.description || "N/A"}</p>
                <p className="text-muted-foreground"><strong>Joined:</strong> {new Date(org.createdAt).toLocaleDateString()}</p>
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Recruiters</h3>
                {org.recruiters && org.recruiters.length > 0 ? org.recruiters.map((r: any) => (
                    <p key={r.id} className="text-muted-foreground">{r.firstName} {r.lastName} - {r.email}</p>
                )) : <p className="text-muted-foreground">No recruiters assigned.</p>}
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Hiring Managers</h3>
                {org.hiringManagers && org.hiringManagers.length > 0 ? org.hiringManagers.map((h: any) => (
                    <p key={h.id} className="text-muted-foreground">{h.firstName} {h.lastName} - {h.email}</p>
                )) : <p className="text-muted-foreground">No hiring managers assigned.</p>}
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Job Statistics</h3>
                <p className="text-muted-foreground"><strong>Total Jobs:</strong> {org.jobs ? org.jobs.length : 0}</p>
                <p className="text-muted-foreground"><strong>Active Jobs:</strong> {org.jobs ? org.jobs.filter((j: any) => j.status === 1).length : 0}</p>
                <p className="text-muted-foreground"><strong>Closed Jobs:</strong> {org.jobs ? org.jobs.filter((j: any) => j.status === 2).length : 0}</p>
            </GlassCard>
        </div>
    </DashboardLayout>;
}

export function OrganizationCreateForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", website: "", description: "", address: "" });
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        if (!formData.name) return;
        setSaving(true);
        api.organizations.create(formData)
            .then((res) => {
                navigate('/admin/organizations');
            })
            .catch(console.error)
            .finally(() => setSaving(false));
    };

    const handleCancel = () => {
        navigate('/admin/organizations');
    };

    return <DashboardLayout role="admin">
        <Header title="New Organization" subtitle="Register a new company to the platform." />
        <GlassCard className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Company Name" className="bg-secondary border-border text-foreground" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <Input placeholder="Website" className="bg-secondary border-border text-foreground" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                <Input placeholder="Description" className="bg-secondary border-border text-foreground" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <Input placeholder="Address" className="bg-secondary border-border text-foreground" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="mt-5 flex gap-3">
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
            </div>
        </GlassCard>
    </DashboardLayout>;
}

export function JobCreateForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        employmentType: "Full-time",
        minimumSalary: 0,
        maximumSalary: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 1
    });
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        if (!formData.title) return;
        setSaving(true);
        const submitData = {
            ...formData,
            minimumSalary: Number(formData.minimumSalary),
            maximumSalary: Number(formData.maximumSalary),
            expiryDate: new Date(formData.expiryDate).toISOString()
        };
        api.jobs.create(submitData)
            .then(() => {
                navigate('/admin/jobs');
            })
            .catch(console.error)
            .finally(() => setSaving(false));
    };

    const handleCancel = () => {
        navigate('/admin/jobs');
    };

    return <DashboardLayout role="admin">
        <Header title="Create Job" subtitle="Post a new job requisition to the platform." />
        <GlassCard className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Job Title" className="bg-secondary border-border text-foreground" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <Input placeholder="Location" className="bg-secondary border-border text-foreground" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                <Input placeholder="Description" className="bg-secondary border-border text-foreground md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                <Select value={formData.employmentType} onValueChange={v => setFormData({ ...formData, employmentType: v })}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={formData.status.toString()} onValueChange={v => setFormData({ ...formData, status: parseInt(v) })}>
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Draft</SelectItem>
                    </SelectContent>
                </Select>

                <Input type="number" placeholder="Min Salary" className="bg-secondary border-border text-foreground" value={formData.minimumSalary} onChange={e => setFormData({ ...formData, minimumSalary: parseInt(e.target.value) || 0 })} />
                <Input type="number" placeholder="Max Salary" className="bg-secondary border-border text-foreground" value={formData.maximumSalary} onChange={e => setFormData({ ...formData, maximumSalary: parseInt(e.target.value) || 0 })} />
                <Input type="date" className="bg-secondary border-border text-foreground" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
            </div>
            <div className="mt-5 flex gap-3">
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
            </div>
        </GlassCard>
    </DashboardLayout>;
}

export function JobManagement() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        api.jobs.getAll()
            .then(data => {
                if (location.pathname.includes('/active')) {
                    setJobs(data.filter((j: any) => j.status === 1)); // Active
                } else if (location.pathname.includes('/closed')) {
                    setJobs(data.filter((j: any) => j.status === 2)); // Closed
                } else {
                    setJobs(data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [location.pathname]);

    if (loading) return <DashboardLayout role="admin"><Header title="Jobs" subtitle="Loading jobs..." /></DashboardLayout>;

    return <DashboardLayout role="admin"><Header title="Job Management" subtitle="Inspect platform jobs, details, applications, and hiring status." /><Toolbar><Action to="/admin/jobs/create" variant="default"><Plus className="mr-2 h-4 w-4" />Create Job</Action><Input placeholder="Search jobs" className="max-w-xs bg-secondary border-border text-foreground" /></Toolbar><Table heads={["Job Title", "Company", "Status", "Posted Date", "Applications"]} rows={jobs.map((j) => [
        j.title, j.organization?.name || "N/A", j.status === 1 ? "Active" : j.status === 2 ? "Closed" : j.status === 3 ? "Paused" : "Draft", new Date(j.createdAt).toLocaleDateString(), "View Apps"
    ])} actions={() => <div className="flex gap-2"><Action to="#">View Job</Action><Action to="#">Edit Job</Action><Button size="sm" variant="destructive">Delete</Button></div>} /></DashboardLayout>;
}
export function JobDetails() { return <Detail title="Job Details" items={["Job Description", "Requirements", "Applications", "Hiring Status"]} /> }

export function ApplicationManagement() {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.admin.getAllApplications()
            .then(setApps)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <DashboardLayout role="admin"><Header title="Applications" subtitle="Loading applications..." /></DashboardLayout>;

    return <DashboardLayout role="admin"><Header title="Application Management" subtitle="Review candidate applications, approve stages, reject, and export PDFs." /><Table heads={["Candidate Name", "Job Title", "Organization", "Application Status", "Applied Date"]} rows={apps.map((a) => [
        a.candidateName, a.jobTitle, a.organizationName, a.status, new Date(a.appliedDate).toLocaleDateString(), a.id
    ])} actions={(row) => <div className="flex gap-2"><Action to={`/admin/applications/${row[5]}`}>View Application</Action></div>} /></DashboardLayout>;
}

export function ApplicationDetails() {
    const { id } = useParams();
    const [app, setApp] = useState<any>(null);

    useEffect(() => {
        if (id) {
            api.applications.getById(id).then(setApp).catch(console.error);
        }
    }, [id]);

    if (!app) return <DashboardLayout role="admin"><Header title="Application Details" subtitle="Loading..." /></DashboardLayout>;

    return <DashboardLayout role="admin">
        <Header title="Application Details" subtitle={`Application for ${app.candidateName} - ${app.jobTitle}`} />
        <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Candidate Information</h3>
                <p className="text-muted-foreground mb-1"><strong>Name:</strong> {app.candidateName}</p>
                <p className="text-muted-foreground mb-1"><strong>Email:</strong> {app.candidateEmail || 'N/A'}</p>
                <p className="text-muted-foreground mb-1"><strong>Phone:</strong> {app.candidatePhone || 'N/A'}</p>
                <p className="text-muted-foreground mb-1"><strong>AI Match Score:</strong> {app.aiMatchScore}%</p>
            </GlassCard>

            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Job Details</h3>
                <p className="text-muted-foreground mb-1"><strong>Title:</strong> {app.jobTitle}</p>
                <p className="text-muted-foreground mb-1"><strong>Organization:</strong> {app.organizationName}</p>
                <p className="text-muted-foreground mb-1"><strong>Recruiter:</strong> {app.recruiterName || 'N/A'}</p>
                <p className="text-muted-foreground mb-1"><strong>Status:</strong> {app.status}</p>
                <p className="text-muted-foreground mb-1"><strong>Applied Date:</strong> {new Date(app.appliedDate).toLocaleDateString()}</p>
            </GlassCard>
        </div>
        <div className="mt-5">
            <Action to="/admin/applications" variant="outline">Back to Applications</Action>
        </div>
    </DashboardLayout>;
}

export function InterviewManagement() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.admin.getAllInterviews()
            .then(setInterviews)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <DashboardLayout role="admin"><Header title="Interviews" subtitle="Loading interviews..." /></DashboardLayout>;

    return <DashboardLayout role="admin"><Header title="Interview Management" subtitle="Manage interview records, rescheduling, cancellations, meeting rooms, and feedback." />
        <Table heads={["Candidate Name", "Position", "Company", "Interview Date", "Interview Status"]}
            rows={interviews.map(i => [i.candidateName, i.position, i.company, i.date, i.status, i.id])}
            actions={(row) => <div className="flex flex-wrap gap-2"><Action to={`/admin/interviews/${row[5]}`}>View Interview</Action><Action to="/admin/interviews/reschedule">Reschedule</Action><Button size="sm" variant="destructive">Cancel</Button><Action to="/interviews/video-room">Join Meeting</Action></div>} />
    </DashboardLayout>;
}

export function InterviewDetails() {
    const { id } = useParams();
    const [interview, setInterview] = useState<any>(null);

    useEffect(() => {
        if (id) {
            api.interviews.getById(id).then(setInterview).catch(console.error);
        }
    }, [id]);

    if (!interview) return <DashboardLayout role="admin"><Header title="Interview Details" subtitle="Loading..." /></DashboardLayout>;

    return <DashboardLayout role="admin">
        <Header title="Interview Details" subtitle={`Interview for ${interview.candidateName} - ${interview.position}`} />
        <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Interview Information</h3>
                <p className="text-muted-foreground mb-1"><strong>Date:</strong> {interview.date}</p>
                <p className="text-muted-foreground mb-1"><strong>Time:</strong> {interview.time}</p>
                <p className="text-muted-foreground mb-1"><strong>Type:</strong> {interview.type}</p>
                <p className="text-muted-foreground mb-1"><strong>Status:</strong> {interview.status}</p>
                <p className="text-muted-foreground mb-1"><strong>Location:</strong> {interview.location}</p>
                <p className="text-muted-foreground mb-1"><strong>Meeting Link:</strong> {interview.meetingLink || 'N/A'}</p>
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="text-xl font-medium mb-3">Participants</h3>
                <p className="text-muted-foreground mb-1"><strong>Candidate:</strong> {interview.candidateName}</p>
                <p className="text-muted-foreground mb-1"><strong>Recruiter:</strong> {interview.recruiterName || 'N/A'}</p>
                <p className="text-muted-foreground mb-1"><strong>Hiring Manager:</strong> {interview.hiringManagerName || 'N/A'}</p>
                <p className="text-muted-foreground mb-1"><strong>Company:</strong> {interview.company}</p>
            </GlassCard>
        </div>
        <div className="mt-5">
            <Action to="/admin/interviews" variant="outline">Back to Interviews</Action>
        </div>
    </DashboardLayout>;
}

export function AIMonitoring() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.admin.getDashboardStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <DashboardLayout role="admin"><Header title="AI Monitoring" subtitle="Loading..." /></DashboardLayout>;

    return <DashboardLayout role="admin"><Header title="AI Monitoring" subtitle="Monitor resume screenings, rankings, AI usage, errors, recommendations, logs, and insights." />
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
            <AdminCard title="Resume Screening Activity" value={stats.aiResumeScreenings.toLocaleString()} icon={Sparkles} to="/admin/ai-logs" />
            <AdminCard title="Candidate Ranking Activity" value={stats.aiCandidateRankings.toLocaleString()} icon={Sparkles} to="/admin/ai-logs" />
            <AdminCard title="Total AI Actions" value={(stats.aiResumeScreenings + stats.aiCandidateRankings + stats.aiRecommendationsGenerated).toLocaleString()} icon={Sparkles} to="/admin/ai-logs" />
            <AdminCard title="AI Errors" value="0" icon={Sparkles} to="/admin/ai-errors/details" />
            <AdminCard title="AI Recommendations" value={stats.aiRecommendationsGenerated.toLocaleString()} icon={Sparkles} to="/admin/ai-logs" />
        </div>
        <div className="flex flex-wrap gap-3">
            <Action to="/admin/ai-logs" variant="default">View Logs</Action>
            <Button><Download className="mr-2 h-4 w-4" />Export Reports</Button>
            <Action to="/admin/ai-analytics">View AI Insights</Action>
        </div>
    </DashboardLayout>;
}

export function AILogsTable() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.admin.getAiLogs()
            .then(setLogs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <DashboardLayout role="admin"><Header title="AI Usage Logs" subtitle="Loading..." /></DashboardLayout>;
    }

    return (
        <DashboardLayout role="admin">
            <Header title="AI Usage Logs" subtitle="View all AI interactions across the platform" />
            <GlassCard className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gold">
                                <th className="p-3 font-medium">Timestamp</th>
                                <th className="p-3 font-medium">User ID</th>
                                <th className="p-3 font-medium">Feature</th>
                                <th className="p-3 font-medium">Tokens Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 text-sm text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="p-3 text-sm text-gray-300">{log.userId}</td>
                                    <td className="p-3 text-sm text-gray-300">{log.feature}</td>
                                    <td className="p-3 text-sm text-gray-300">{log.tokensUsed}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center text-gray-400">No AI logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </DashboardLayout>
    );
}

export function InfrastructurePage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.admin.getInfrastructureStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <DashboardLayout role="admin"><Header title="Infrastructure Dashboard" subtitle="Loading..." /></DashboardLayout>;

    return (
        <DashboardLayout role="admin">
            <Header title="Infrastructure Dashboard" subtitle="Real-time server and infrastructure health" />
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <AdminCard title="Server Status" value={stats.serverStatus} icon={Server} to="#" />
                <AdminCard title="Uptime" value={stats.uptime} icon={Activity} to="#" />
                <AdminCard title="Memory Usage" value={stats.memoryUsage} icon={Database} to="#" />
                <AdminCard title="CPU Time" value={stats.cpuTime} icon={Monitor} to="#" />
                <AdminCard title="Thread Count" value={stats.threadCount?.toString()} icon={Users} to="#" />
                <AdminCard title="Open Handles" value={stats.openHandles?.toString()} icon={Activity} to="#" />
            </div>
        </DashboardLayout>
    );
}

export function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.admin.getDashboardStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <DashboardLayout role="admin"><Header title="Analytics Dashboard" subtitle="Loading..." /></DashboardLayout>;

    // Build separate chart datasets based on the real stats
    const userGrowthData = [
        { name: "Recruiters", value: stats.totalRecruiters },
        { name: "Hiring Mgrs", value: stats.totalHiringManagers },
        { name: "Job Seekers", value: stats.totalJobSeekers },
    ];

    const hiringStatsData = [
        { name: "Jobs", value: stats.totalJobsPosted },
        { name: "Apps", value: stats.applicationsReceived },
        { name: "Interviews", value: stats.interviewsScheduled },
        { name: "Hires", value: stats.hiresCompleted },
    ];

    return (
        <DashboardLayout role="admin">
            <Header title="Analytics Dashboard" subtitle="User growth, jobs, applications, interviews, and hiring statistics." />
            <Toolbar>
                <Action to="/admin/reports/detail" variant="default">View Detailed Report</Action>
                <Button variant="outline">Export PDF</Button>
                <Button variant="outline">Export Excel</Button>
            </Toolbar>
            <div className="grid xl:grid-cols-2 gap-6">
                <ChartCard title="User Growth" data={userGrowthData} />
                <ChartCard title="Hiring Statistics" data={hiringStatsData} />
            </div>
        </DashboardLayout>
    );
}
function ChartCard({ title, data }: { title: string, data: any[] }) {
    return (
        <GlassCard className="p-6 cursor-pointer" onClick={() => location.assign('/admin/analytics/detail')}>
            <h2 className="text-xl text-foreground font-semibold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(212,175,55,.25)", color: "#fff" }} />
                    <Line dataKey="value" stroke={gold} strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </GlassCard>
    );
}
export function AuditLogs() { return <DashboardLayout role="admin"><Header title="Audit Logs" subtitle="View logs, export logs, filter records, and inspect details." /><Toolbar><Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter Logs</Button><Button><Download className="mr-2 h-4 w-4" />Export Logs</Button></Toolbar><Table heads={["User", "Action", "Module", "Date", "Time"]} rows={[["Elena Rodriguez", "Updated role permission", "Roles", "18/06/2026", "10:40"], ["Sarah Jenkins", "Created job", "Jobs", "18/06/2026", "09:12"]]} actions={() => <Action to="/admin/audit-logs/details">View Log</Action>} /></DashboardLayout> }
export function Notifications() { return <DashboardLayout role="admin"><NotificationsView /></DashboardLayout> }

export function AdminSettings() { return <DashboardLayout role="admin"><Header title="Settings" subtitle="General, security, email, AI, subscription plan, backup, and recovery configuration." /><Tabs defaultValue="general"><TabsList className="bg-card border border-border h-auto flex flex-wrap mb-5"><TabsTrigger value="general">General Settings</TabsTrigger><TabsTrigger value="security">Security Settings</TabsTrigger><TabsTrigger value="email">Email Configuration</TabsTrigger><TabsTrigger value="ai">AI Configuration</TabsTrigger><TabsTrigger value="plans">Subscription Plans</TabsTrigger><TabsTrigger value="backup">Backup & Recovery</TabsTrigger></TabsList>{["general", "security", "email", "ai", "plans", "backup"].map(tab => <TabsContent key={tab} value={tab}><SettingsPanel tab={tab} /></TabsContent>)}</Tabs></DashboardLayout> }
function SettingsPanel({ tab }: { tab: string }) {
    const [loading, setLoading] = useState(false);
    const [configName, setConfigName] = useState("");
    const [configValue, setConfigValue] = useState("");
    const [currentSettings, setCurrentSettings] = useState<any[]>([]);

    const labels: Record<string, string[]> = {
        general: ["Save General Settings"],
        security: ["Save Security Settings"],
        email: ["Save Email Configuration"],
        ai: ["Save AI Settings"],
        plans: ["Save Plans Settings"],
        backup: ["Trigger Backup", "Save Backup Settings"]
    };

    const loadSettings = () => {
        api.admin.getSettings().then(settings => {
            const tabSettings = settings.filter((s: any) => s.key.startsWith(`${tab}_`));
            setCurrentSettings(tabSettings);
        }).catch(console.error);
    };

    useEffect(() => {
        loadSettings();
        setConfigName("");
        setConfigValue("");
    }, [tab]);

    const handleEdit = (key: string, value: string) => {
        setConfigName(key.replace(`${tab}_`, ''));
        setConfigValue(value);
    };

    const handleDelete = async (key: string) => {
        if (!confirm("Are you sure you want to delete this setting?")) return;
        try {
            await api.admin.deleteSetting(key);
            loadSettings();
        } catch (err) {
            console.error(err);
            alert("Failed to delete setting.");
        }
    };

    const handleSave = async () => {
        if (!configName) return alert("Configuration name is required");
        setLoading(true);
        try {
            await api.admin.updateSettings([
                { key: `${tab}_ConfigName`, value: configName },
                { key: `${tab}_ConfigValue`, value: configValue },
                { key: `${tab}_${configName.replace(/\s+/g, '')}`, value: configValue } // Also save the specific key-value pair so it shows in the list
            ]);
            loadSettings(); // Reload to show updates
            alert("Settings saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="p-6">
            <h2 className="text-xl text-foreground font-semibold mb-4">{tab.replace(/^./, c => c.toUpperCase())}</h2>

            {currentSettings.length > 0 && (
                <div className="mb-6 p-4 rounded bg-background/50 border border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Current Configuration Status</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {currentSettings.filter(s => !s.key.endsWith("_ConfigName") && !s.key.endsWith("_ConfigValue")).map(s => (
                            <div key={s.key} className="flex justify-between items-center bg-secondary/50 p-3 rounded group hover:bg-secondary transition-colors">
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                    <span className="text-sm font-medium text-foreground min-w-[150px]">{s.key.replace(`${tab}_`, '')}</span>
                                    <span className="text-sm text-gold font-mono break-all">{s.value}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(s.key, s.value)} className="h-8 px-2 text-muted-foreground hover:text-foreground">
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.key)} className="h-8 px-2 text-destructive hover:bg-destructive/10">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Update Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Configuration name (e.g. SMTP Host)" value={configName} onChange={(e) => setConfigName(e.target.value)} className="bg-secondary border-border text-foreground" />
                <Input placeholder="Configuration value (e.g. smtp.mailgun.org)" value={configValue} onChange={(e) => setConfigValue(e.target.value)} className="bg-secondary border-border text-foreground" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
                {labels[tab].map((x, i) => (
                    <Button key={x} variant={i ? "outline" : "default"} onClick={i === 0 ? handleSave : undefined} disabled={loading}>
                        {loading && i === 0 ? "Saving..." : x}
                    </Button>
                ))}
            </div>
        </GlassCard>
    );
}
export function AdminProfile() { return <DashboardLayout role="admin"><Header title="My Profile" subtitle="Administrator profile, password, photo, and contact information." /><AccountSettingsView /></DashboardLayout> }

export function Detail({ title, items }: { title: string; items: string[] }) { return <DashboardLayout role="admin"><Header title={title} subtitle="Detailed administrator record view with related enterprise workflow data." /><div className="grid md:grid-cols-2 gap-5">{items.map(i => <GlassCard key={i} className="p-6 cursor-pointer hover:border-[#D4AF37]/40"><h2 className="text-xl text-foreground font-semibold">{i}</h2><p className="text-muted-foreground mt-2">Complete {i.toLowerCase()} displayed here with activity and audit metadata.</p></GlassCard>)}</div></DashboardLayout> }
export function FormPage({ title, fields }: { title: string; fields: string[] }) { return <DashboardLayout role="admin"><Header title={title} subtitle="Enterprise form with validation, save actions, and audit logging." /><GlassCard className="p-6"><div className="grid md:grid-cols-2 gap-4">{fields.map(f => <Input key={f} placeholder={f} className="bg-secondary border-border text-foreground" />)}</div><div className="mt-5 flex gap-3"><Button>Save Changes</Button><Button variant="outline">Cancel</Button></div></GlassCard></DashboardLayout> }
