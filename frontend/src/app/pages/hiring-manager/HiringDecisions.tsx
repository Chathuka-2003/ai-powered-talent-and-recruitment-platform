import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import { api } from "../../api";

export function HiringDecisions() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
      if (user.id) {
        const shortlistedData = await api.hiringManager.getShortlisted(user.id).catch(() => []);
        setCandidates(shortlistedData || []);
      }
    } catch (err) {
      console.error("Error loading HM decisions data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (candidateId: string, applicationId: string, decision: string, name: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
      if (user.id) {
        // Map decision to API expected Notes (Approve, Reject, In Progress)
        let note = "In Progress";
        if (decision === "approved") note = "Approve";
        else if (decision === "rejected") note = "Reject";
        else if (decision === "put on hold") note = "In Progress";
        
        await api.hiringManager.submitDecision(user.id, {
          ApplicationId: applicationId,
          AIMatchScore: 0,
          Notes: note
        });
        toast.success(`${name} has been ${decision}`);
        loadData(); // Refresh list to remove the decided candidate
      }
    } catch (err) {
       toast.error(`Failed to submit decision for ${name}`);
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Hiring Decisions</h1>
        <p className="text-muted-foreground">Make final hiring decisions</p>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <GlassCard key={candidate.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-foreground">{candidate.candidateName}</h3>
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
                    {candidate.aiMatchScore || 0}% Match
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">{candidate.position}</p>
                <Badge variant="outline" className="text-green-500 border-green-500/40">
                  {candidate.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleDecision(candidate.candidateId, candidate.id, "approved", candidate.candidateName)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDecision(candidate.candidateId, candidate.id, "put on hold", candidate.candidateName)}
              >
                <Clock className="mr-2 h-4 w-4" />
                Hold
              </Button>
              <Button
                variant="outline"
                className="border-red-500/40 text-red-500 hover:bg-red-500/10"
                onClick={() => handleDecision(candidate.candidateId, candidate.id, "rejected", candidate.candidateName)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
