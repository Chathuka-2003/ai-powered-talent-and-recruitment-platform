import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Sparkles, FileText, Briefcase, Search, MessageSquare, Compass, Activity } from "lucide-react";
import { api } from "../../api";
import { AIOutputRenderer } from "../../components/AIOutputRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

function Header({title,subtitle}:{title:string;subtitle:string}){return <div className="mb-6"><p className="text-sm text-[#D4AF37]">Job Seeker / {title}</p><h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1><p className="text-muted-foreground max-w-3xl">{subtitle}</p></div>}

export function JobseekerAISuiteView() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = localStorage.getItem("talentai.user");
        if (stored) {
          const user = JSON.parse(stored);
          const c = await api.candidates.ensure(user.id);
          if (c && c.id) {
            setCandidateId(c.id);
          }
        }
        const j = await api.jobs.getAll();
        setJobs(j);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleExecute = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (!candidateId) throw new Error("Candidate profile not found. Please complete your profile.");

      let res;
      if (activeModule === "Resume Analyzer") {
        res = await api.ai.suiteGenerate("resume-analyzer", candidateId);
      } else if (activeModule === "CV Improvement") {
        res = await api.ai.suiteGenerate("cv-improvement", candidateId);
      } else if (activeModule === "AI Job Recommendations") {
        res = await api.ai.suiteGenerate("ai-job-recommendations", candidateId);
      } else if (activeModule === "Interview Preparation") {
        res = await api.ai.suiteGenerate("interview-preparation", candidateId);
      } else if (activeModule === "Skill Gap Analysis") {
        if (!selectedJob) throw new Error("Please select a target job.");
        res = await api.ai.suiteGenerate("skill-gap-analysis", candidateId, selectedJob);
      } else if (activeModule === "Career Suggestions") {
        res = await api.ai.suiteGenerate("career-suggestions", candidateId);
      }
      setResult(res);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderModuleForm = () => {
    if (activeModule === "Skill Gap Analysis") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Select Target Job</label>
            <select 
              className="w-full bg-secondary border border-border rounded-md p-2 text-foreground"
              value={selectedJob} 
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="">-- Choose Job --</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
        </div>
      );
    }
    
    return <p className="text-muted-foreground text-sm">This module uses your existing profile and resume to generate insights.</p>;
  };

  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className="mt-6 p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-lg max-h-[50vh] overflow-y-auto">
        <h3 className="font-semibold text-[#D4AF37] mb-4">AI Output</h3>
        <AIOutputRenderer data={result} />
      </div>
    );
  };

  const modules = [
    { name: 'Resume Analyzer', icon: Search, desc: 'Analyze your resume against industry standards.' },
    { name: 'CV Improvement', icon: FileText, desc: 'Get actionable suggestions to improve your CV.' },
    { name: 'AI Job Recommendations', icon: Briefcase, desc: 'Find the best job matches for your profile.' },
    { name: 'Interview Preparation', icon: MessageSquare, desc: 'Generate customized interview prep material.' },
    { name: 'Skill Gap Analysis', icon: Activity, desc: 'Compare your skills against a specific job.' },
    { name: 'Career Suggestions', icon: Compass, desc: 'Explore long-term career progression paths.' },
  ];

  return (
    <DashboardLayout role="jobseeker">
      <Header title="AI Suite" subtitle="Your personal AI career advisor. Optimize your resume, find jobs, and prepare for interviews."/>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <GlassCard key={m.name} className="p-6">
              <Icon className="text-[#D4AF37] h-8 w-8 mb-3"/>
              <h2 className="text-foreground font-semibold text-xl">{m.name}</h2>
              <p className="text-muted-foreground mt-2">{m.desc}</p>
              <Button className="mt-5 w-full" onClick={() => { setActiveModule(m.name); setResult(null); }}>
                Open Module
              </Button>
            </GlassCard>
          );
        })}
      </div>

      <Dialog open={!!activeModule} onOpenChange={(open) => !open && setActiveModule(null)}>
        <DialogContent className="sm:max-w-[700px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-[#D4AF37] text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {activeModule}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {renderModuleForm()}
            
            <Button 
              className="mt-6 w-full" 
              onClick={handleExecute}
              disabled={loading || !candidateId}
            >
              {loading ? "Processing AI..." : "Generate Insights"}
            </Button>
            
            {renderResult()}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
