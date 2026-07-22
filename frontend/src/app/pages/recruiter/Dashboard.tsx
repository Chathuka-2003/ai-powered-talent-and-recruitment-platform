import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Star,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import { useState, useEffect } from "react";
import { api } from "../../api";

export function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
        let orgId = undefined;
        if (user.id) {
          const profile = await api.recruiters.getProfile(user.id).catch(() => null);
          orgId = profile?.organizationId;
        }
        const [jobsData, candidatesData, applicationsData, interviewsData] = await Promise.all([
          api.jobs.getAll({ organizationId: orgId }),
          api.candidates.getAll(),
          user.id ? api.applications.getForRecruiter(user.id).catch(() => []) : Promise.resolve([]),
          user.id ? api.interviews.getByRecruiter(user.id).catch(() => []) : Promise.resolve([])
        ]);
        setJobs(jobsData || []);
        setCandidates(candidatesData || []);
        setApplications(applicationsData || []);
        setInterviews(interviewsData || []);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeJobsList = jobs.filter(j => j.status === 1 || j.status === "Active" || !j.status);
  const topCandidatesList = candidates.slice(0, 3);

  // Status check supporting both numeric enum codes and string status names
  const isScreened = (s: any) => {
    const str = String(s || "").toLowerCase().trim();
    return s === 1 || s === 2 || s === 3 || s === 4 ||
      ["underreview", "under review", "reviewed", "shortlisted", "interview scheduled", "interviewscheduled", "interviewed", "offer received", "offered"].includes(str);
  };

  const isInterviewed = (s: any) => {
    const str = String(s || "").toLowerCase().trim();
    return s === 3 || s === 4 ||
      ["interview scheduled", "interviewscheduled", "interviewed", "offer received", "offered", "confirmed", "completed", "pending"].includes(str);
  };

  const isOffered = (s: any) => {
    const str = String(s || "").toLowerCase().trim();
    return s === 4 || ["offer received", "offered", "offer", "accepted"].includes(str);
  };

  const appliedCount = applications.length;
  const screenedCount = Math.max(applications.filter(a => isScreened(a.status)).length, interviews.length);
  const interviewedCount = Math.max(applications.filter(a => isInterviewed(a.status)).length, interviews.length);
  const offeredCount = applications.filter(a => isOffered(a.status)).length;

  const hiringFunnelData = [
    { name: "Applied", value: appliedCount },
    { name: "Screened", value: screenedCount },
    { name: "Interviewed", value: interviewedCount },
    { name: "Offered", value: offeredCount },
  ];

  // JobStatus: 0=Draft, 1=Active, 2=Closed, 3=Paused
  const activeCount = jobs.filter(j => j.status === 1).length;
  const closedCount = jobs.filter(j => j.status === 2).length;
  const pausedCount = jobs.filter(j => j.status === 3).length;

  const jobDistributionData = [
    { name: "Active", value: activeCount, color: "#D4AF37" },
    { name: "Closed", value: closedCount, color: "#22c55e" },
    { name: "Paused", value: pausedCount, color: "#eab308" },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Recruitment Overview</h1>
        <p className="text-muted-foreground">Track your hiring progress and candidate pipeline</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Jobs"
          value={activeCount.toString()}
          icon={Briefcase}
          trend={{ value: activeCount, isPositive: true }}
        />
        <StatCard
          title="Total Candidates"
          value={candidates.length.toString()}
          icon={Users}
          trend={{ value: candidates.length, isPositive: true }}
        />
        <StatCard
          title="Interviews Scheduled"
          value={interviewedCount.toString()}
          icon={Calendar}
          trend={{ value: interviewedCount, isPositive: true }}
        />
        <StatCard
          title="Offers Sent"
          value={offeredCount.toString()}
          icon={TrendingUp}
          trend={{ value: offeredCount, isPositive: true }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Hiring Funnel */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Hiring Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringFunnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1E1E",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Job Distribution */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Job Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {jobDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E1E1E",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Active Jobs</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/recruiter/jobs")}>View All</Button>
          </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4AF37 transparent' }}>
              {activeJobsList.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active jobs found.</p>
            ) : (
              activeJobsList.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>0 applicants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
                      {job.employmentType || "Full-time"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Top Candidates */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Top AI-Matched Candidates</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/recruiter/candidates")}>View All</Button>
          </div>
          <div className="space-y-4">
            {topCandidatesList.length === 0 ? (
              <p className="text-muted-foreground text-sm">No candidates found.</p>
            ) : (
              topCandidatesList.map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-border transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {candidate.user ? `${candidate.user.firstName} ${candidate.user.lastName}` : "Unnamed Candidate"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{candidate.professionalHeadline || "Software Engineer"}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded">
                      <Star className="h-3 w-3" />
                      <span className="text-sm font-semibold">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{candidate.location || "Remote"}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => navigate("/recruiter/candidates")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* Interviewed Candidates Section */}
      <GlassCard className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#D4AF37]" />
              Interviewed Candidates
            </h2>
            <p className="text-sm text-muted-foreground">Monitor candidate interview schedules, status, and progress</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/recruiter/interviews/schedule")} className="border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10">
            Schedule Interview
          </Button>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center p-8 bg-secondary/30 rounded-xl border border-border/50">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground text-sm font-medium">No candidate interviews scheduled or conducted yet.</p>
            <Button size="sm" className="mt-4 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" onClick={() => navigate("/recruiter/interviews/schedule")}>
              Schedule First Interview
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.slice(0, 6).map((item) => {
              const cName = item.candidateName || (item.candidate?.user ? `${item.candidate.user.firstName} ${item.candidate.user.lastName}` : "Candidate");
              const pos = item.position || item.job?.title || "Position";
              const dateVal = item.interviewDate || item.date;
              const timeVal = item.interviewTime || item.time || "";

              return (
                <div key={item.id || Math.random()} className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold">
                          {cName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-base leading-tight">{cName}</h4>
                          <p className="text-xs text-[#D4AF37] font-medium">{pos}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        item.status === "Confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        item.status === "Completed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }>
                        {item.status || "Scheduled"}
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{dateVal ? new Date(dateVal).toLocaleDateString() : "Date TBD"}</span>
                        {timeVal && <span>• {timeVal.substring(0, 5)}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                        <span>Type: {item.type || "Technical"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <Button size="sm" variant="ghost" onClick={() => navigate("/recruiter/interviews/schedule")} className="text-xs text-muted-foreground hover:text-foreground">
                      Manage Schedule
                    </Button>
                    <Button size="sm" onClick={() => navigate("/interviews/video-room")} className="text-xs bg-secondary text-foreground hover:bg-secondary/80 border border-border">
                      Join Room
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </DashboardLayout>
  );
}
