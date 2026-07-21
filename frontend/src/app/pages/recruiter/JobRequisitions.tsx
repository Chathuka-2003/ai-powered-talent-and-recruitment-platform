import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";

export function RecruiterJobRequisitions() {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const n = useNavigate();
  const userId = (() => {
    try { return JSON.parse(localStorage.getItem('talentai.user') || '{}').id; }
    catch { return null; }
  })();

  const loadRequisitions = () => {
    if (userId) {
      api.recruiters.getProfile(userId)
        .then((profile: any) => {
          if (profile?.organization?.id) {
            api.jobRequisitions.getByOrganization(profile.organization.id)
              .then(setRequisitions)
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    loadRequisitions();
  }, [userId]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.jobRequisitions.updateStatus(id, status);
      loadRequisitions();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Job Requisitions</h1>
        <div className="grid gap-4">
          {requisitions.length === 0 ? (
            <GlassCard className="p-8 text-center text-gray-400">
              No job requisitions found for your organization.
            </GlassCard>
          ) : (
            requisitions.map((req) => (
              <GlassCard key={req.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{req.jobTitle}</h3>
                    <p className="text-[#D4AF37]">{req.department}</p>
                    <div className="mt-2 text-sm text-gray-400 space-y-1">
                      <p>Type: {req.employmentType}</p>
                      <p>Target Salary: {req.salaryRange || 'N/A'}</p>
                      <p>Hiring Manager: {req.hiringManager?.user?.firstName ? `${req.hiringManager.user.firstName} ${req.hiringManager.user.lastName}` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={"px-3 py-1 rounded-full text-xs "}>
                      {req.approvalStatus}
                    </span>
                    {req.approvalStatus === 'Approved' && (
                      <Button onClick={() => n('/recruiter/jobs/create', { state: { requisition: req } })}>
                        Convert to Job
                      </Button>
                    )}
                    {req.approvalStatus === 'Pending Approval' && (
                      <div className="flex gap-2">
                        <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleUpdateStatus(req.id, 'Rejected')}>
                          Reject
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-500 text-white" onClick={() => handleUpdateStatus(req.id, 'Approved')}>
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
