import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Search, Plus, Filter, Mail, Video, Calendar, Star, FileText, CheckCircle2, ChevronRight, Download, Send } from "lucide-react";
import type { UserRole } from "../auth";

type Props = {
  role: UserRole;
  title: string;
  subtitle: string;
  primaryAction?: { label: string; to: string };
  secondaryAction?: { label: string; to: string };
};

export function DynamicRolePage({ role, title, subtitle, primaryAction, secondaryAction }: Props) {
  const navigate = useNavigate();

  const renderContent = () => {
    const t = title.toLowerCase();

    // 1. Applications or Candidate Reviews (Table / List)
    if (t.includes("application") || t.includes("review") || t.includes("pool")) {
      return (
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Latest Entries</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold">
                    {["JD", "AS", "MW", "KL"][i - 1]}
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium">{["John Doe", "Alice Smith", "Mike Ross", "Kevin Lin"][i - 1]}</h4>
                    <p className="text-sm text-muted-foreground">{["Frontend Eng", "Product Mgr", "Data Sci", "Backend Dev"][i - 1]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-[#D4AF37] border-border">
                    {["In Review", "Interviewing", "Shortlisted", "Applied"][i - 1]}
                  </Badge>
                  <Button size="sm" variant="ghost">View <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      );
    }

    // 2. Job Search / Postings (Cards)
    if (t.includes("job") || t.includes("recommendation")) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{["Senior React Dev", "UX/UI Designer", "Engineering Mgr"][i - 1]}</h3>
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">{[98, 92, 85][i - 1]}% Match</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Tech Innovations Inc. • Remote</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Leadership</Badge>
                </div>
              </div>
              <Button className="w-full mt-4">View Details</Button>
            </GlassCard>
          ))}
        </div>
      );
    }

    // 3. Settings / Profile (Form)
    if (t.includes("setting") || t.includes("profile")) {
      return (
        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="col-span-2 p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">General Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name / Company Name</Label>
                <Input defaultValue={role === "jobseeker" ? "Avery Chen" : "Acme Corp"} className="bg-card border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email Address</Label>
                <Input defaultValue={`${role}@talentai.com`} className="bg-card border-border text-foreground" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-gray-300">Bio / Description</Label>
                <textarea className="w-full h-32 p-3 bg-card border border-border rounded-md text-foreground" defaultValue="Experienced professional looking for great opportunities." />
              </div>
            </div>
            <Button>Save Changes</Button>
          </GlassCard>
          <GlassCard className="p-6 space-y-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 text-sm text-gray-300">
                <input type="checkbox" defaultChecked className="rounded border-border" />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3 text-sm text-gray-300">
                <input type="checkbox" defaultChecked className="rounded border-border" />
                <span>SMS Alerts</span>
              </label>
              <label className="flex items-center space-x-3 text-sm text-gray-300">
                <input type="checkbox" className="rounded border-border" />
                <span>Weekly AI Digest</span>
              </label>
            </div>
          </GlassCard>
        </div>
      );
    }

    // 4. Messages / Inbox
    if (t.includes("message") || t.includes("inbox")) {
      return (
        <div className="flex h-[600px] gap-6">
          <GlassCard className="w-1/3 flex flex-col p-4">
            <Input placeholder="Search messages..." className="mb-4 bg-card border-border" />
            <div className="flex-1 overflow-y-auto space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`p-3 rounded-lg cursor-pointer ${i === 1 ? "bg-[#D4AF37]/10 border border-border" : "hover:bg-card"}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground font-medium">{["Tech Recruiter", "Hiring Manager", "System Alert"][i - 1]}</span>
                    <span className="text-xs text-muted-foreground">10:4{i} AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">Let's schedule a time to chat about the role...</p>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="w-2/3 flex flex-col p-6">
            <div className="border-b border-border pb-4 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Tech Recruiter</h3>
                <p className="text-sm text-[#D4AF37]">Acme Corp</p>
              </div>
              <Button variant="ghost" size="sm"><Video className="h-4 w-4 mr-2" /> Call</Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <div className="bg-card p-3 rounded-lg max-w-[80%]">
                <p className="text-sm text-gray-300">Hi there! We reviewed your profile and would love to move forward.</p>
              </div>
              <div className="bg-[#D4AF37]/20 p-3 rounded-lg max-w-[80%] ml-auto">
                <p className="text-sm text-foreground">That sounds great! I'm available tomorrow afternoon.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type a message..." className="bg-card border-border" />
              <Button><Send className="h-4 w-4" /></Button>
            </div>
          </GlassCard>
        </div>
      );
    }

    // 5. Default generic but distinct
    return (
      <div className="grid xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-foreground">System Data</h2>
            <Button size="sm" variant="ghost">View log</Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between p-4 rounded-lg bg-secondary/45 border border-border">
                <div className="flex gap-4">
                  <div className="p-2 bg-[#D4AF37]/10 rounded-full h-fit"><FileText className="text-[#D4AF37] h-5 w-5" /></div>
                  <div>
                    <h4 className="text-foreground font-medium">Record Entry #{i}00{i}</h4>
                    <p className="text-sm text-muted-foreground">Processed automatically by AI module.</p>
                  </div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 h-fit">
          <h2 className="text-xl font-semibold text-foreground mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              ["Export Report", Download],
              ["Schedule Event", Calendar],
              ["Request Review", Star],
            ].map(([label, Icon]) => {
              const C = Icon as typeof Search;
              return <Button key={label as string} variant="outline" className="w-full justify-start"><C className="mr-2 h-4 w-4" />{label as string}</Button>;
            })}
          </div>
        </GlassCard>
      </div>
    );
  };

  return (
    <DashboardLayout role={role}>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => navigate(`/${role}/dashboard`)}>Dashboard</span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-[#D4AF37]">{title}</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {role !== "recruiter" && secondaryAction && !secondaryAction.label.toLowerCase().includes("open related") && <Button variant="outline" onClick={() => navigate(secondaryAction.to)}>{secondaryAction.label}</Button>}
          {role !== "recruiter" && primaryAction && <Button onClick={() => navigate(primaryAction.to)}><Plus className="mr-2 h-4 w-4" />{primaryAction.label}</Button>}
        </div>
      </div>

      {renderContent()}
    </DashboardLayout>
  );
}
