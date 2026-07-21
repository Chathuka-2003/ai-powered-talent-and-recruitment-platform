import { useState, useEffect, type ReactNode } from "react";
import { api } from "../../api";
import { toast } from "sonner";
import { getUserId } from "../../auth";
import { useNavigate, useSearchParams } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Bell, Briefcase, Calendar, CalendarDays, CheckCircle2, Clock, Download, Edit3, Eye, FileText, Filter, Lock, Mail, MessageSquare, Plus, RefreshCcw, Search, Send, Settings, Shield, Sparkles, Star, Trash2, UserCheck, UserPlus, Users, Video, XCircle, MoreVertical } from "lucide-react";
import { MessagesView } from "../shared/MessagesView";
import { NotificationsView } from "../shared/NotificationsView";
import { AccountSettingsView } from "../shared/AccountSettingsView";
import { HMSuiteView } from "./HMSuiteView";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Header({title,subtitle}:{title:string;subtitle:string}){return <div className="mb-6"><p className="text-sm text-[#D4AF37]">Hiring Manager / {title}</p><h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1><p className="text-muted-foreground max-w-3xl">{subtitle}</p></div>}
function Toolbar({children}:{children:ReactNode}){return <GlassCard className="p-4 mb-6"><div className="flex flex-wrap gap-3 items-center">{children}</div></GlassCard>}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-secondary/50 border border-border p-3"><p className="text-xs text-muted-foreground uppercase tracking-[.16em]">{label}</p><p className="text-foreground mt-1">{value}</p></div>}
function Table({children}:{children:ReactNode}){return <GlassCard className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm">{children}</table></div></GlassCard>}
function Th({children}:{children:ReactNode}){return <th className="px-5 py-4 text-left text-xs uppercase tracking-[.18em] text-muted-foreground border-b border-border">{children}</th>}
function Td({children}:{children:ReactNode}){return <td className="px-5 py-4 border-b border-border text-gray-300 align-top">{children}</td>}
function CandActions({ applicationId, hmId, onAction }: { applicationId: string, hmId: string, onAction: (action: string) => void }) {
  const handleDecision = async (decision: string) => {
    try {
      await api.hiringManager.submitDecision(hmId, {
        applicationId,
        aiMatchScore: 0,
        notes: decision
      });
      toast.success(`Candidate ${decision.toLowerCase()}ed successfully!`);
      onAction(decision);
    } catch (err: any) {
      toast.error(err.message || `Failed to ${decision.toLowerCase()} candidate`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => handleDecision("Approve")}>Shortlist</Button>
      <Button size="sm" variant="destructive" onClick={() => handleDecision("Reject")}>Reject</Button>
      <Button size="sm" variant="outline" onClick={() => toast.info("Interview scheduler coming soon!")}>Schedule Interview</Button>
      <Button size="sm" variant="outline" onClick={() => toast.info("Resume viewer coming soon!")}>Resume</Button>
    </div>
  );
}

export function HMDashboard() {
  const n = useNavigate();
  const hmId = getUserId();
  const [reports, setReports] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getReports(hmId).then(setReports).catch(console.error);
      api.hiringManager.getCandidates(hmId).then(data => setCandidates(data.slice(0, 5))).catch(console.error);
      api.notifications.getByUser(hmId).then(data => setNotifications(data.slice(0, 5))).catch(console.error);
    }
  }, []);

  if (!reports) return <DashboardLayout role="hiring-manager"><Header title="Dashboard" subtitle="Loading..."/></DashboardLayout>;

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Dashboard" subtitle="Executive hiring command center for approvals, reviews, interviews, decisions, tasks, and AI-assisted recruitment."/>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <button onClick={() => n('/hiring-manager/assigned-jobs')}><StatCard title="Open Positions" value={reports.openPositions} icon={Briefcase}/></button>
        <button onClick={() => n('/hiring-manager/reviews')}><StatCard title="Pending Reviews" value={reports.candidatesReviewed} icon={UserCheck}/></button>
        <button onClick={() => n('/hiring-manager/interviews')}><StatCard title="Interviews Today" value={reports.interviewsConducted} icon={Calendar}/></button>
        <button onClick={() => n('/hiring-manager/decisions')}><StatCard title="Pending Approvals" value={reports.decisionsMade} icon={CheckCircle2}/></button>
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-2 p-6">
          <h2 className="text-xl text-foreground font-semibold mb-4">Hiring Pipeline Overview</h2>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={reports.funnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D"/><XAxis dataKey="name" stroke="#999"/><YAxis stroke="#999"/>
              <Tooltip contentStyle={{backgroundColor: '#1E1E1E', border: '1px solid rgba(212,175,55,.25)', color: '#fff'}}/>
              <Bar dataKey="value" fill="#D4AF37" radius={[8,8,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-xl text-foreground font-semibold mb-4">Pending Tasks</h2>
          {['Approve final offer for QA Intern','Add feedback for Kavishi','Review backend shortlist','Confirm panel for 2 PM interview'].map((x, i) => (
            <button key={x} onClick={() => n(i === 0 ? '/hiring-manager/decisions' : '/hiring-manager/reviews')} className="w-full text-left p-3 rounded-xl bg-secondary/50 border border-border mb-3 text-gray-300 hover:border-[#D4AF37]/35">{x}</button>
          ))}
        </GlassCard>
      </div>
      <div className="grid xl:grid-cols-2 gap-6 mt-6">
        <GlassCard className="p-6">
          <h2 className="text-xl text-foreground font-semibold mb-4">Recent Candidates</h2>
          {candidates.map(p => (
            <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-border mb-3">
              <div>
                <b className="text-foreground">{p.candidateName}</b>
                <p className="text-sm text-muted-foreground">{p.position} • {p.status}</p>
              </div>
              <Button size="sm" onClick={() => n('/hiring-manager/candidates')}>View Candidate</Button>
            </div>
          ))}
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-xl text-foreground font-semibold mb-4">Recent Notifications</h2>
          {notifications.map(notif => (
            <button key={notif.id} onClick={() => n('/hiring-manager/notifications')} className="w-full text-left p-3 rounded-xl bg-secondary/50 border border-border mb-3 text-gray-300 hover:border-[#D4AF37]/35 transition-colors">
              <div className="font-semibold text-foreground flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">🔔</span>
                  {notif.title}
                </span>
                <span className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm mt-1 ml-6">{notif.messageText}</div>
            </button>
          ))}
          {notifications.length === 0 && (
            <div className="text-center p-6 bg-secondary/30 rounded-xl border border-border/50">
              <span className="text-4xl block mb-2 opacity-50">🔔</span>
              <p className="text-muted-foreground text-sm font-medium">No recent notifications</p>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
export function HMProfile() {
  const [profile, setProfile] = useState<any>({});
  const hmId = getUserId();

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getProfile(hmId).then(setProfile).catch(console.error);
    }
  }, []);

  const handleSave = async () => {
    if (hmId) {
      await api.hiringManager.updateProfile(hmId, profile);
      alert("Profile updated successfully");
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="My Profile" subtitle="Manage your hiring manager profile, department, and designation." />
      <GlassCard className="p-6">
        <div className="flex gap-5 items-center">
          <Avatar className="h-20 w-20 border border-[#D4AF37]/40">
            <AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37] text-2xl">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl text-foreground font-semibold">{profile.firstName} {profile.lastName}</h2>
            <p className="text-muted-foreground">{profile.department} • {profile.designation}</p>
            <Button variant="outline" className="mt-3">Upload Profile Picture</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Input placeholder="First Name" value={profile.firstName || ""} onChange={e => setProfile({...profile, firstName: e.target.value})} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Last Name" value={profile.lastName || ""} onChange={e => setProfile({...profile, lastName: e.target.value})} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Email" value={profile.email || ""} disabled className="bg-secondary border-border text-foreground opacity-70" />
          <Input placeholder="Phone Number" value={profile.phone || ""} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Department" value={profile.department || ""} onChange={e => setProfile({...profile, department: e.target.value})} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Designation" value={profile.designation || ""} onChange={e => setProfile({...profile, designation: e.target.value})} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Company Name" value={profile.organizationName || ""} disabled className="bg-secondary border-border text-foreground opacity-70" />
        </div>
        <div className="mt-5 flex gap-3">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline"><Lock className="mr-2 h-4 w-4"/>Change Password</Button>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
export function JobRequisitions() {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [employmentType, setEmploymentType] = useState("full");
  const [description, setDescription] = useState("");
  
  const hmId = getUserId();

  const loadData = () => {
    if (hmId) {
      api.jobRequisitions.getByHiringManager(hmId).then(setRequisitions).catch(console.error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async () => {
    if (!hmId) return;
    await api.jobRequisitions.create({
      hiringManagerId: hmId,
      jobTitle: title,
      department,
      location,
      salaryRange,
      numberOfPositions: parseInt(vacancies || "1"),
      employmentType,
      jobDescription: description
    });
    setTitle(""); setDepartment(""); setLocation(""); setSalaryRange(""); setVacancies(""); setDescription("");
    loadData();
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Job Requisitions" subtitle="Create, submit, edit, view, and close job requests for approval." />
      <GlassCard className="p-6 mb-6">
        <h2 className="text-xl text-foreground font-semibold mb-4">Requisition Form</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Job Title" value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary border-border text-foreground"/>
          <Input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} className="bg-secondary border-border text-foreground"/>
          <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="bg-secondary border-border text-foreground"/>
          <Input placeholder="Salary Range" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} className="bg-secondary border-border text-foreground"/>
          <Input placeholder="Number of Vacancies" value={vacancies} onChange={e => setVacancies(e.target.value)} className="bg-secondary border-border text-foreground"/>
          <Select value={employmentType} onValueChange={setEmploymentType}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full-Time</SelectItem>
              <SelectItem value="intern">Internship</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Job Description" value={description} onChange={e => setDescription(e.target.value)} className="md:col-span-2 bg-secondary border-border text-foreground"/>
        </div>
        <div className="mt-5 flex gap-3">
          <Button onClick={handleSubmit}><Plus className="mr-2 h-4 w-4"/>Create Requisition</Button>
        </div>
      </GlassCard>
      <Table>
        <thead><tr><Th>Job Title</Th><Th>Department</Th><Th>Status</Th><Th>Vacancies</Th><Th>Created</Th></tr></thead>
        <tbody>
          {requisitions.map(r => (
            <tr key={r.id}>
              <Td>{r.jobTitle}</Td>
              <Td>{r.department}</Td>
              <Td><Badge className="bg-[#D4AF37]/15 text-[#D4AF37]">{r.approvalStatus}</Badge></Td>
              <Td>{r.numberOfPositions}</Td>
              <Td>{new Date(r.createdAt).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function AssignedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const hmId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getAssignedJobs(hmId).then(setJobs).catch(console.error);
    }
  }, []);

  const getStatusText = (status: number | string) => {
    if (typeof status === 'string') return status;
    switch (status) {
      case 0: return "Draft";
      case 1: return "Active";
      case 2: return "Closed";
      case 3: return "On Hold";
      default: return "Unknown";
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Assigned Jobs" subtitle="Track assigned roles, candidates, and hiring progress." />
      <Table>
        <thead><tr><Th>Job Title</Th><Th>Location</Th><Th>Status</Th><Th>Candidates Applied</Th><Th>Hiring Progress</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <Td>{j.title}</Td>
              <Td>{j.location}</Td>
              <Td>
                <Badge variant={j.status === 1 ? "default" : "outline"}>{getStatusText(j.status)}</Badge>
              </Td>
              <Td>{j.candidatesApplied}</Td>
              <Td>{j.hiringProgress}%</Td>
              <Td>
                <Button size="sm" variant="outline" onClick={() => navigate(`/hiring-manager/candidates?jobId=${j.id}`)}>
                  View Candidates
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notifications, setNotifications] = useState<any[]>([]);
  const hmId = getUserId();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getCandidates(hmId).then(res => {
        if (jobId) {
          setCandidates(res.filter((c: any) => c.jobId === jobId));
        } else {
          setCandidates(res);
        }
      }).catch(console.error);
    }
  }, [hmId, jobId]);
  const handleAction = async (applicationId: string, decision: string) => {
    try {
      if (hmId) {
        await api.hiringManager.submitDecision(hmId, {
          applicationId,
          aiMatchScore: 0,
          notes: decision
        });
        toast.success(`Candidate ${decision.toLowerCase()}ed successfully!`);
        const res = await api.hiringManager.getCandidates(hmId);
        setCandidates(jobId ? res.filter((c: any) => c.jobId === jobId) : res);
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${decision.toLowerCase()} candidate`);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = (c.candidateName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                          (c.position?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Candidates" subtitle="Review assigned candidates, resume score, interview status." />
      <Toolbar>
        <Input 
          placeholder="Search Candidate" 
          className="max-w-xs bg-secondary border-border text-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-secondary border-border text-foreground">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Hired">Hired</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>
      <Table>
        <thead><tr><Th>Candidate Name</Th><Th>Applied Position</Th><Th>Status</Th><Th>Resume Score</Th><Th>Interview Status</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {filteredCandidates.map(c => (
            <tr key={c.id}>
              <Td>{c.candidateName}</Td>
              <Td>{c.position}</Td>
              <Td>{c.status}</Td>
              <Td>{c.aiMatchScore || 0}%</Td>
              <Td>{c.interviewStatus || "Pending"}</Td>
              <Td>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground outline-none focus:ring-2 focus:ring-ring">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => navigate(`/hiring-manager/candidate-details?applicationId=${c.id}`)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAction(c.id, "Approve")}>
                      Shortlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAction(c.id, "Reject")} className="text-destructive">
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function CandidateDetails() {
  const [candidate, setCandidate] = useState<any>(null);
  const hmId = getUserId();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getCandidates(hmId).then(data => {
        if (applicationId) {
          const found = data.find((c: any) => c.id === applicationId);
          setCandidate(found || data[0]);
        } else if (data.length > 0) {
          setCandidate(data[0]);
        }
      }).catch(console.error);
    }
  }, [hmId, applicationId]);

  if (!candidate) return <DashboardLayout role="hiring-manager"><Header title="Candidate Profile" subtitle="Loading..."/></DashboardLayout>;

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Candidate Profile" subtitle="Personal information, education, skills, experience, portfolio, and resume."/>
      <GlassCard className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37]">{candidate.candidateName?.[0]}</AvatarFallback></Avatar>
          <div>
            <h2 className="text-2xl text-foreground font-semibold">{candidate.candidateName}</h2>
            <p className="text-muted-foreground">{candidate.position}</p>
          </div>
        </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Info label="Applied Position" value={candidate.position}/>
            <Info label="AI Score" value={`${candidate.aiMatchScore || 0}%`}/>
            <Info label="Status" value={candidate.status}/>
          </div>
          <div className="mt-5">
            {hmId && (
              <CandActions 
                applicationId={candidate.id} 
                hmId={hmId} 
                onAction={(action) => setCandidate({ ...candidate, status: action === "Approve" ? "Hired" : "Rejected" })}
              />
            )}
          </div>
        </GlassCard>
    </DashboardLayout>
  );
}
export function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  
  const loadReviews = () => {
    const hmId = getUserId();
    if (hmId) api.hiringManager.getShortlisted(hmId).then(setReviews).catch(console.error);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDecision = async (applicationId: string, aiMatchScore: number, decision: string) => {
    const hmId = getUserId();
    if (!hmId) return;
    try {
      await api.hiringManager.submitDecision(hmId, {
        applicationId,
        aiMatchScore,
        notes: decision
      });
      toast.success(`Candidate ${decision.toLowerCase()}ed successfully!`);
      loadReviews();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || `Failed to ${decision.toLowerCase()} candidate`);
    }
  };
  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Candidate Reviews" subtitle="Review shortlisted applications." />
      {reviews.length === 0 ? <p className="text-muted-foreground">No pending reviews found.</p> : reviews.map(r => (
        <GlassCard key={r.id} className="p-6 mb-4">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl text-foreground font-semibold">{r.candidateName}</h2>
              <p className="text-muted-foreground">{r.position} • {r.status}</p>
            </div>
            <Badge className="bg-[#D4AF37]/15 text-[#D4AF37]">AI Match {r.aiMatchScore || 0}%</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <Info label="Recruiter Notes" value={r.recruiterNotes || "N/A"}/>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => handleDecision(r.id, r.aiMatchScore || 0, "Approve")}>Approve Candidate</Button>
            <Button variant="destructive" onClick={() => handleDecision(r.id, r.aiMatchScore || 0, "Reject")}>Reject Candidate</Button>
          </div>
        </GlassCard>
      ))}
    </DashboardLayout>
  );
}
export function Evaluations() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [availableCandidates, setAvailableCandidates] = useState<any[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [techRating, setTechRating] = useState("");
  const [commRating, setCommRating] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [summary, setSummary] = useState("");

  const loadData = () => {
    const hmId = getUserId();
    if (hmId) {
      api.hiringManager.getEvaluations(hmId).then(setEvaluations).catch(console.error);
      api.hiringManager.getCandidates(hmId).then((res: any[]) => {
        const unique = [];
        const seen = new Set();
        for (const c of res) {
          if (c.candidateId && !seen.has(c.candidateId)) {
            seen.add(c.candidateId);
            unique.push(c);
          }
        }
        setAvailableCandidates(unique);
      }).catch(console.error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async () => {
    const hmId = getUserId();
    if (!hmId || !candidateId) return toast.error("Please select a candidate");
    if (!techRating || !commRating || !overallRating) return toast.error("Please fill in all ratings");
    
    try {
      await api.hiringManager.submitEvaluation(hmId, {
        candidateId,
        technicalRating: parseFloat(techRating),
        communicationRating: parseFloat(commRating),
        overallRating: parseFloat(overallRating),
        summary
      });
      toast.success("Evaluation submitted successfully!");
      setCandidateId(""); setTechRating(""); setCommRating(""); setOverallRating(""); setSummary("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit evaluation");
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Evaluations" subtitle="Create and view structured candidate evaluations." />
      <GlassCard className="p-6 mb-6">
        <h2 className="text-xl text-foreground font-semibold mb-4">Evaluation Form</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Select value={candidateId} onValueChange={setCandidateId}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select Candidate" />
            </SelectTrigger>
            <SelectContent>
              {availableCandidates.map(c => (
                <SelectItem key={c.candidateId} value={c.candidateId}>{c.candidateName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Technical Score (0-100)" value={techRating} onChange={e => setTechRating(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Communication Score (0-100)" value={commRating} onChange={e => setCommRating(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Overall Rating (0-100)" value={overallRating} onChange={e => setOverallRating(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} className="md:col-span-2 bg-secondary border-border text-foreground" />
        </div>
        <div className="mt-5 flex gap-3">
          <Button onClick={handleSubmit}>Submit Evaluation</Button>
        </div>
      </GlassCard>
      
      <Table>
        <thead><tr><Th>Candidate Name</Th><Th>Tech</Th><Th>Comm</Th><Th>Overall</Th><Th>Summary</Th></tr></thead>
        <tbody>
          {evaluations.map((ev, i) => (
            <tr key={i}>
              <Td>{ev.candidateName}</Td>
              <Td>{ev.technicalRating}%</Td>
              <Td>{ev.communicationRating}%</Td>
              <Td>{ev.overallRating}%</Td>
              <Td>{ev.summary}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function Interviews() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const hmId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getInterviews(hmId).then(setInterviews).catch(console.error);
    }
  }, []);

  const filteredInterviews = interviews.filter(i => 
    (i.candidateName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (i.position?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleReschedule = async (interviewId: string) => {
    try {
      await api.interviews.updateStatus(interviewId, "Reschedule Requested");
      toast.success("Reschedule requested successfully.");
      if (hmId) {
        api.hiringManager.getInterviews(hmId).then(setInterviews).catch(console.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to request reschedule");
    }
  };

  const handleCalendarSync = async (provider: string) => {
    try {
      if (!hmId) return toast.error("User not found");
      const res = await api.calendar.getAuthUrl(provider, hmId);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to connect to ${provider} calendar`);
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Interviews" subtitle="View details of online or onsite interviews." />
      <Toolbar>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/interviews/schedule")}><Calendar className="mr-2 h-4 w-4"/>Schedule Interview</Button>
            <Button variant="outline" className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10" onClick={() => handleCalendarSync('google')}>
              <CalendarDays className="mr-2 h-4 w-4"/>Google
            </Button>
            <Button variant="outline" className="text-[#00a4ef] border-[#00a4ef]/20 hover:bg-[#00a4ef]/10" onClick={() => handleCalendarSync('microsoft')}>
              <CalendarDays className="mr-2 h-4 w-4"/>Microsoft
            </Button>
          </div>
          <Input 
            placeholder="Search Candidate" 
            className="max-w-xs bg-secondary border-border text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </Toolbar>
      <Table>
        <thead><tr><Th>Candidate</Th><Th>Position</Th><Th>Date</Th><Th>Time</Th><Th>Type</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {filteredInterviews.map(i => (
            <tr key={i.id}>
              <Td>{i.candidateName}</Td>
              <Td>{i.position}</Td>
              <Td>{new Date(i.interviewDate).toLocaleDateString()}</Td>
              <Td>{i.interviewTime}</Td>
              <Td>{i.type}</Td>
              <Td>{i.status}</Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => i.meetingLink ? window.open(i.meetingLink, '_blank') : toast.error("No meeting link available")}
                  >
                    <Video className="mr-2 h-4 w-4"/>Join Interview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReschedule(i.id)}>Reschedule</Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function Feedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [availableInterviews, setAvailableInterviews] = useState<any[]>([]);
  const [interviewId, setInterviewId] = useState("");
  const [techScore, setTechScore] = useState("");
  const [commScore, setCommScore] = useState("");
  const [overallScore, setOverallScore] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const loadData = () => {
    const hmId = getUserId();
    if (hmId) {
      api.hiringManager.getFeedback(hmId).then(setFeedbacks).catch(console.error);
      api.hiringManager.getInterviews(hmId).then(setAvailableInterviews).catch(console.error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async () => {
    const hmId = getUserId();
    if (!hmId || !interviewId) return toast.error("Please select an interview");
    if (!techScore || !commScore || !overallScore) return toast.error("Please fill in all scores");
    
    try {
      await api.hiringManager.submitFeedback(hmId, {
        interviewId,
        technicalScore: parseFloat(techScore),
        communicationScore: parseFloat(commScore),
        overallScore: parseFloat(overallScore),
        notes,
        recommendation
      });
      toast.success("Feedback submitted successfully!");
      setInterviewId(""); setTechScore(""); setCommScore(""); setOverallScore(""); setNotes(""); setRecommendation("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Interview Feedback" subtitle="Submit and review interview feedback." />
      <GlassCard className="p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Select value={interviewId} onValueChange={setInterviewId}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select Interview" />
            </SelectTrigger>
            <SelectContent>
              {availableInterviews.map(i => (
                <SelectItem key={i.id} value={i.id}>{i.candidateName} - {i.position} ({new Date(i.interviewDate).toLocaleDateString()})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Recommendation (e.g. Hire)" value={recommendation} onChange={e => setRecommendation(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Technical Score" value={techScore} onChange={e => setTechScore(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Communication Score" value={commScore} onChange={e => setCommScore(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Input placeholder="Overall Score" value={overallScore} onChange={e => setOverallScore(e.target.value)} className="bg-secondary border-border text-foreground" />
          <Textarea placeholder="Interview Notes" value={notes} onChange={e => setNotes(e.target.value)} className="md:col-span-2 bg-secondary border-border text-foreground" />
        </div>
        <div className="mt-5 flex gap-3">
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </div>
      </GlassCard>
      
      <Table>
        <thead><tr><Th>Candidate Name</Th><Th>Tech</Th><Th>Comm</Th><Th>Overall</Th><Th>Recommendation</Th><Th>Notes</Th></tr></thead>
        <tbody>
          {feedbacks.map((f, i) => (
            <tr key={i}>
              <Td>{f.candidateName}</Td>
              <Td>{f.technicalScore}%</Td>
              <Td>{f.communicationScore}%</Td>
              <Td>{f.overallScore}%</Td>
              <Td>{f.recommendation}</Td>
              <Td>{f.notes}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function HMCalendar() {
  const [view, setView] = useState('weekly');
  const [interviews, setInterviews] = useState<any[]>([]);
  const hmId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getInterviews(hmId).then(setInterviews).catch(console.error);
    }
  }, []);

  const handleCalendarSync = async (provider: string) => {
    try {
      if (!hmId) return toast.error("User not found");
      const res = await api.calendar.getAuthUrl(provider, hmId);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to connect to ${provider} calendar`);
    }
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Calendar" subtitle="Daily, weekly, and monthly interview, candidate, and team events."/>
      <Toolbar>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={setView}>
            <TabsList className="bg-card">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Button variant="outline" className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10" onClick={() => handleCalendarSync('google')}>
            <CalendarDays className="mr-2 h-4 w-4"/>Google
          </Button>
          <Button variant="outline" className="text-[#00a4ef] border-[#00a4ef]/20 hover:bg-[#00a4ef]/10" onClick={() => handleCalendarSync('microsoft')}>
            <CalendarDays className="mr-2 h-4 w-4"/>Microsoft
          </Button>
          <Button onClick={() => navigate("/interviews/schedule")}><Plus className="mr-2 h-4 w-4"/>Add Event</Button>
        </div>
      </Toolbar>
      <div className="grid md:grid-cols-3 gap-4">
        {interviews.length > 0 ? interviews.map((i, idx) => (
          <GlassCard key={idx} className="p-5">
            <h3 className="text-foreground font-semibold">Interview with {i.candidateName}</h3>
            <p className="text-muted-foreground mt-2">{new Date(i.interviewDate).toLocaleDateString()} • {i.interviewTime} • {i.type}</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => i.meetingLink ? window.open(i.meetingLink, '_blank') : toast.error("No meeting link available")}>
                <Video className="mr-2 h-4 w-4"/>Join Meeting
              </Button>
            </div>
          </GlassCard>
        )) : <p className="text-muted-foreground">No upcoming interviews scheduled.</p>}
      </div>
    </DashboardLayout>
  );
}
export function Decisions() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const hmId = getUserId() || "";

  const loadData = () => {
    if (hmId) {
      api.hiringManager.getDecisions(hmId).then(setDecisions).catch(console.error);
      api.hiringManager.getShortlisted(hmId).then(setApplications).catch(console.error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDecision = async (appId: string, type: string) => {
    try {
      await api.hiringManager.submitDecision(hmId, {
        applicationId: appId,
        notes: type
      });
      toast.success(`Candidate ${type.toLowerCase()}d successfully!`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${type.toLowerCase()} candidate`);
    }
  };

  const handleUpdateDecision = async (decisionId: string, newNotes: string) => {
    try {
      await api.hiringManager.updateDecision(hmId, decisionId, { notes: newNotes });
      toast.success(`Decision updated to ${newNotes}!`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update decision");
    }
  };

  const handleDeleteDecision = async (decisionId: string) => {
    try {
      await api.hiringManager.deleteDecision(hmId, decisionId);
      toast.success("Decision deleted successfully! Application reverted to Reviewed.");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete decision");
    }
  };

  const exportToExcel = () => {
    if (decisions.length === 0) return toast.error("No decisions to export");
    const header = ["Candidate Name", "Position", "Decision", "Date"];
    const rows = decisions.map(d => [
      `"${(d.candidateName || '').replace(/"/g, '""')}"`,
      `"${(d.position || '').replace(/"/g, '""')}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(d.decisionDate).toLocaleDateString()}"`
    ]);
    const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hiring_decisions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Excel (CSV) file downloaded successfully");
  };

  const exportToPDF = () => {
    if (decisions.length === 0) return toast.error("No decisions to export");
    const doc = new jsPDF();
    doc.text("Hiring Decisions History", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Candidate Name", "Position", "Decision", "Date"]],
      body: decisions.map(d => [
        d.candidateName, 
        d.position, 
        d.notes, 
        new Date(d.decisionDate).toLocaleDateString()
      ])
    });
    doc.save("hiring_decisions.pdf");
    toast.success("PDF file downloaded successfully");
  };

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Hiring Decisions" subtitle="Final approvals and rejections." />
      
      <h2 className="text-xl text-foreground font-semibold mb-4 mt-6">Pending Decisions</h2>
      <Table>
        <thead><tr><Th>Candidate Name</Th><Th>Position</Th><Th>AI Match Score</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <Td>{app.candidateName}</Td>
              <Td>{app.position}</Td>
              <Td>{app.aiMatchScore || 0}%</Td>
              <Td>{app.status}</Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleDecision(app.id, 'Approve')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDecision(app.id, 'Reject')}>Reject</Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <div className="flex justify-between items-center mb-4 mt-10">
        <h2 className="text-xl text-foreground font-semibold">Decision History</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToPDF}><Download className="mr-2 h-4 w-4"/> Export PDF</Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}><FileText className="mr-2 h-4 w-4"/> Export Excel</Button>
        </div>
      </div>
      <Table>
        <thead><tr><Th>Candidate Name</Th><Th>Position</Th><Th>Decision</Th><Th>Date</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {decisions.map((d, i) => (
            <tr key={i}>
              <Td>{d.candidateName}</Td>
              <Td>{d.position}</Td>
              <Td>
                <Badge className={d.notes === 'Approve' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {d.notes}
                </Badge>
              </Td>
              <Td>{new Date(d.decisionDate).toLocaleDateString()}</Td>
              <Td>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                    <MoreVertical className="h-4 w-4"/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleUpdateDecision(d.id, d.notes === 'Approve' ? 'Reject' : 'Approve')}>
                      <Edit3 className="mr-2 h-4 w-4"/> Change to {d.notes === 'Approve' ? 'Reject' : 'Approve'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteDecision(d.id)}>
                      <Trash2 className="mr-2 h-4 w-4"/> Delete Decision
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function Reports() {
  const [reports, setReports] = useState<any>(null);
  const hmId = getUserId();

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getReports(hmId).then(setReports).catch(console.error);
    }
  }, []);

  if (!reports) return <DashboardLayout role="hiring-manager"><Header title="Reports & Analytics" subtitle="Loading..."/></DashboardLayout>;

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Reports & Analytics" subtitle="Hiring funnel, candidate status, interview success, and department hiring trends."/>
      <Toolbar>
        <Select><SelectTrigger className="w-52 bg-secondary border-border text-foreground"><SelectValue placeholder="Department Filter"/></SelectTrigger><SelectContent><SelectItem value="eng">Engineering</SelectItem></SelectContent></Select>
        <Button>Export PDF</Button><Button variant="outline">Export Excel</Button>
      </Toolbar>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Open Positions" value={reports.openPositions} icon={Briefcase}/>
        <StatCard title="Candidates Reviewed" value={reports.candidatesReviewed} icon={Users}/>
        <StatCard title="Interviews Conducted" value={reports.interviewsConducted} icon={Calendar}/>
        <StatCard title="Decisions Made" value={reports.decisionsMade} icon={CheckCircle2}/>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-foreground text-xl font-semibold mb-4">Department Hiring Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={reports.funnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D"/><XAxis dataKey="name" stroke="#999"/><YAxis stroke="#999"/><Tooltip/>
              <Line dataKey="value" stroke="#D4AF37" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-foreground text-xl font-semibold mb-4">Candidate Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={reports.sources} dataKey="value" outerRadius={90} label>
                {reports.sources.map((s: any) => <Cell key={s.name} fill={s.color}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
export function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const hmId = getUserId();

  useEffect(() => {
    if (hmId) {
      api.hiringManager.getTeam(hmId).then(setTeam).catch(console.error);
    }
  }, []);

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="Team" subtitle="Collaborate with recruiters and team members, assign recruiters, and review performance."/>
      <Table>
        <thead><tr><Th>Team Member Name</Th><Th>Designation</Th><Th>Department</Th><Th>Performance Score</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {team.map((t, i) => (
            <tr key={i}>
              <Td><button className="text-foreground hover:text-[#D4AF37]">{t.name}</button></Td>
              <Td>{t.designation || "Recruiter"}</Td>
              <Td>{t.department || "Talent Acquisition"}</Td>
              <Td>{t.performanceScore}%</Td>
              <Td>
                <Button size="sm" variant="outline">Assign Recruiter</Button>
                <Button size="sm" className="ml-2">View Performance</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}
export function HMMessages() {
  return (
    <DashboardLayout role="hiring-manager">
      <MessagesView roleName="hiring-manager" />
    </DashboardLayout>
  );
}
export function HMNotifications() {
  return (
    <DashboardLayout role="hiring-manager">
      <NotificationsView />
    </DashboardLayout>
  );
}
export function HMSuite() { return <HMSuiteView />; }
export function HMSettings(){return <DashboardLayout role="hiring-manager"><Header title="Settings" subtitle="Account, notification, theme, and security settings."/><Tabs defaultValue="account"><TabsList className="bg-card border border-border mb-5"><TabsTrigger value="account">Account & Security</TabsTrigger><TabsTrigger value="notifications">Notification Settings</TabsTrigger><TabsTrigger value="theme">Theme Settings</TabsTrigger></TabsList><TabsContent value="account"><AccountSettingsView /></TabsContent><TabsContent value="notifications"><GlassCard className="p-6">{['Interview alerts','Decision reminders','Team messages'].map(x=><div key={x} className="flex justify-between py-3 border-b border-border"><span className="text-gray-300">{x}</span><Switch defaultChecked/></div>)}<Button className="mt-4">Save Changes</Button></GlassCard></TabsContent><TabsContent value="theme"><GlassCard className="p-6"><p className="text-foreground">Theme Selector: Premium Black & Gold</p><Button className="mt-4">Save Changes</Button></GlassCard></TabsContent></Tabs></DashboardLayout>}



















