import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useSearchParams } from "react-router";
import {
  Calendar,
  CalendarDays,
  GitBranch,
  Video,
  Clock,
  Users,
  Plus,
  MapPin,
  Check,
  X,
  Settings2,
} from "lucide-react";
import { api } from "../../api";
import { getCurrentRole } from "../../auth";

const interviewTabs = [
  { label: "Schedule", path: "/interviews/schedule", icon: Calendar },
  { label: "Calendar", path: "/interviews/calendar", icon: CalendarDays },
  { label: "Timeline", path: "/interviews/timeline", icon: GitBranch },
  { label: "Video Room", path: "/interviews/video-room", icon: Video },
  { label: "Integrations", path: "/interviews/calendar-integration", icon: Settings2 },
];

const typeColors: Record<string, string> = {
  Phone: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Technical: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  HR: "bg-green-500/20 text-green-300 border-green-500/30",
  Panel: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Final: "bg-[#D4AF37]/20 text-[#D4AF37] border-border",
};

const statusColors: Record<string, string> = {
  Upcoming: "bg-green-500/20 text-green-300 border-green-500/30",
  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
};

export function InterviewScheduleModule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialAppId = searchParams.get("applicationId") || "";

  const [showForm, setShowForm] = useState(!!initialAppId);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    applicationId: initialAppId,
    type: "Technical",
    date: "",
    time: "",
    duration: "60",
    location: "",
    meetingLink: "",
    interviewers: "",
    notes: "",
    sendInvite: true,
  });

  const userId = (() => {
    try {
      const u = localStorage.getItem("talentai.user");
      return u ? JSON.parse(u).id : null;
    } catch { return null; }
  })();

  const loadData = async () => {
    if (!userId) return;
    try {
      const [apps, ints] = await Promise.all([
        api.applications.getForRecruiter(userId),
        api.interviews.getByRecruiter(userId)
      ]);
      setApplications(apps);
      setInterviews(ints);
    } catch (e) {
      console.error("Failed to load schedule data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleSchedule = async () => {
    if (!formData.applicationId || !formData.date || !formData.time) {
      alert("Please fill in application, date, and time.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.interviews.create({
        applicationId: formData.applicationId,
        recruiterId: userId,
        interviewDate: formData.date,
        interviewTime: formData.time + ":00",
        location: formData.location || "Virtual",
        meetingLink: formData.meetingLink,
        status: "Confirmed",
        type: formData.type
      });
      alert(res.message + (res.syncResults ? " (Synced to calendar!)" : ""));
      setShowForm(false);
      loadData();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate dynamic stats
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const scheduledToday = interviews.filter(i => i.date === today).length;
  const pending = interviews.filter(i => i.status === "Pending").length;
  const completed = interviews.filter(i => i.status === "Completed").length;

  const stats = [
    { label: "Scheduled Today", value: scheduledToday.toString(), color: "text-[#D4AF37]" },
    { label: "Total Upcoming", value: interviews.length.toString(), color: "text-blue-400" },
    { label: "Pending Confirmation", value: pending.toString(), color: "text-yellow-400" },
    { label: "Completed", value: completed.toString(), color: "text-green-400" },
  ];

  return (
    <ModuleLayout
      title="Interview Scheduling"
      subtitle="Schedule and manage all interview appointments"
      icon={Calendar}
      tabs={interviewTabs}
      backPath={`/${getCurrentRole() || "jobseeker"}/dashboard`}
      backLabel="Back to Portal"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-foreground font-semibold text-lg">Upcoming Interviews</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 gap-2"
        >
          <Plus className="h-4 w-4" />
          Schedule New Interview
        </Button>
      </div>

      {showForm && (
        <GlassCard className="p-6 mb-6 border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-foreground font-semibold text-base">New Interview</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-muted-foreground text-xs mb-1 block">Select Application</label>
              <select
                value={formData.applicationId}
                onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="">-- Select Candidate --</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.candidateName} - {app.jobTitle}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Interview Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                {["Phone", "Technical", "HR", "Panel", "Final"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Duration (min)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-[#D4AF37]/50"
              >
                {["30", "45", "60", "90"].map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Location</label>
              <input
                type="text"
                placeholder="e.g. Office / Virtual"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Meeting Link</label>
              <input
                type="url"
                placeholder="https://zoom.us/j/..."
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-muted-foreground text-xs mb-1 block">Interviewers</label>
              <input
                type="text"
                placeholder="e.g. Sarah Chen, David Park"
                value={formData.interviewers}
                onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                onClick={() => setFormData({ ...formData, sendInvite: !formData.sendInvite })}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  formData.sendInvite
                    ? "bg-[#D4AF37] border-[#D4AF37]"
                    : "bg-transparent border-border"
                }`}
              >
                {formData.sendInvite && <Check className="h-3 w-3 text-black" />}
              </button>
              <span className="text-gray-300 text-sm">Send Calendar Invite to participants (Auto-sync)</span>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button 
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80"
              onClick={handleSchedule}
              disabled={submitting}
            >
              {submitting ? "Scheduling..." : "Schedule Interview"}
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Interview List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-muted-foreground py-8 text-center">Loading interviews...</p>
        ) : interviews.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            No upcoming interviews found.
          </GlassCard>
        ) : (
          interviews.map((interview) => (
            <GlassCard key={interview.id} className="p-4 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D4AF37] font-semibold text-lg">
                      {interview.candidateName?.[0] || 'C'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold flex items-center gap-2">
                      {interview.candidateName}
                      <Badge variant="outline" className={`ml-2 font-normal text-[10px] uppercase tracking-wider ${typeColors[interview.type] || typeColors["Phone"]}`}>
                        {interview.type}
                      </Badge>
                    </h3>
                    <div className="text-muted-foreground text-sm mt-1">{interview.position}</div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {interview.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {interview.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {interview.meetingLink ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                        {interview.meetingLink ? "Video Call" : (interview.location || "On-site")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3">
                  <Badge variant="outline" className={`font-normal ${statusColors[interview.status] || statusColors["Confirmed"]}`}>
                    {interview.status}
                  </Badge>
                  {interview.meetingLink && (
                    <Button 
                      size="sm" 
                      className="bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                      onClick={() => window.open(interview.meetingLink, "_blank")}
                    >
                      <Video className="w-3.5 h-3.5 mr-2" />
                      Join Call
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </ModuleLayout>
  );
}
