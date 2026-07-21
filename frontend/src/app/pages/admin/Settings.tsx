import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
    Settings as SettingsIcon,
    Shield,
    Mail,
    Puzzle,
    CreditCard,
    Save,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    Check,
    AlertTriangle,
    Download,
} from "lucide-react";

type TabId = "general" | "security" | "email" | "integrations" | "billing";

export function AdminSettings() {
    const [activeTab, setActiveTab] = useState<TabId>("general");
    const [savedTab, setSavedTab] = useState<TabId | null>(null);
    const [showSmtpPassword, setShowSmtpPassword] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [mfaEnforced, setMfaEnforced] = useState(true);
    const [ssoEnabled, setSsoEnabled] = useState(false);
    const [ipAllowlistEnabled, setIpAllowlistEnabled] = useState(false);

    const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
        { id: "general", label: "General", icon: SettingsIcon },
        { id: "security", label: "Security", icon: Shield },
        { id: "email", label: "Email", icon: Mail },
        { id: "integrations", label: "Integrations", icon: Puzzle },
        { id: "billing", label: "Billing", icon: CreditCard },
    ];

    const handleSave = (tab: TabId) => {
        setSavedTab(tab);
        setTimeout(() => setSavedTab(null), 2500);
    };

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#D4AF37]" : "bg-secondary border border-border"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
            />
        </button>
    );

    const FormField = ({
        label,
        description,
        children,
    }: {
        label: string;
        description?: string;
        children: React.ReactNode;
    }) => (
        <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-gray-200">{label}</label>
            {description && <p className="text-xs text-muted-foreground mb-1">{description}</p>}
            {children}
        </div>
    );

    const inputCls =
        "w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]/60 transition-colors";

    const SaveButton = ({ tab }: { tab: TabId }) => (
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
            <Button
                onClick={() => handleSave(tab)}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
            >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
            {savedTab === tab && (
                <span className="flex items-center gap-1.5 text-green-400 text-sm">
                    <Check className="h-4 w-4" /> Settings saved successfully
                </span>
            )}
        </div>
    );

    return (
        <DashboardLayout role="admin">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Platform Settings</h1>
                <p className="text-muted-foreground">Configure platform behavior, security, and integrations</p>
            </div>

            {/* Tab Navigation */}
            <GlassCard className="p-1.5 mb-6">
                <div className="flex flex-wrap gap-1">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === id
                                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                                    : "text-muted-foreground hover:text-gray-200 hover:bg-secondary/60"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* General Tab */}
            {activeTab === "general" && (
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">General Settings</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                        <div>
                            <FormField label="Platform Name">
                                <input className={inputCls} defaultValue="TalentAI" />
                            </FormField>
                            <FormField label="Platform URL">
                                <input className={inputCls} defaultValue="https://app.talentai.io" />
                            </FormField>
                            <FormField label="Support Email">
                                <input className={inputCls} defaultValue="support@talentai.io" type="email" />
                            </FormField>
                            <FormField label="Default Timezone">
                                <select className={inputCls}>
                                    <option>America/New_York (UTC-5)</option>
                                    <option>America/Los_Angeles (UTC-8)</option>
                                    <option>Europe/London (UTC+0)</option>
                                    <option>Europe/Berlin (UTC+1)</option>
                                    <option>Asia/Tokyo (UTC+9)</option>
                                </select>
                            </FormField>
                        </div>
                        <div>
                            <FormField label="Default Language">
                                <select className={inputCls}>
                                    <option>English (US)</option>
                                    <option>English (UK)</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Spanish</option>
                                </select>
                            </FormField>
                            <FormField label="Platform Logo" description="Accepted: PNG, SVG. Max 2MB.">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-lg bg-[#D4AF37]/10 border border-border flex items-center justify-center">
                                        <span className="text-[#D4AF37] font-bold text-lg">T</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-border text-gray-300 hover:bg-[#D4AF37]/10">
                                        Upload Logo
                                    </Button>
                                </div>
                            </FormField>
                            <FormField label="Max File Upload Size">
                                <select className={inputCls}>
                                    <option>10 MB</option>
                                    <option>25 MB</option>
                                    <option>50 MB</option>
                                </select>
                            </FormField>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-amber-500/20 mt-2">
                                <div>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                        Maintenance Mode
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Disables access for non-admin users</p>
                                </div>
                                <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} />
                            </div>
                        </div>
                    </div>

                    <SaveButton tab="general" />
                </GlassCard>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                        <div>
                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Password Policy</h3>
                            <FormField label="Minimum Password Length">
                                <input className={inputCls} type="number" defaultValue={12} min={8} max={32} />
                            </FormField>
                            <FormField label="Password Expiry (days)" description="Set to 0 to disable expiry">
                                <input className={inputCls} type="number" defaultValue={90} />
                            </FormField>
                            <FormField label="Password History">
                                <select className={inputCls}>
                                    <option>Last 5 passwords</option>
                                    <option>Last 10 passwords</option>
                                    <option>Last 20 passwords</option>
                                </select>
                            </FormField>
                            <div className="space-y-3 mb-5">
                                {["Require uppercase letters", "Require numbers", "Require special characters", "Prevent common passwords"].map((req) => (
                                    <label key={req} className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="accent-[#D4AF37] w-4 h-4" />
                                        <span className="text-sm text-gray-300">{req}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Access Control</h3>
                            <FormField label="Session Timeout">
                                <select className={inputCls}>
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>4 hours</option>
                                    <option>8 hours</option>
                                    <option>24 hours</option>
                                </select>
                            </FormField>
                            <FormField label="Max Failed Login Attempts">
                                <input className={inputCls} type="number" defaultValue={5} />
                            </FormField>
                            <FormField label="Account Lockout Duration (minutes)">
                                <input className={inputCls} type="number" defaultValue={30} />
                            </FormField>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Enforce MFA for All Users</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Require two-factor authentication</p>
                                    </div>
                                    <Toggle enabled={mfaEnforced} onChange={setMfaEnforced} />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Enable SSO (SAML 2.0)</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Allow enterprise single sign-on</p>
                                    </div>
                                    <Toggle enabled={ssoEnabled} onChange={setSsoEnabled} />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">IP Allowlist</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Restrict admin access by IP</p>
                                    </div>
                                    <Toggle enabled={ipAllowlistEnabled} onChange={setIpAllowlistEnabled} />
                                </div>
                            </div>
                            {ipAllowlistEnabled && (
                                <FormField label="Allowed IP Ranges" description="One CIDR range per line">
                                    <textarea
                                        className={`${inputCls} h-24 resize-none`}
                                        defaultValue={"10.0.0.0/8\n192.168.1.0/24\n203.0.113.0/24"}
                                    />
                                </FormField>
                            )}
                        </div>
                    </div>

                    <SaveButton tab="security" />
                </GlassCard>
            )}

            {/* Email Tab */}
            {activeTab === "email" && (
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Email Configuration</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                        <div>
                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">SMTP Settings</h3>
                            <FormField label="SMTP Host">
                                <input className={inputCls} defaultValue="smtp.sendgrid.net" />
                            </FormField>
                            <FormField label="SMTP Port">
                                <input className={inputCls} type="number" defaultValue={587} />
                            </FormField>
                            <FormField label="SMTP Username">
                                <input className={inputCls} defaultValue="apikey" />
                            </FormField>
                            <FormField label="SMTP Password">
                                <div className="relative">
                                    <input
                                        className={inputCls}
                                        type={showSmtpPassword ? "text" : "password"}
                                        defaultValue="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                    />
                                    <button
                                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-200"
                                    >
                                        {showSmtpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </FormField>
                            <FormField label="Encryption">
                                <select className={inputCls}>
                                    <option>TLS (recommended)</option>
                                    <option>SSL</option>
                                    <option>None</option>
                                </select>
                            </FormField>
                            <FormField label="From Name">
                                <input className={inputCls} defaultValue="TalentAI Platform" />
                            </FormField>
                            <FormField label="From Email">
                                <input className={inputCls} defaultValue="noreply@talentai.io" type="email" />
                            </FormField>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Email Templates</h3>
                            <div className="space-y-3 mb-6">
                                {[
                                    { name: "Welcome Email", status: "Active" },
                                    { name: "Password Reset", status: "Active" },
                                    { name: "Interview Invitation", status: "Active" },
                                    { name: "Offer Letter", status: "Active" },
                                    { name: "Application Received", status: "Active" },
                                    { name: "Application Rejected", status: "Draft" },
                                    { name: "Weekly Digest", status: "Inactive" },
                                ].map((tpl) => (
                                    <div key={tpl.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                                        <span className="text-sm text-gray-200">{tpl.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Badge className={
                                                tpl.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                                    tpl.status === "Draft" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                                        "bg-gray-500/20 text-muted-foreground border-gray-500/30"
                                            }>{tpl.status}</Badge>
                                            <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-[#D4AF37] h-7 px-2 text-xs">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Notification Settings</h3>
                            <div className="space-y-3">
                                {[
                                    "Notify admins on new user registration",
                                    "Send weekly platform digest to admins",
                                    "Alert on failed login attempts (>3)",
                                    "Send billing reminders 7 days before renewal",
                                ].map((setting) => (
                                    <label key={setting} className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="accent-[#D4AF37] w-4 h-4" />
                                        <span className="text-sm text-gray-300">{setting}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <SaveButton tab="email" />
                </GlassCard>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Integrations & API</h2>

                    {/* API Keys */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">API Keys</h3>
                            <Button size="sm" className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
                                <Plus className="mr-2 h-4 w-4" />
                                Generate Key
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: "Production Key", key: "sk_live_Ta9x...Kp2m", created: "Jan 15, 2026", lastUsed: "Jun 17, 2026", status: "Active" },
                                { name: "Webhook Key", key: "sk_wh_Mq7r...Jn4k", created: "Mar 02, 2026", lastUsed: "Jun 16, 2026", status: "Active" },
                                { name: "Sandbox Key", key: "sk_test_Bf3c...Lw8p", created: "May 20, 2026", lastUsed: "Jun 10, 2026", status: "Active" },
                                { name: "Legacy Key", key: "sk_live_Xz1d...Ov5n", created: "Aug 10, 2025", lastUsed: "Feb 14, 2026", status: "Revoked" },
                            ].map((key) => (
                                <div key={key.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-foreground">{key.name}</span>
                                            <Badge className={key.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                                                {key.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-mono text-muted-foreground">{key.key}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Created {key.created} · Last used {key.lastUsed}</p>
                                    </div>
                                    {key.status === "Active" && (
                                        <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Third-Party Integrations */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Third-Party Integrations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: "LinkedIn Recruiter", desc: "Job posting and candidate sourcing", status: "Connected", color: "green" },
                                { name: "Indeed", desc: "Job board posting integration", status: "Connected", color: "green" },
                                { name: "Greenhouse ATS", desc: "Applicant tracking system sync", status: "Not Connected", color: "gray" },
                                { name: "Workday HCM", desc: "HR management system", status: "Not Connected", color: "gray" },
                                { name: "Slack", desc: "Notifications and team alerts", status: "Connected", color: "green" },
                                { name: "Zoom", desc: "Video interview integration", status: "Connected", color: "green" },
                                { name: "DocuSign", desc: "Digital offer letter signing", status: "Not Connected", color: "gray" },
                                { name: "BambooHR", desc: "HR data synchronization", status: "Not Connected", color: "gray" },
                            ].map((integration) => (
                                <div key={integration.name} className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-foreground">{integration.name}</span>
                                            <Badge className={integration.color === "green" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-muted-foreground border-gray-500/30"}>
                                                {integration.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{integration.desc}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-border text-gray-300 hover:bg-[#D4AF37]/10 ml-3 flex-shrink-0">
                                        {integration.status === "Connected" ? "Manage" : "Connect"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Webhooks */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">Webhooks</h3>
                            <Button size="sm" variant="outline" className="border-border text-[#D4AF37] hover:bg-[#D4AF37]/10">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Endpoint
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { url: "https://hooks.stripe.com/talentai/events", events: "user.created, hire.completed", active: true },
                                { url: "https://api.internal.palantir.com/webhooks/ta", events: "application.submitted, offer.accepted", active: true },
                                { url: "https://legacy.acme.io/webhook", events: "All events", active: false },
                            ].map((wh, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                                    <div>
                                        <p className="text-sm font-mono text-gray-200">{wh.url}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Events: {wh.events}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                        <Badge className={wh.active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-muted-foreground border-gray-500/30"}>
                                            {wh.active ? "Active" : "Inactive"}
                                        </Badge>
                                        <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SaveButton tab="integrations" />
                </GlassCard>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
                <GlassCard className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Billing & Subscription</h2>

                    {/* Current Plan */}
                    <div className="p-5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 mb-8">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-[#D4AF37]">Enterprise Plan</h3>
                                    <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">Current</Badge>
                                </div>
                                <p className="text-gray-300 text-sm">Unlimited users · Priority support · Advanced AI features</p>
                                <p className="text-muted-foreground text-sm mt-1">Next renewal: <span className="text-foreground font-medium">July 1, 2026</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-foreground">$4,999</p>
                                <p className="text-muted-foreground text-sm">per month</p>
                                <Button variant="outline" size="sm" className="mt-2 border-border text-[#D4AF37] hover:bg-[#D4AF37]/10">
                                    Manage Plan
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Current Usage</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "Active Users", used: 12847, limit: "Unlimited", pct: null },
                                { label: "Job Postings", used: 3421, limit: 5000, pct: 68 },
                                { label: "AI Parse Credits", used: 24390, limit: 30000, pct: 81 },
                            ].map((stat) => (
                                <div key={stat.label} className="p-4 rounded-lg bg-secondary/50 border border-border">
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-foreground mb-1">{stat.used.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mb-2">of {stat.limit === "Unlimited" ? "Unlimited" : stat.limit.toLocaleString()}</p>
                                    {stat.pct !== null && (
                                        <div className="w-full bg-secondary rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${stat.pct > 80 ? "bg-amber-500" : "bg-[#D4AF37]"}`}
                                                style={{ width: `${stat.pct}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Billing Information</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                            <div>
                                <FormField label="Company Name">
                                    <input className={inputCls} defaultValue="TalentAI Inc." />
                                </FormField>
                                <FormField label="Billing Email">
                                    <input className={inputCls} defaultValue="billing@talentai.io" type="email" />
                                </FormField>
                                <FormField label="Tax ID / EIN">
                                    <input className={inputCls} defaultValue="84-1234567" />
                                </FormField>
                            </div>
                            <div>
                                <FormField label="Payment Method">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 border border-border">
                                        <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                                        <div>
                                            <p className="text-sm text-foreground">Visa ending in 4242</p>
                                            <p className="text-xs text-muted-foreground">Expires 08/2028</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="ml-auto border-border text-gray-300 hover:bg-[#D4AF37]/10">
                                            Update
                                        </Button>
                                    </div>
                                </FormField>
                                <FormField label="Billing Address">
                                    <textarea className={`${inputCls} h-24 resize-none`} defaultValue={"101 Innovation Drive\nSan Francisco, CA 94105\nUnited States"} />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Invoice History */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Invoice History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        {["Invoice", "Date", "Amount", "Status", ""].map((h) => (
                                            <th key={h} className="text-left text-muted-foreground font-medium pb-3 pr-4">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: "INV-2026-06", date: "Jun 1, 2026", amount: "$4,999.00", status: "Paid" },
                                        { id: "INV-2026-05", date: "May 1, 2026", amount: "$4,999.00", status: "Paid" },
                                        { id: "INV-2026-04", date: "Apr 1, 2026", amount: "$4,999.00", status: "Paid" },
                                        { id: "INV-2026-03", date: "Mar 1, 2026", amount: "$4,999.00", status: "Paid" },
                                    ].map((inv) => (
                                        <tr key={inv.id} className="border-b border-border hover:bg-[#D4AF37]/5 transition-colors">
                                            <td className="py-3 pr-4 text-gray-200 font-medium">{inv.id}</td>
                                            <td className="py-3 pr-4 text-muted-foreground">{inv.date}</td>
                                            <td className="py-3 pr-4 text-foreground font-medium">{inv.amount}</td>
                                            <td className="py-3 pr-4">
                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{inv.status}</Badge>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-[#D4AF37] h-7 px-2 text-xs">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    PDF
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <SaveButton tab="billing" />
                </GlassCard>
            )}
        </DashboardLayout>
    );
}
