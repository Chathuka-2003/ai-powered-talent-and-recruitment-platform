import { useState, useEffect } from "react";
import { api } from "../../api";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import {
  Building,
  Bell,
  Sliders,
  Link,
  Save,
  ChevronRight,
  Calendar,
  Mail,
  Zap,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";

type SettingsTab = "Company" | "Team" | "Posting" | "Notifications" | "AI Ranking" | "Integrations";

const tabs: { label: SettingsTab; icon: React.ReactNode }[] = [
  { label: "Company", icon: <Building className="w-4 h-4" /> },
  { label: "Team", icon: <Users className="w-4 h-4" /> },
  { label: "Posting", icon: <Sliders className="w-4 h-4" /> },
  { label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { label: "AI Ranking", icon: <Zap className="w-4 h-4" /> },
  { label: "Integrations", icon: <Link className="w-4 h-4" /> },
];

export function RecruiterSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Company");
  const [orgId, setOrgId] = useState<string | null>(null);

  // Company
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [headquarters, setHeadquarters] = useState("");

  // Team
  const [hiringManagers, setHiringManagers] = useState<any[]>([]);
  const [isAddHmModalOpen, setIsAddHmModalOpen] = useState(false);
  const [newHm, setNewHm] = useState({ firstName: "", lastName: "", email: "", designation: "", department: "", phoneNumber: "", password: "" });

  // Custom weights
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    location: 10,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
        if (!user.id) return;
        const orgData = await api.organizations.getByUserId(user.id);
        if (orgData) {
          setOrgId(orgData.id);
          setCompanyName(orgData.name || "");
          setCompanyDescription(orgData.description || "");
          setCompanyWebsite(orgData.website || "");
          setHeadquarters(orgData.address || "");
          setHiringManagers(orgData.hiringManagers || []);
        }
      } catch (err) {
        console.error("Error loading organization data", err);
      }
    };
    loadData();
  }, []);

  const handleSaveCompany = async () => {
    if (!orgId) return;
    try {
      await api.organizations.update(orgId, {
        name: companyName,
        description: companyDescription,
        website: companyWebsite,
        address: headquarters,
      });
      alert("Company profile updated!");
    } catch (err) {
      console.error("Failed to update company profile", err);
      alert("Failed to save.");
    }
  };

  const handleAddHiringManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    try {
      await api.organizations.addHiringManager(orgId, newHm);
      setIsAddHmModalOpen(false);
      setNewHm({ firstName: "", lastName: "", email: "", designation: "", department: "", phoneNumber: "", password: "" });
      // Reload team
      const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
      const orgData = await api.organizations.getByUserId(user.id);
      if (orgData) setHiringManagers(orgData.hiringManagers || []);
      alert("Hiring manager added successfully!");
    } catch (err) {
      console.error("Failed to add hiring manager", err);
      alert("Failed to add hiring manager.");
    }
  };

  const handleRemoveHiringManager = async (managerId: string) => {
    if (!orgId || !confirm("Are you sure you want to remove this hiring manager?")) return;
    try {
      await api.organizations.removeHiringManager(orgId, managerId);
      setHiringManagers(prev => prev.filter(m => m.id !== managerId));
    } catch (err) {
      console.error("Failed to remove manager", err);
    }
  };

  // Posting
  const [defaultVisibility, setDefaultVisibility] = useState<"Public" | "Private" | "Invite-Only">("Public");
  const [autoRenew, setAutoRenew] = useState(true);
  const [postingDuration, setPostingDuration] = useState("30");
  const [requireCoverLetter, setRequireCoverLetter] = useState(false);
  const [allowAnonymous, setAllowAnonymous] = useState(false);

  // Notifications
  const [notifToggles, setNotifToggles] = useState({
    newApplicationEmail: true,
    highMatchAlert: true,
    interviewReminders: true,
    weeklyReport: true,
    applicationDeadline: true,
    candidateWithdrawal: false,
  });
  const [digestFrequency, setDigestFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");

  // AI Ranking
  const [autoRankingEnabled, setAutoRankingEnabled] = useState(true);
  const [rankingThreshold, setRankingThreshold] = useState([75]);
  const [skillsWeight, setSkillsWeight] = useState([40]);
  const [experienceWeight, setExperienceWeight] = useState([35]);
  const [educationWeight, setEducationWeight] = useState([15]);
  const [cultureWeight, setCultureWeight] = useState([10]);
  const [autoReject, setAutoReject] = useState(false);
  const [autoShortlist, setAutoShortlist] = useState(true);

  // Integrations
  const [atsConnected, setAtsConnected] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);
  const [emailConnected, setEmailConnected] = useState(true);
  const [slackConnected, setSlackConnected] = useState(false);

  const toggleNotif = (key: keyof typeof notifToggles) =>
    setNotifToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const SwitchRow = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-foreground text-sm font-medium">{label}</p>
        {description && <p className="text-muted-foreground text-xs mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  const IntegrationCard = ({
    icon,
    name,
    description,
    connected,
    onToggle,
  }: {
    icon: React.ReactNode;
    name: string;
    description: string;
    connected: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-[#D4AF37]">
          {icon}
        </div>
        <div>
          <p className="text-foreground text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium ${connected ? "text-green-400" : "text-muted-foreground"}`}>
          {connected ? "Connected" : "Not Connected"}
        </span>
        <Button
          variant="outline"
          onClick={onToggle}
          className={`text-sm ${
            connected
              ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
              : "border-border text-[#D4AF37] hover:bg-[#D4AF37]/10"
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout role="recruiter">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your recruiter preferences and integrations</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.label
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.label && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Company Profile */}
            {activeTab === "Company" && (
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#D4AF37]" />
                  Company Profile
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-muted-foreground text-xs mb-1 block">Company Name</label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-secondary border-border text-foreground" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-muted-foreground text-xs mb-1 block">Description</label>
                    <Input value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-secondary border-border text-foreground" />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs mb-1 block">Website</label>
                    <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-secondary border-border text-foreground" />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs mb-1 block">Headquarters (Address)</label>
                    <Input value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} className="bg-secondary border-border text-foreground" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button onClick={handleSaveCompany} className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* Team Management */}
            {activeTab === "Team" && (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    Hiring Managers
                  </h2>
                  <Button onClick={() => setIsAddHmModalOpen(true)} className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Hiring Manager
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {hiringManagers.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hiring managers registered yet.</p>
                  ) : (
                    hiringManagers.map((hm) => (
                      <div key={hm.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/50">
                        <div>
                          <div className="font-medium text-foreground">{hm.firstName} {hm.lastName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                            <span>{hm.email}</span>
                            {hm.designation && <span>• {hm.designation}</span>}
                            {hm.department && <span>• {hm.department}</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveHiringManager(hm.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            )}

            {/* Posting Preferences */}
            {activeTab === "Posting" && (
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#D4AF37]" />
                  Job Posting Preferences
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-xs mb-2 block">Default Posting Visibility</label>
                    <div className="flex gap-3">
                      {(["Public", "Private", "Invite-Only"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setDefaultVisibility(v)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            defaultVisibility === v
                              ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                              : "border-border text-muted-foreground hover:border-border"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs mb-1 block">Default Posting Duration (days)</label>
                    <Input value={postingDuration} onChange={(e) => setPostingDuration(e.target.value)} className="bg-secondary border-border text-foreground w-32" />
                  </div>
                  <div className="pt-2 border-t border-border">
                    <SwitchRow label="Auto-Renew Postings" description="Automatically renew postings before they expire" checked={autoRenew} onChange={() => setAutoRenew(!autoRenew)} />
                    <SwitchRow label="Require Cover Letter" description="Make cover letter mandatory for all applications" checked={requireCoverLetter} onChange={() => setRequireCoverLetter(!requireCoverLetter)} />
                    <SwitchRow label="Allow Anonymous Applications" description="Let candidates apply without revealing their identity" checked={allowAnonymous} onChange={() => setAllowAnonymous(!allowAnonymous)} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* Notification Settings */}
            {activeTab === "Notifications" && (
              <>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#D4AF37]" />
                    Email Digest Frequency
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">How often you receive summary emails</p>
                  <div className="flex gap-3">
                    {(["Daily", "Weekly", "Monthly"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setDigestFrequency(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          digestFrequency === f
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                            : "border-border text-muted-foreground hover:border-border"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                    Notification Triggers
                  </h2>
                  <SwitchRow label="New Application Received" description="Email when a candidate applies to your posting" checked={notifToggles.newApplicationEmail} onChange={() => toggleNotif("newApplicationEmail")} />
                  <SwitchRow label="High-Match Candidate Alert" description="Instant alert for candidates scoring 90%+" checked={notifToggles.highMatchAlert} onChange={() => toggleNotif("highMatchAlert")} />
                  <SwitchRow label="Interview Reminders" description="Reminders 24h before scheduled interviews" checked={notifToggles.interviewReminders} onChange={() => toggleNotif("interviewReminders")} />
                  <SwitchRow label="Weekly Hiring Report" description="Summary of all hiring activity each week" checked={notifToggles.weeklyReport} onChange={() => toggleNotif("weeklyReport")} />
                  <SwitchRow label="Posting Expiration Alerts" description="Notify me 3 days before a posting expires" checked={notifToggles.applicationDeadline} onChange={() => toggleNotif("applicationDeadline")} />
                  <SwitchRow label="Candidate Withdrawal Alerts" description="Notify when a candidate withdraws their application" checked={notifToggles.candidateWithdrawal} onChange={() => toggleNotif("candidateWithdrawal")} />
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Notifications
                    </Button>
                  </div>
                </GlassCard>
              </>
            )}

            {/* AI Ranking */}
            {activeTab === "AI Ranking" && (
              <>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#D4AF37]" />
                    AI Ranking Configuration
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">Configure how the AI evaluates and ranks candidates</p>
                  <SwitchRow label="Enable Auto-Ranking" description="Automatically rank all incoming applications using AI" checked={autoRankingEnabled} onChange={() => setAutoRankingEnabled(!autoRankingEnabled)} />
                  <SwitchRow label="Auto-Shortlist High Scorers" description="Automatically move candidates scoring above threshold to shortlist" checked={autoShortlist} onChange={() => setAutoShortlist(!autoShortlist)} />
                  <SwitchRow label="Auto-Reject Below Threshold" description="Automatically reject candidates below minimum score (use with care)" checked={autoReject} onChange={() => setAutoReject(!autoReject)} />
                </GlassCard>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Ranking Threshold & Weights</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300 text-sm">Minimum Ranking Threshold</label>
                        <span className="text-[#D4AF37] font-semibold text-sm">{rankingThreshold[0]}%</span>
                      </div>
                      <Slider value={rankingThreshold} onValueChange={setRankingThreshold} min={50} max={95} step={5} className="w-full" />
                      <p className="text-muted-foreground text-xs mt-1">Candidates below this score are flagged for manual review</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-gray-300 text-sm font-medium mb-4">Scoring Weights (must total 100%)</p>
                      {[
                        { label: "Technical Skills", value: skillsWeight, set: setSkillsWeight },
                        { label: "Work Experience", value: experienceWeight, set: setExperienceWeight },
                        { label: "Education", value: educationWeight, set: setEducationWeight },
                        { label: "Culture Fit", value: cultureWeight, set: setCultureWeight },
                      ].map(({ label, value, set }) => (
                        <div key={label} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <label className="text-muted-foreground text-sm">{label}</label>
                            <span className="text-[#D4AF37] font-semibold text-sm">{value[0]}%</span>
                          </div>
                          <Slider value={value} onValueChange={set} min={0} max={60} step={5} className="w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Button className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save AI Settings
                    </Button>
                  </div>
                </GlassCard>
              </>
            )}

            {/* Integrations */}
            {activeTab === "Integrations" && (
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Link className="w-5 h-5 text-[#D4AF37]" />
                  Integration Settings
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Connect your existing tools and systems</p>
                <IntegrationCard
                  icon={<Sliders className="w-5 h-5" />}
                  name="Greenhouse ATS"
                  description="Sync candidates and pipeline stages with your ATS"
                  connected={atsConnected}
                  onToggle={() => setAtsConnected(!atsConnected)}
                />
                <IntegrationCard
                  icon={<Calendar className="w-5 h-5" />}
                  name="Google Calendar"
                  description="Sync interview schedules with your Google Calendar"
                  connected={calendarConnected}
                  onToggle={() => setCalendarConnected(!calendarConnected)}
                />
                <IntegrationCard
                  icon={<Mail className="w-5 h-5" />}
                  name="Gmail / Outlook"
                  description="Send and receive candidate communications via email"
                  connected={emailConnected}
                  onToggle={() => setEmailConnected(!emailConnected)}
                />
                <IntegrationCard
                  icon={<Zap className="w-5 h-5" />}
                  name="Slack"
                  description="Receive hiring alerts and notifications in Slack channels"
                  connected={slackConnected}
                  onToggle={() => setSlackConnected(!slackConnected)}
                />
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isAddHmModalOpen} onOpenChange={setIsAddHmModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Register Hiring Manager</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddHiringManager} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input required value={newHm.firstName} onChange={e => setNewHm({...newHm, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input required value={newHm.lastName} onChange={e => setNewHm({...newHm, lastName: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email (Login ID)</label>
              <Input type="email" required value={newHm.email} onChange={e => setNewHm({...newHm, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Temporary Password</label>
              <Input type="password" required value={newHm.password} onChange={e => setNewHm({...newHm, password: e.target.value})} placeholder="Set a temporary password" />
              <p className="text-xs text-muted-foreground">They can change this password after logging in.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Designation / Title</label>
              <Input value={newHm.designation} onChange={e => setNewHm({...newHm, designation: e.target.value})} placeholder="e.g. Engineering Manager" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input value={newHm.department} onChange={e => setNewHm({...newHm, department: e.target.value})} placeholder="e.g. Engineering" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={newHm.phoneNumber} onChange={e => setNewHm({...newHm, phoneNumber: e.target.value})} />
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddHmModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black">Add Manager</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
