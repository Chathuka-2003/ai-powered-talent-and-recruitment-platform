import { useState, useEffect } from "react";
import { api, BACKEND_URL } from "../../api";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { FileText, Eye, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

export function ResumeReader() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
        if (user.id) {
          const data = await api.applications.getForRecruiter(user.id);
          const filtered = jobIdFilter ? (data || []).filter((app: any) => app.jobId === jobIdFilter) : (data || []);
          setApplications(filtered);
        }
      } catch (err) {
        console.error("Error loading applications", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobIdFilter]);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.applications.updateStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Application Review</h1>
        <p className="text-muted-foreground">{jobIdFilter ? "Review candidates for the selected job" : "Review candidates who have applied to your jobs"}</p>
      </div>

      <GlassCard className="p-6">
        {loading ? (
          <p className="text-muted-foreground animate-pulse">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">No Applications Yet</h3>
            <p className="text-muted-foreground mt-2">Candidates who apply to your job postings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#D4AF37]/50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-lg">{app.candidateName || "Unnamed Candidate"}</h3>
                    <Badge variant="outline" className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30">
                      {app.status || "Pending Review"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Applied for: <span className="text-white">{app.jobTitle || "Unknown Job"}</span></p>
                  {app.aiMatchScore && (
                    <p className="text-xs text-[#D4AF37] mt-1">AI Match Score: {app.aiMatchScore}%</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {app.resumeUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(`${BACKEND_URL}${app.resumeUrl}`, '_blank')}>
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                  )}
                  {app.status !== 'Shortlisted' && (
                    <Button variant="default" size="sm" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black" onClick={() => handleUpdateStatus(app.id, "Shortlisted")}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Shortlist
                    </Button>
                  )}
                  {app.status !== 'Rejected' && (
                    <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20" onClick={() => handleUpdateStatus(app.id, "Rejected")}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </DashboardLayout>
  );
}
