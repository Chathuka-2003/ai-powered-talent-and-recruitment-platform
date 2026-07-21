import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Sparkles, BrainCircuit, UserCheck, MessageCircle, FileText, CheckCircle } from "lucide-react";
import { api } from "../../api";
import { AIOutputRenderer } from "../../components/AIOutputRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

function Header({title,subtitle}:{title:string;subtitle:string}){return <div className="mb-6"><p className="text-sm text-[#D4AF37]">Recruiter / {title}</p><h1 className="mt-2 text-3xl font-semibold text-foreground">{title}</h1><p className="text-muted-foreground max-w-3xl">{subtitle}</p></div>}

export function RecruiterAISuiteView() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

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
      let res;
      if (activeModule === "AI Candidate Matching") {
        if (!selectedCandidate || !selectedJob) throw new Error("Select both candidate and job");
        res = await api.ai.suiteGenerate("ai-candidate-matching", selectedCandidate, selectedJob);
      } else if (activeModule === "Resume Screening") {
        if (!selectedCandidate) throw new Error("Select a candidate");
        res = await api.ai.suiteGenerate("resume-analyzer", selectedCandidate);
      } else if (activeModule === "Candidate Ranking") {
        if (!selectedJob) throw new Error("Select a job");
        let rankedRes = await api.ai.hmCandidateRanking(selectedJob, candidates.map(c => c.id));
        
        // Ensure it's parsed if it's a string
        if (typeof rankedRes === "string") {
          try {
            const cleanStr = rankedRes.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
            rankedRes = JSON.parse(cleanStr);
          } catch (e) {
            console.error("Failed to parse ranking response", e);
          }
        }
        
        if (Array.isArray(rankedRes)) {
          res = rankedRes.map((r: any) => {
            const c = candidates.find(can => can.id === r.candidateId);
            const name = c && c.user ? `${c.user.firstName} ${c.user.lastName}` : r.candidateId;
            return {
              "Candidate": name,
              "Rank": r.rank,
              "Score": `${r.score}%`,
              "Reasoning": r.reason
            };
          });
        } else {
          res = rankedRes;
        }
      } else if (activeModule === "Interview Question Generation") {
        if (!selectedCandidate || !selectedJob) throw new Error("Select both candidate and job");
        res = await api.ai.suiteGenerate("interview-preparation", selectedCandidate, selectedJob);
      } else if (activeModule === "Candidate Summaries") {
        if (!selectedCandidate) throw new Error("Select a candidate");
        res = await api.ai.suiteGenerate("candidate-summaries", selectedCandidate);
      }
      setResult(res);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderModuleForm = () => {
    const needsJob = activeModule === "AI Candidate Matching" || activeModule === "Candidate Ranking" || activeModule === "Interview Question Generation";
    const needsCandidate = activeModule !== "Candidate Ranking";

    return (
      <div className="space-y-4">
        {needsJob && (
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
        )}
        {needsCandidate && (
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
    { name: 'AI Candidate Matching', icon: CheckCircle, desc: 'Evaluate match score between a candidate and job.' },
    { name: 'Resume Screening', icon: UserCheck, desc: 'Detailed analysis of a candidate resume.' },
    { name: 'Candidate Ranking', icon: BrainCircuit, desc: 'Rank all candidates against a specific job.' },
    { name: 'Interview Question Generation', icon: MessageCircle, desc: 'Generate questions tailored to the candidate and job.' },
    { name: 'Candidate Summaries', icon: FileText, desc: 'Generate an executive summary of a candidate.' },
  ];

  return (
    <DashboardLayout role="recruiter">
      <Header title="AI Suite" subtitle="Empower your recruitment process with AI-driven candidate insights and rankings."/>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5">
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
            <Button className="mt-6 w-full" onClick={handleExecute} disabled={loading}>
              {loading ? "Processing AI..." : "Generate Insights"}
            </Button>
            {renderResult()}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
