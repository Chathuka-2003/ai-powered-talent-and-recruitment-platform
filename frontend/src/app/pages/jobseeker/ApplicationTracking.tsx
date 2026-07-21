import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, Clock, Lock, Pencil, Trash2 } from "lucide-react";
import { api } from "../../api";
import { getCurrentRole } from "../../auth";

function getUser() {
  try {
    const s = localStorage.getItem("talentai.user");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function ApplicationTracking() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const steps = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Offer Received"];

  const fetchApplications = async () => {
    try {
      const user = getUser();
      if (!user?.id) return;
      const candidate = await api.candidates.getByUserId(user.id);
      if (!candidate) return;
      const data = await api.applications.getByCandidate(candidate.id);
      setApps(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: string) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      try {
        await api.applications.withdraw(id);
        setApps(apps.filter(app => app.id !== id));
      } catch (err) {
        console.error("Failed to withdraw application:", err);
      }
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Applied": return 1;
      case "Reviewed": return 2;
      case "Shortlisted": return 3;
      case "Interview Scheduled": return 4;
      case "Hired": return 5;
      case "Rejected": return 5; // Reached the end of the process
      default: return 1;
    }
  };

  return (
    <DashboardLayout role="jobseeker">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-[#D4AF37]">Dashboard / Applications</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Track submitted applications, recruiter notes, and recruitment progress.</p>
        </div>

        {loading ? (
          <div className="text-center p-10 text-muted-foreground">Loading applications...</div>
        ) : apps.length === 0 ? (
          <GlassCard className="p-10 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">No Applications Yet</h2>
            <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
            <Button onClick={() => window.location.href = "/jobseeker/jobs"}>Browse Jobs</Button>
          </GlassCard>
        ) : (
          apps.map(app => (
            <GlassCard key={app.id} className="p-6">
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                <div>
                  <Badge className="mb-3 bg-[#D4AF37]/15 text-[#D4AF37] border-border">{app.status || "Applied"}</Badge>
                  <h2 className="text-xl font-semibold text-foreground">{app.job?.title}</h2>
                  <p className="text-muted-foreground">{app.job?.organization?.name || "Company"} • {app.job?.location} • {app.job?.employmentType}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Application ID: {app.id.substring(0, 8).toUpperCase()} • Applied Date: {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.status === "Applied" || app.status === "Reviewed" ? (
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleWithdraw(app.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />Withdraw Application
                    </Button>
                  ) : (
                    <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Editing closed</Button>
                  )}
                </div>
              </div>

              {app.aiMatchScore != null && (
                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                  <Info label="AI Match Score" value={`${app.aiMatchScore.toFixed(0)}%`} />
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-foreground font-medium mb-3">Recruitment Progress</h3>
                <div className="grid md:grid-cols-5 gap-3">
                  {steps.map((s, i) => {
                    const stepIndex = getStepIndex(app.status);
                    const isCompleted = i < stepIndex;
                    const isCurrent = i === stepIndex - 1;
                    const isRejected = app.status === "Rejected";

                    let icon = <Clock className="h-4 w-4 text-[#D4AF37]" />;
                    if (isCompleted) {
                      if (isCurrent && isRejected) {
                        icon = <Lock className="h-4 w-4 text-red-500" />;
                      } else {
                        icon = <CheckCircle2 className="h-4 w-4 text-green-400" />;
                      }
                    } else if (isRejected) {
                        icon = <Lock className="h-4 w-4 text-muted-foreground" />;
                    }
                    
                    let textColor = "text-gray-300";
                    if (isCurrent && isRejected) textColor = "text-red-500";
                    else if (!isCompleted && isRejected) textColor = "text-muted-foreground line-through opacity-50";

                    return (
                      <div key={s} className={`rounded-xl bg-secondary/50 border border-border p-3 text-sm ${textColor} flex items-center gap-2`}>
                        {icon}
                        {s}
                      </div>
                    );
                  })}
                </div>
              </div>

              {app.recruiterNotes && (
                <div className="mt-5 rounded-xl bg-secondary/45 border border-border p-4">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">Recruiter Notes</p>
                  <p className="text-gray-300 mt-1">{app.recruiterNotes}</p>
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/45 border border-border p-4">
      <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">{label}</p>
      <p className="text-foreground mt-1">{value}</p>
    </div>
  );
}
