import { useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  Bookmark, Building, MapPin, Search, Sparkles, DollarSign,
  Clock, Loader2, BookmarkCheck, ExternalLink, BriefcaseBusiness, RotateCcw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../api";
import { ApplyModal } from "../../components/ApplyModal";

function getUser() {
  try {
    const s = localStorage.getItem("talentai.user");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function JobSearch() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[]>([]);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [existingResume, setExistingResume] = useState<{ fileName: string; url: string } | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [applyingJob, setApplyingJob] = useState<any | null>(null); // job for modal

  // Search inputs
  const [titleInput, setTitleInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [jobType, setJobType] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");

  const [searchParams, setSearchParams] = useState({
    title: "", company: "", location: "", jobType: "all", experienceLevel: "all", salaryRange: "all",
  });

  const fetchJobs = useCallback(async (params: typeof searchParams) => {
    setLoading(true);
    try {
      const salaryFilters: Record<string, number | undefined> = {};
      if (params.salaryRange === "0-100") salaryFilters.maxSalary = 100000;
      if (params.salaryRange === "100-200") { salaryFilters.minSalary = 100000; salaryFilters.maxSalary = 200000; }
      if (params.salaryRange === "200+") salaryFilters.minSalary = 200000;

      const data = await api.jobs.getAll({
        title: params.title || undefined,
        location: params.location || undefined,
        employmentType: params.jobType !== "all" ? params.jobType : undefined,
        ...salaryFilters,
      });

      let filtered = (data || []).filter((job: any) => {
        const companyMatch = !params.company ||
          (job.organization?.name || "").toLowerCase().includes(params.company.toLowerCase());
        let expMatch = true;
        if (params.experienceLevel !== "all") {
          const t = (job.title || "").toLowerCase();
          if (params.experienceLevel === "entry") expMatch = t.includes("entry") || t.includes("junior") || t.includes("associate");
          if (params.experienceLevel === "mid") expMatch = !t.includes("senior") && !t.includes("lead") && !t.includes("principal") && !t.includes("entry") && !t.includes("junior");
          if (params.experienceLevel === "senior") expMatch = t.includes("senior") || t.includes("lead") || t.includes("principal") || t.includes("staff");
        }
        return companyMatch && expMatch;
      });

      setJobs(filtered);
    } catch (err) {
      console.error("Error loading jobs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = getUser();
      if (user?.id) {
        try {
          const candidate = await api.candidates.getByUserId(user.id).catch(() => null);
          if (candidate) {
            setCandidateId(candidate.id);
            if (candidate.suggestedSkills) {
              try { setCandidateSkills(JSON.parse(candidate.suggestedSkills)); } catch { }
            }
            if (candidate.resumeFileName) {
              setExistingResume({ fileName: candidate.resumeFileName, url: candidate.resumeUrl || "" });
            }
            // Load applied and saved from backend
            const [apps, saved] = await Promise.allSettled([
              api.applications.getByCandidate(candidate.id),
              api.savedJobs.getByCandidate(candidate.id),
            ]);
            if (apps.status === "fulfilled") {
              setAppliedJobIds(new Set((apps.value as any[]).map((a: any) => a.job?.id).filter(Boolean)));
            }
            if (saved.status === "fulfilled") {
              setSavedJobIds(new Set((saved.value as any[]).map((s: any) => s.job?.id).filter(Boolean)));
            }
          }
        } catch { }
      }
      fetchJobs(searchParams);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    const params = { title: titleInput, company: companyInput, location: locationInput, jobType, experienceLevel, salaryRange };
    setSearchParams(params);
    fetchJobs(params);
  };

  const handleReset = () => {
    setTitleInput(""); setCompanyInput(""); setLocationInput("");
    setJobType("all"); setExperienceLevel("all"); setSalaryRange("all");
    const reset = { title: "", company: "", location: "", jobType: "all", experienceLevel: "all", salaryRange: "all" };
    setSearchParams(reset);
    fetchJobs(reset);
  };

  const calculateMatchRate = (job: any): number => {
    if (!candidateSkills.length) return 0;
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const hits = candidateSkills.filter(s => jobText.includes(s.toLowerCase())).length;
    return Math.min(98, Math.round((hits / candidateSkills.length) * 100));
  };

  const handleSave = async (job: any) => {
    if (!candidateId) { navigate("/jobseeker/login"); return; }
    setSavingId(job.id);
    try {
      if (savedJobIds.has(job.id)) {
        await api.savedJobs.unsave(candidateId, job.id);
        setSavedJobIds(prev => { const n = new Set(prev); n.delete(job.id); return n; });
      } else {
        await api.savedJobs.save(candidateId, job.id);
        setSavedJobIds(prev => new Set([...prev, job.id]));
      }
    } catch (err: any) {
      if (!err.message?.includes("already saved")) {
        console.error("Save failed:", err);
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleApplied = (resumeUploaded: boolean) => {
    if (applyingJob) {
      setAppliedJobIds(prev => new Set([...prev, applyingJob.id]));
      if (resumeUploaded) {
        // refresh candidate data to get new resume info
        const user = getUser();
        if (user?.id) {
          api.candidates.getByUserId(user.id).then(c => {
            if (c?.resumeFileName) setExistingResume({ fileName: c.resumeFileName, url: c.resumeUrl || "" });
          }).catch(() => {});
        }
      }
    }
    setApplyingJob(null);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  const getEmploymentBadgeColor = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("full")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (t.includes("part")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (t.includes("contract")) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (t.includes("intern")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-secondary text-gray-300 border-border";
  };

  const hasActiveFilters = searchParams.title || searchParams.company || searchParams.location ||
    searchParams.jobType !== "all" || searchParams.experienceLevel !== "all" || searchParams.salaryRange !== "all";

  return (
    <DashboardLayout role="jobseeker">
      {/* Apply Modal */}
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
        <div>
          <p className="text-sm text-[#D4AF37]">Dashboard / Job Search</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Job Search</h1>
          <p className="text-muted-foreground mt-1">Search premium opportunities with AI-assisted matching and advanced filters.</p>
        </div>

        {/* Search Panel */}
        <GlassCard className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Job title or keyword" className="bg-secondary border-border text-foreground pl-9"
                value={titleInput} onChange={(e) => setTitleInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            </div>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Company name" className="bg-secondary border-border text-foreground pl-9"
                value={companyInput} onChange={(e) => setCompanyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="City, state or remote" className="bg-secondary border-border text-foreground pl-9"
                value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <BriefcaseBusiness className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level / Junior</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior / Lead</SelectItem>
              </SelectContent>
            </Select>
            <Select value={salaryRange} onValueChange={setSalaryRange}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Salary</SelectItem>
                <SelectItem value="0-100">Under $100k</SelectItem>
                <SelectItem value="100-200">$100k – $200k</SelectItem>
                <SelectItem value="200+">$200k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <Button onClick={handleSearch} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search Jobs
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleReset} className="text-muted-foreground border-border">
                <RotateCcw className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Results */}
        <div className="grid xl:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? "Searching..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
              </p>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {searchParams.title && <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border">{searchParams.title}</Badge>}
                  {searchParams.location && <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border">{searchParams.location}</Badge>}
                  {searchParams.jobType !== "all" && <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border">{searchParams.jobType}</Badge>}
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <GlassCard key={i} className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-secondary rounded w-2/3" />
                      <div className="h-4 bg-secondary rounded w-1/3" />
                      <div className="h-4 bg-secondary rounded w-1/2" />
                      <div className="h-16 bg-secondary rounded" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-foreground font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or clearing them.</p>
                <Button variant="outline" onClick={handleReset} className="border-border">
                  <RotateCcw className="mr-2 h-4 w-4" /> Show all jobs
                </Button>
              </GlassCard>
            ) : (
              jobs.map((job) => {
                const matchRate = calculateMatchRate(job);
                const isApplied = appliedJobIds.has(job.id);
                const isSaved = savedJobIds.has(job.id);
                const isSaving = savingId === job.id;

                return (
                  <GlassCard key={job.id} className="p-6 hover:border-[#D4AF37]/30 transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-2">
                          <h3
                            className="text-xl font-semibold text-foreground cursor-pointer hover:text-[#D4AF37] transition-colors"
                            onClick={() => navigate(`/jobseeker/job-details/${job.id}`)}
                          >
                            {job.title}
                          </h3>
                          {isApplied && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">✓ Applied</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-300 mb-3">
                          <Building className="h-4 w-4 text-[#D4AF37] shrink-0" />
                          <span className="font-medium">{job.organization?.name || "Organization"}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location || "Remote"}</span>
                          {job.employmentType && (
                            <Badge className={`text-xs border ${getEmploymentBadgeColor(job.employmentType)}`}>{job.employmentType}</Badge>
                          )}
                          {job.minimumSalary > 0 && (
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <DollarSign className="h-3.5 w-3.5" />
                              {formatCurrency(job.minimumSalary)} – {formatCurrency(job.maximumSalary)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{job.description}</p>
                      </div>

                      {matchRate > 0 && (
                        <div className="shrink-0 flex flex-col items-center gap-1">
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
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Sparkles className="h-3 w-3" /> AI Match
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-border">
                      <Button
                        onClick={() => navigate(`/jobseeker/job-details/${job.id}`)}
                        className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> View Details
                      </Button>
                      <Button
                        variant="outline"
                        className={`border-border ${isApplied ? "text-emerald-400 border-emerald-500/30 cursor-default" : "hover:border-[#D4AF37]/50"}`}
                        disabled={isApplied}
                        onClick={() => !isApplied && setApplyingJob(job)}
                      >
                        {isApplied ? "✓ Applied" : "Apply Now"}
                      </Button>
                      <Button
                        variant="outline"
                        disabled={isSaving}
                        className={`border-border ${isSaved ? "text-[#D4AF37] border-[#D4AF37]/40" : "text-muted-foreground hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"}`}
                        onClick={() => handleSave(job)}
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isSaved ? (
                          <BookmarkCheck className="mr-2 h-4 w-4" />
                        ) : (
                          <Bookmark className="mr-2 h-4 w-4" />
                        )}
                        {isSaved ? "Saved" : "Save Job"}
                      </Button>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">


            <GlassCard className="p-5">
              <h2 className="text-base font-semibold text-foreground mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-border text-gray-300 justify-start hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  onClick={() => navigate("/jobseeker/saved-jobs")}>
                  <Bookmark className="mr-2 h-4 w-4" /> View Saved Jobs
                  {savedJobIds.size > 0 && <Badge className="ml-auto bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs">{savedJobIds.size}</Badge>}
                </Button>
                <Button variant="outline" className="w-full border-border text-gray-300 justify-start hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  onClick={() => navigate("/jobseeker/applications")}>
                  <BriefcaseBusiness className="mr-2 h-4 w-4" /> My Applications
                  {appliedJobIds.size > 0 && <Badge className="ml-auto bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs">{appliedJobIds.size}</Badge>}
                </Button>
                <Button variant="outline" className="w-full border-border text-gray-300 justify-start hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  onClick={() => navigate("/jobseeker/resume")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {existingResume ? "Edit CV" : "Upload CV"}
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
