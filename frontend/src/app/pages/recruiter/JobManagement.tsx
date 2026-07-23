import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Eye, Trash2, Users, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

import { useState, useEffect } from "react";
import { api } from "../../api";
import { useNavigate, useLocation } from "react-router";

export function JobManagement() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    minimumSalary: 0,
    maximumSalary: 0,
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    status: 1
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
      let orgId = undefined;
      if (user.id) {
        const profile = await api.recruiters.getProfile(user.id).catch(() => null);
        orgId = profile?.organizationId || profile?.organization?.id;
      }
      if (orgId) {
        const orgJobs = await api.jobs.getAll({ organizationId: orgId });
        setJobs(orgJobs || []);
      }
    } catch (err) {
      console.error("Error loading jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (job: any, viewOnly = false) => {
    setNewJob({
      title: job.title || "",
      companyName: job.organization?.name || "",
      description: job.description || "",
      location: job.location || "",
      employmentType: job.employmentType || "Full-time",
      minimumSalary: job.minimumSalary || 0,
      maximumSalary: job.maximumSalary || 0,
      expiryDate: job.expiryDate ? job.expiryDate.split('T')[0] : new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      status: job.status === "Active" ? 1 : job.status === "Closed" ? 2 : job.status === "Draft" ? 0 : job.status
    });
    setEditingJobId(job.id);
    setIsViewMode(viewOnly);
    setIsCreateOpen(true);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('talentai.user') || '{}');
      const dto: any = {
        ...newJob,
        recruiterId: user.id
      };
      
      if (editingJobId) {
        dto.id = editingJobId;
        await api.jobs.update(editingJobId, dto);
      } else {
        await api.jobs.create(dto);
      }
      
      await loadJobs(); // Refresh jobs to get updated relations like organization
      
      setIsCreateOpen(false);
      setNewJob({
        title: "",
        companyName: "",
        description: "",
        location: "",
        employmentType: "Full-time",
        minimumSalary: 0,
        maximumSalary: 0,
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        status: 1
      });
      setEditingJobId(null);
      setIsViewMode(false);
    } catch (err) {
      console.error("Failed to save job", err);
      alert("Failed to save job");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.jobs.delete(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job");
    }
  };
  useEffect(() => {
    loadJobs();
    
    // Check for requisition state from /recruiter/jobs/create
    const req = location.state?.requisition;
    if (req && location.pathname.includes('/jobs/create')) {
      const minSal = req.salaryRange ? parseInt(req.salaryRange.split('-')[0]?.replace(/\D/g, '') || "0") : 0;
      const maxSal = req.salaryRange ? parseInt(req.salaryRange.split('-')[1]?.replace(/\D/g, '') || "0") : 0;
      setNewJob(prev => ({
        ...prev,
        title: req.jobTitle || "",
        description: req.jobDescription || "",
        location: req.location || "",
        employmentType: req.employmentType || "Full-time",
        minimumSalary: minSal,
        maximumSalary: maxSal,
      }));
      setIsCreateOpen(true);
      // Clear location state to avoid reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <DashboardLayout role="recruiter">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Management</h1>
          <p className="text-muted-foreground">Create and manage job postings</p>
        </div>
        <Button onClick={() => {
          setEditingJobId(null);
          setIsViewMode(false);
          setNewJob({
            title: "", companyName: "", description: "", location: "", employmentType: "Full-time", minimumSalary: 0, maximumSalary: 0, expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], status: 1
          });
          setIsCreateOpen(true);
        }} className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black">
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <GlassCard key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <Badge
                      variant={job.status === 1 || job.status === "Active" ? "default" : job.status === 2 || job.status === "Closed" ? "destructive" : "outline"}
                    >
                      {job.status === 1 || job.status === "Active" ? "Active" : job.status === 2 || job.status === "Closed" ? "Closed" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                    <span>{job.location}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>0 applicants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(job, true)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(job, false)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/recruiter/applications?jobId=${job.id}`)}>
                      <Users className="mr-2 h-4 w-4" />
                      View Candidates
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/30">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>{isViewMode ? 'Job Details' : editingJobId ? 'Edit Job Posting' : 'Create New Job Posting'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateJob} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" required disabled={isViewMode} value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" required disabled={isViewMode} value={newJob.companyName} onChange={e => setNewJob({...newJob, companyName: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <select 
                  id="employmentType" 
                  disabled={isViewMode}
                  value={newJob.employmentType} 
                  onChange={e => setNewJob({...newJob, employmentType: e.target.value})}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" required disabled={isViewMode} value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. New York, NY or Remote" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" required disabled={isViewMode} rows={4} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="Describe the role, responsibilities, and requirements..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSalary">Minimum Salary</Label>
                <Input id="minSalary" type="number" disabled={isViewMode} required value={newJob.minimumSalary} onChange={e => setNewJob({...newJob, minimumSalary: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSalary">Maximum Salary</Label>
                <Input id="maxSalary" type="number" disabled={isViewMode} required value={newJob.maximumSalary} onChange={e => setNewJob({...newJob, maximumSalary: Number(e.target.value)})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" disabled={isViewMode} required value={newJob.expiryDate} onChange={e => setNewJob({...newJob, expiryDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  disabled={isViewMode}
                  value={newJob.status} 
                  onChange={e => setNewJob({...newJob, status: Number(e.target.value)})}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Draft</option>
                  <option value={2}>Closed</option>
                </select>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>{isViewMode ? 'Close' : 'Cancel'}</Button>
              {!isViewMode && <Button type="submit" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black">{editingJobId ? 'Save Changes' : 'Create Job'}</Button>}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
