import { DashboardLayout } from "../../components/DashboardLayout";
import { StatCard } from "../../components/StatCard";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router";
import { Users, ClipboardCheck, Calendar, Star, Eye } from "lucide-react";

import { useState, useEffect } from "react";
import { api } from "../../api";

export function HiringManagerDashboard() {
  const navigate = useNavigate();
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
        if (user.id) {
          const [shortlistedData, interviewsData] = await Promise.all([
            api.hiringManager.getShortlisted(user.id).catch(() => []),
            api.hiringManager.getInterviews(user.id).catch(() => [])
          ]);
          setPendingReviews(shortlistedData || []);
          setInterviews(interviewsData || []);
        }
      } catch (err) {
        console.error("Error loading HM dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const todayInterviewsCount = interviews.filter(i => {
    const interviewDate = new Date(i.scheduledAt || i.scheduledDate);
    const today = new Date();
    return interviewDate.toDateString() === today.toDateString();
  }).length;
  
  // Assuming 'Hired' candidates might be tracked elsewhere, for now we will just use basic counts.

  return (
    <DashboardLayout role="hiring-manager">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Hiring Manager Dashboard</h1>
        <p className="text-muted-foreground">Review candidates and make hiring decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Pending Reviews" value={pendingReviews.length.toString()} icon={Users} />
        <StatCard title="Interviews Today" value={todayInterviewsCount.toString()} icon={Calendar} />
        <StatCard title="Total Interviews" value={interviews.length.toString()} icon={ClipboardCheck} />
        <StatCard title="Avg Rating" value="4.5" icon={Star} />
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Pending Candidate Reviews</h2>
        <div className="space-y-4">
          {pendingReviews.map((candidate) => (
            <div key={candidate.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-foreground">{candidate.candidateName}</h3>
                    <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
                      {candidate.aiMatchScore || 0}% Match
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{candidate.position}</p>
                  <p className="text-xs text-muted-foreground">Status: {candidate.status}</p>
                </div>
                <Button onClick={() => navigate(`/hiring-manager/review/${candidate.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
