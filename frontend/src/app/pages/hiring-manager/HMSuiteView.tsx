import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Sparkles, BrainCircuit, UserCheck, MessageCircle, FileText } from "lucide-react";
import { api } from "../../api";
import { AIOutputRenderer } from "../../components/AIOutputRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

function Header({title,subtitle}:{title:string;subtitle:string}){return <div className="mb-6"><p className="text-sm text-[#D4AF37]">Hiring Manager / {title}</p><h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1><p className="text-muted-foreground max-w-3xl">{subtitle}</p></div>}

export function HMSuiteView() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // For JD Generation
  const [jdTitle, setJdTitle] = useState("");
  const [jdKeywords, setJdKeywords] = useState("");
  const [jdExperience, setJdExperience] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = await api.candidates.getAll();
        const j = await api.jobs.getAll();
        setCandidates(c);
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
      if (activeModule === "Resume Screening") {
        if (!selectedCandidate || !selectedJob) throw new Error("Select both candidate and job");
        const res = await api.ai.hmResumeScreening(selectedCandidate, selectedJob);
        setResult(res);
      } else if (activeModule === "Candidate Ranking") {
        if (!selectedJob) throw new Error("Select a job");
        let rankedRes = await api.ai.hmCandidateRanking(selectedJob, candidates.map(c => c.id));
        
        if (typeof rankedRes === "string") {
          try {
            const cleanStr = rankedRes.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
            rankedRes = JSON.parse(cleanStr);
          } catch (e) {
            console.error("Failed to parse ranking response", e);
          }
        }
        
        let finalRes = rankedRes;
        if (Array.isArray(rankedRes)) {
          finalRes = rankedRes.map((r: any) => {
            const c = candidates.find(can => can.id === r.candidateId);
            const name = c && c.user ? `${c.user.firstName} ${c.user.lastName}` : r.candidateId;
            return {
              "Candidate": name,
              "Rank": r.rank,
              "Score": `${r.score}%`,
              "Reasoning": r.reason
            };
          });
        }
        setResult(finalRes);
      } else if (activeModule === "Generate Interview Questions") {
        if (!selectedCandidate || !selectedJob) throw new Error("Select both candidate and job");
        const res = await api.ai.hmInterviewQuestions(selectedCandidate, selectedJob);
        setResult(res);
      } else if (activeModule === "Generate Job Description") {
        if (!jdTitle) throw new Error("Job title is required");
        const res = await api.ai.hmGenerateJd(jdTitle, jdKeywords, jdExperience);
        setResult(res);
      } else if (activeModule === "Hiring Decision Insights") {
        if (!selectedCandidate || !selectedJob) throw new Error("Select both candidate and job");
        const res = await api.ai.suiteGenerate("hiring-decision-insights", selectedCandidate, selectedJob);
        setResult(res);
      } else if (activeModule === "Skill Comparison") {
        if (!selectedCandidate || !selectedJob) throw new Error("Select both candidate and job");
        const res = await api.ai.suiteGenerate("skill-comparison", selectedCandidate, selectedJob);
        setResult(res);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderModuleForm = () => {
    if (activeModule === "Generate Job Description") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Job Title</label>
            <Input className="bg-secondary border-border text-foreground" value={jdTitle} onChange={e => setJdTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Keywords / Skills (comma separated)</label>
            <Input className="bg-secondary border-border text-foreground" value={jdKeywords} onChange={e => setJdKeywords(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Experience Level</label>
            <Input className="bg-secondary border-border text-foreground" value={jdExperience} onChange={e => setJdExperience(e.target.value)} />
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Select Job</label>
          <select 
            className="w-full bg-secondary border border-border rounded-md p-2 text-foreground"
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="">-- Choose Job --</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
        {activeModule !== "Candidate Ranking" && (
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Select Candidate</label>
            <select 
              className="w-full bg-secondary border border-border rounded-md p-2 text-foreground"
              value={selectedCandidate} 
              onChange={(e) => setSelectedCandidate(e.target.value)}
            >
              <option value="">-- Choose Candidate --</option>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.user?.firstName} {c.user?.lastName}</option>)}
            </select>
          </div>
        )}
      </div>
    );
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
    { name: 'Resume Screening', icon: UserCheck, desc: 'Analyze candidates against jobs.' },
    { name: 'Candidate Ranking', icon: BrainCircuit, desc: 'Rank all candidates for a single job.' },
    { name: 'Generate Interview Questions', icon: MessageCircle, desc: 'Generate customized interview questions.' },
    { name: 'Generate Job Description', icon: FileText, desc: 'AI generated professional JD.' },
    { name: 'Hiring Decision Insights', icon: Sparkles, desc: 'Identify risks and rewards for a hire.' },
    { name: 'Skill Comparison', icon: Sparkles, desc: 'Compare candidate skills vs job requirements.' },
  ];

  return (
    <DashboardLayout role="hiring-manager">
      <Header title="AI Suite" subtitle="AI modules for resume screening, candidate ranking, interview questions, job descriptions, and hiring insights."/>
      
      <div className="grid md:grid-cols-2 gap-5">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <GlassCard key={m.name} className="p-6">
              <Icon className="text-[#D4AF37] h-8 w-8 mb-3"/>
              <h2 className="text-foreground font-semibold text-xl">{m.name}</h2>
              <p className="text-muted-foreground mt-2">{m.desc}</p>
              <Button className="mt-5" onClick={() => { setActiveModule(m.name); setResult(null); }}>
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
              disabled={loading}
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
