import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Bookmark, MapPin, DollarSign, Building, Sparkles, Clock,
  Trash2, ExternalLink, Loader2, Search, BriefcaseBusiness,
} from "lucide-react";
import { api } from "../../api";
import { ApplyModal } from "../../components/ApplyModal";

function getUser() {
  try { return JSON.parse(localStorage.getItem("talentai.user") || "null"); }
  catch { return null; }
}

export function SavedJobs() {
  const navigate = useNavigate();
  const [savedEntries, setSavedEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [existingResume, setExistingResume] = useState<{ fileName: string; url: string } | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [applyingJob, setApplyingJob] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const user = getUser();
        if (!user?.id) { setLoading(false); return; }

        const candidate = await api.candidates.getByUserId(user.id).catch(() => null);
        if (!candidate) { setLoading(false); return; }

        setCandidateId(candidate.id);
        if (candidate.suggestedSkills) {
          try { setCandidateSkills(JSON.parse(candidate.suggestedSkills)); } catch { }
        }
        if (candidate.resumeFileName) {
          setExistingResume({ fileName: candidate.resumeFileName, url: candidate.resumeUrl || "" });
        }

        // Load saved jobs and applied jobs from backend in parallel
        const [savedRes, appsRes] = await Promise.allSettled([
          api.savedJobs.getByCandidate(candidate.id),
          api.applications.getByCandidate(candidate.id),
        ]);

        if (savedRes.status === "fulfilled") setSavedEntries(savedRes.value as any[]);
        if (appsRes.status === "fulfilled") {
          setAppliedJobIds(new Set((appsRes.value as any[]).map((a: any) => a.job?.id).filter(Boolean)));
        }
      } catch (err) {
        console.error("Error loading saved jobs", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const calculateMatchRate = (job: any): number => {
    if (!candidateSkills.length) return 0;
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const hits = candidateSkills.filter(s => jobText.includes(s.toLowerCase())).length;
    return Math.min(98, Math.round((hits / candidateSkills.length) * 100));
  };

  const handleRemove = async (entry: any) => {
    if (!candidateId) return;
    setRemovingId(entry.savedJobId);
    try {
      await api.savedJobs.unsave(candidateId, entry.job.id);
      setSavedEntries(prev => prev.filter(e => e.savedJobId !== entry.savedJobId));
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleApplied = () => {
    if (applyingJob) setAppliedJobIds(prev => new Set([...prev, applyingJob.id]));
    setApplyingJob(null);
  };

  const filters = ["All", "Full-Time", "Part-Time", "Contract", "Internship"];
  const visible = savedEntries.filter(entry => {
    if (activeFilter === "All") return true;
    return (entry.job?.employmentType || "").toLowerCase().includes(activeFilter.toLowerCase());
  });

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  return (
    <DashboardLayout role="jobseeker">
      {applyingJob && candidateId && (
        <ApplyModal
          job={applyingJob}
          candidateId={candidateId}
          existingResume={existingResume}
          onClose={() => setApplyingJob(null)}
          onApplied={handleApplied}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#D4AF37]">Dashboard / Saved Jobs</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Saved Jobs</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? "Loading..." : `${savedEntries.length} saved position${savedEntries.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button onClick={() => navigate("/jobseeker/jobs")} className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
            <Search className="w-4 h-4 mr-2" /> Browse More Jobs
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-[#D4AF37] text-black"
                  : "bg-secondary text-gray-300 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] border border-border"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <GlassCard key={i} className="p-6">
                <div className="animate-pulse flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-secondary rounded w-2/3" />
                    <div className="h-4 bg-secondary rounded w-1/3" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : savedEntries.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-foreground font-semibold mb-2">No Saved Jobs Yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Browse jobs and click "Save Job" to bookmark them here.</p>
            <Button onClick={() => navigate("/jobseeker/jobs")} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
              <Search className="mr-2 h-4 w-4" /> Find Jobs
            </Button>
          </GlassCard>
        ) : visible.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-muted-foreground">No saved jobs match this filter.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {visible.map(entry => {
              const job = entry.job;
              const matchRate = calculateMatchRate(job);
              const isApplied = appliedJobIds.has(job.id);
              const isRemoving = removingId === entry.savedJobId;

              return (
                <GlassCard key={entry.savedJobId} className="p-6 hover:border-[#D4AF37]/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Company avatar */}
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-lg shrink-0">
                        {(job.organization?.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className="text-foreground font-semibold text-lg cursor-pointer hover:text-[#D4AF37] transition-colors"
                            onClick={() => navigate(`/jobseeker/job-details/${job.id}`)}
                          >
                            {job.title}
                          </h3>
                          {isApplied && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">✓ Applied</Badge>
                          )}
                          {matchRate > 0 && (
                            <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />{matchRate}% match
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Building className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-gray-300 text-sm">{job.organization?.name || "Organization"}</span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="w-3.5 h-3.5" />{job.location || "Remote"}
                          </span>
                          {job.minimumSalary > 0 && (
                            <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                              <DollarSign className="w-3.5 h-3.5" />
                              {formatCurrency(job.minimumSalary)} – {formatCurrency(job.maximumSalary)}
                            </span>
                          )}
                          {job.employmentType && (
                            <Badge className="bg-secondary text-gray-300 border-border text-xs">{job.employmentType}</Badge>
                          )}
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            Saved {new Date(entry.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match ring */}
                    {matchRate > 0 && (
                      <div className="flex flex-col items-center shrink-0">
                        <div className="relative w-14 h-14">
                          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="#2D2D2D" strokeWidth="4" />
                            <circle cx="28" cy="28" r="24" fill="none" stroke="#D4AF37" strokeWidth="4"
                              strokeDasharray={`${(matchRate / 100) * 150.8} 150.8`} strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                            {matchRate}%
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">AI Match</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
                    <Button onClick={() => navigate(`/jobseeker/job-details/${job.id}`)}
                      className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90">
                      <ExternalLink className="w-4 h-4 mr-2" /> View Details
                    </Button>
                    <Button variant="outline"
                      disabled={isApplied}
                      className={`border-border ${isApplied ? "text-emerald-400 border-emerald-500/30 cursor-default" : "text-gray-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"}`}
                      onClick={() => !isApplied && setApplyingJob(job)}>
                      <BriefcaseBusiness className="w-4 h-4 mr-2" />
                      {isApplied ? "Applied" : "Apply Now"}
                    </Button>
                    <Button variant="outline" disabled={isRemoving}
                      className="border-border text-gray-300 hover:border-red-500/40 hover:text-red-400"
                      onClick={() => handleRemove(entry)}>
                      {isRemoving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      Remove
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
