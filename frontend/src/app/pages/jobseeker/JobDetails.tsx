import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ApplyModal } from "../../components/ApplyModal";
import {
  Building, MapPin, DollarSign, Clock, Bookmark, BookmarkCheck,
  ArrowLeft, Sparkles, BriefcaseBusiness, Loader2, CalendarDays, FileEdit,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../api";

function getUser() {
  try {
    const s = localStorage.getItem("talentai.user");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [existingResume, setExistingResume] = useState<{ fileName: string; url: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!id) return;
    const init = async () => {
      setLoading(true);
      try {
        const jobData = await api.jobs.getById(id);
        setJob(jobData);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }

      const user = getUser();
      if (user?.id) {
        const candidate = await api.candidates.getByUserId(user.id).catch(() => null);
        if (candidate) {
          setCandidateId(candidate.id);
          if (candidate.suggestedSkills) {
            try { setCandidateSkills(JSON.parse(candidate.suggestedSkills)); } catch { }
          }
          if (candidate.resumeFileName) {
            setExistingResume({ fileName: candidate.resumeFileName, url: candidate.resumeUrl || "" });
          }
          const [checkApp, checkSaved] = await Promise.allSettled([
            api.applications.check(candidate.id, id),
            api.savedJobs.check(candidate.id, id),
          ]);
          if (checkApp.status === "fulfilled") setIsApplied(checkApp.value.applied);
          if (checkSaved.status === "fulfilled") setIsSaved(checkSaved.value.saved);
        }
      }
    };
    init();
  }, [id]);

  const calculateMatchRate = (): number => {
    if (!job || !candidateSkills.length) return 0;
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const hits = candidateSkills.filter(s => jobText.includes(s.toLowerCase())).length;
    return Math.min(98, Math.round((hits / candidateSkills.length) * 100));
  };

  const handleApply = () => {
    if (!candidateId) { navigate("/jobseeker/login"); return; }
    if (isApplied) return;
    setShowApplyModal(true);
  };

  const handleSave = async () => {
    if (!candidateId || !id) return;
    try {
      if (isSaved) {
        await api.savedJobs.unsave(candidateId, id);
        setIsSaved(false);
        showToast("Job removed from saved list.");
      } else {
        await api.savedJobs.save(candidateId, id);
        setIsSaved(true);
        showToast("Job saved! View in Saved Jobs.");
      }
    } catch (err: any) {
      if (!err.message?.includes("already saved")) showToast("Could not update saved status.");
    }
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const matchRate = calculateMatchRate();

  if (loading) return (
    <DashboardLayout role="jobseeker">
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3" />
          <GlassCard className="p-8">
            <div className="space-y-3">
              <div className="h-7 bg-secondary rounded w-2/3" />
              <div className="h-5 bg-secondary rounded w-1/3" />
              <div className="h-32 bg-secondary rounded" />
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );

  if (notFound || !job) return (
    <DashboardLayout role="jobseeker">
      <GlassCard className="p-12 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">This job listing may have expired or been removed.</p>
        <Button onClick={() => navigate("/jobseeker/jobs")} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
      </GlassCard>
    </DashboardLayout>
  );

  const descParagraphs = (job.description || "").split(/\n+/).filter(Boolean);

  return (
    <DashboardLayout role="jobseeker">
      {/* Apply Modal */}
      {showApplyModal && job && candidateId && (
        <ApplyModal
          job={job}
          candidateId={candidateId}
          existingResume={existingResume}
          onClose={() => setShowApplyModal(false)}
          onApplied={() => { setIsApplied(true); setShowApplyModal(false); showToast("Application submitted! 🎉"); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#D4AF37] text-black font-semibold rounded-xl px-5 py-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {toast}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <p className="text-sm text-muted-foreground">
            <span className="text-[#D4AF37]">Job Search</span> / Job Details
          </p>
        </div>

        <div className="grid xl:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <div className="space-y-5">
            <GlassCard className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">{job.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-300 mb-3">
                    <Building className="h-4 w-4 text-[#D4AF37]" />
                    <span className="font-medium text-lg">{job.organization?.name || "Organization"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location || "Remote"}</span>
                    {job.employmentType && (
                      <span className="flex items-center gap-1">
                        <BriefcaseBusiness className="h-4 w-4" />
                        {job.employmentType}
                      </span>
                    )}
                    {job.minimumSalary > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(job.minimumSalary)} – {formatCurrency(job.maximumSalary)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    {job.expiryDate && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Clock className="h-4 w-4" />
                        Expires {new Date(job.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
                {matchRate > 0 && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#2D2D2D" strokeWidth="4" />
                        <circle
                          cx="32" cy="32" r="28" fill="none"
                          stroke="#D4AF37" strokeWidth="4"
                          strokeDasharray={`${(matchRate / 100) * 175.9} 175.9`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#D4AF37]">
                        {matchRate}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3 text-[#D4AF37]" /> AI Match
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pb-6 border-b border-border mb-6">
                <Button
                  onClick={handleApply}
                  disabled={isApplied}
                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold px-8"
                >
                  {isApplied ? "✓ Application Submitted" : "Apply Now"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className={`border-border ${isSaved ? "text-[#D4AF37] border-[#D4AF37]/40" : "text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37]/40"}`}
                >
                  {isSaved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
                {existingResume && (
                  <Button variant="outline" onClick={() => navigate("/jobseeker/resume")}
                    className="border-border text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37]/40">
                    <FileEdit className="mr-2 h-4 w-4" /> Edit CV
                  </Button>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Job Description</h2>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  {descParagraphs.length > 0 ? (
                    descParagraphs.map((para: string, i: number) => <p key={i}>{para}</p>)
                  ) : (
                    <p className="text-muted-foreground">No description provided for this role.</p>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <GlassCard className="p-5">
              <h2 className="text-base font-semibold text-foreground mb-4">Job Overview</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-muted-foreground text-xs">Company</dt>
                    <dd className="text-foreground font-medium">{job.organization?.name || "–"}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-muted-foreground text-xs">Location</dt>
                    <dd className="text-foreground font-medium">{job.location || "Remote"}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-muted-foreground text-xs">Employment Type</dt>
                    <dd className="text-foreground font-medium">{job.employmentType || "–"}</dd>
                  </div>
                </div>
                {job.minimumSalary > 0 && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Salary Range</dt>
                      <dd className="text-emerald-400 font-medium">
                        {formatCurrency(job.minimumSalary)} – {formatCurrency(job.maximumSalary)}
                      </dd>
                    </div>
                  </div>
                )}
                {job.applicationCount > 0 && (
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Applicants</dt>
                      <dd className="text-foreground font-medium">{job.applicationCount} applied</dd>
                    </div>
                  </div>
                )}
              </dl>
            </GlassCard>

            {candidateSkills.length > 0 && (
              <GlassCard className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                  Your Matching Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidateSkills.map(skill => {
                    const jobText = `${job.title} ${job.description}`.toLowerCase();
                    const isMatch = jobText.includes(skill.toLowerCase());
                    return (
                      <Badge
                        key={skill}
                        className={isMatch
                          ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30"
                          : "bg-secondary text-muted-foreground border-border"}
                      >
                        {skill}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Golden = matched skills. Grey = not found in job description.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
