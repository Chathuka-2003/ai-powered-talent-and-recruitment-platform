import { useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Bell, Lock, Shield } from "lucide-react";
import { AccountSettingsView } from "../shared/AccountSettingsView";

export function SeekerSettings() {
  const navigate = useNavigate();
  return <DashboardLayout role="jobseeker"><div className="space-y-6"><div><p className="text-sm text-[#D4AF37]">Dashboard / Settings</p><h1 className="mt-2 text-3xl font-semibold text-foreground">Settings</h1><p className="text-muted-foreground">Account preferences for your Job Seeker workspace. Role switching is not available.</p></div><GlassCard className="p-6"><div className="flex flex-col md:flex-row md:items-center justify-between gap-5"><button onClick={() => navigate("/jobseeker/profile")} className="flex items-center gap-4 text-left"><Avatar className="h-16 w-16 border border-[#D4AF37]/40"><AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37] text-xl">KR</AvatarFallback></Avatar><div><h2 className="text-xl font-semibold text-foreground">My Profile</h2><p className="text-muted-foreground">Job Seeker</p><p className="text-[#D4AF37] text-sm mt-1">Click avatar to open My Profile</p></div></button><div className="rounded-full border border-border bg-secondary/60 p-3"><Bell className="h-6 w-6 text-[#D4AF37]" /></div></div></GlassCard><AccountSettingsView /><div className="grid lg:grid-cols-2 gap-6"><GlassCard className="p-6"><h2 className="text-xl font-semibold text-foreground mb-5 flex gap-2"><Shield className="text-[#D4AF37]" />Notification Preferences</h2><Setting label="Application status alerts" defaultOn /><Setting label="New AI job matches" defaultOn /><Setting label="Recruiter messages" defaultOn /><Setting label="Two-factor authentication" defaultOn /><Setting label="Weekly career digest" /></GlassCard><GlassCard className="p-6"><h2 className="text-xl font-semibold text-foreground mb-4 flex gap-2"><Lock className="text-[#D4AF37]" />Access Control</h2><p className="text-gray-300">This account is locked to the Job Seeker experience. Employer, Recruiter, Hiring Manager, and Administrator role switching controls are hidden and unavailable.</p></GlassCard></div></div></DashboardLayout>;
}
function Setting({ label, defaultOn }: { label: string; defaultOn?: boolean }) { return <div className="flex items-center justify-between border-b border-border py-3 last:border-0"><span className="text-gray-300">{label}</span><Switch defaultChecked={defaultOn} /></div>; }
