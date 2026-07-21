import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Sparkles, TrendingUp, BookOpen, FileText, Target, Brain,
  ChevronRight, Loader2, RefreshCw, AlertCircle, CheckCircle2,
  XCircle, Zap, Award, ArrowRight, Building, MapPin, DollarSign,
} from "lucide-react";
import { api } from "../../api";

function getUser() {
  try { return JSON.parse(localStorage.getItem("talentai.user") || "null"); }
  catch { return null; }
}

// ─── Radial Progress Chart ────────────────────────────────────────────────────
function RadialChart({ value, size = 120, stroke = 10, label, sublabel, color = "#D4AF37" }: {
  value: number; size?: number; stroke?: number;
  label?: string; sublabel?: string; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  const dash = (animated / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a2e" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={`${circ}`}
            strokeDashoffset={circ - dash}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{animated}%</span>
        </div>
      </div>
      {label && <p className="text-sm font-semibold text-foreground text-center">{label}</p>}
      {sublabel && <p className="text-xs text-muted-foreground text-center">{sublabel}</p>}
    </div>
  );
}

// ─── Skill Bar Chart ──────────────────────────────────────────────────────────
function SkillBar({ label, score, color = "#D4AF37" }: { label: string; score: number; color?: string }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 300); return () => clearTimeout(t); }, [score]);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${animated}%`, backgroundColor: color, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>
      <span className="text-xs font-bold w-9 shrink-0" style={{ color }}>{score}%</span>
    </div>
  );
}

// ─── Spider / Radar Mini ──────────────────────────────────────────────────────
function RadarChart({ data }: { data: { category: string; score: number }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 75;
  const n = data.length;

  const pts = (scale: number) =>
    data.map((_, i) => {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
      return { x: cx + scale * r * Math.cos(angle), y: cy + scale * r * Math.sin(angle) };
    });

  const gridPts = (scale: number) => pts(scale).map(p => `${p.x},${p.y}`).join(" ");
  const valuePts = pts(1).map((p, i) => {
    const scale = (data[i]?.score ?? 0) / 100;
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return { x: cx + scale * r * Math.cos(angle), y: cy + scale * r * Math.sin(angle) };
  });
  const valuePolyline = valuePts.map(p => `${p.x},${p.y}`).join(" ");

  const labelPts = pts(1.28);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={gridPts(s)} fill="none" stroke="#2d2d2d" strokeWidth="1" />
      ))}
      {/* Axes */}
      {pts(1).map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2d2d2d" strokeWidth="1" />
      ))}
      {/* Data polygon */}
      <polygon points={valuePolyline} fill="#D4AF37" fillOpacity="0.2" stroke="#D4AF37" strokeWidth="2" />
      {/* Dots */}
      {valuePts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#D4AF37" />
      ))}
      {/* Labels */}
      {labelPts.map((p, i) => (
        <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#9ca3af">
          {data[i]?.category}
        </text>
      ))}
    </svg>
  );
}

// ─── Match Color Helper ───────────────────────────────────────────────────────
function matchColor(pct: number) {
  if (pct >= 80) return "#22c55e";
  if (pct >= 60) return "#D4AF37";
  if (pct >= 40) return "#f97316";
  return "#ef4444";
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const p = (priority || "").toLowerCase();
  if (p === "high") return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">High Priority</Badge>;
  if (p === "medium") return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">Medium</Badge>;
  return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Low</Badge>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AIRecommendations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"matches" | "skills" | "career" | "resume">("matches");

  const runAnalysis = useCallback(async (cid: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.ai.analyzeProfile(cid);
      setData(result);
    } catch (err: any) {
      setError(err.message || "AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = getUser();
      if (!user?.id) return;
      const candidate = await api.candidates.ensure(user.id).catch(() => null);
      if (candidate) {
        setCandidateId(candidate.id);
        setCandidateName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      }
    };
    init();
  }, []);

  const jobMatches: any[] = data?.jobMatches ?? [];
  const skillBreakdown: any[] = data?.skillBreakdown ?? [];
  const learningRecs: any[] = data?.learningRecommendations ?? [];
  const careerSuggestions: string[] = data?.careerSuggestions ?? [];
  const profileStrengths: string[] = data?.profileStrengths ?? [];
  const profileWeaknesses: string[] = data?.profileWeaknesses ?? [];
  const resumeImprovements: string[] = data?.resumeImprovements ?? [];
  const profileScore: number = data?.overallProfileScore ?? 0;

  const tabs = [
    { id: "matches", label: "Job Matches", icon: Target, count: jobMatches.length },
    { id: "skills", label: "Skill Analysis", icon: Brain },
    { id: "career", label: "Career Path", icon: TrendingUp, count: careerSuggestions.length },
    { id: "resume", label: "Resume Tips", icon: FileText, count: resumeImprovements.length },
  ] as const;

  return (
    <DashboardLayout role="jobseeker">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#D4AF37]">Dashboard / AI Recommendations</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground flex items-center gap-3">
              <Brain className="h-8 w-8 text-[#D4AF37]" />
              AI Career Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">
              Powered by Gemini AI — real-time profile analysis, job matching & career coaching.
            </p>
          </div>
          {candidateId && (
            <Button
              onClick={() => runAnalysis(candidateId)}
              disabled={loading}
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analysing...</>
              ) : data ? (
                <><RefreshCw className="mr-2 h-4 w-4" />Re-analyse</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Run AI Analysis</>
              )}
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <GlassCard className="p-5 border-red-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
              {candidateId && (
                <Button size="sm" variant="outline" onClick={() => runAnalysis(candidateId)} className="ml-auto border-red-500/30 text-red-400">
                  Retry
                </Button>
              )}
            </div>
          </GlassCard>
        )}

        {/* Loading */}
        {loading && (
          <GlassCard className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#D4AF37]/20 animate-pulse" />
                <Brain className="absolute inset-0 m-auto h-8 w-8 text-[#D4AF37] animate-bounce" />
              </div>
              <h3 className="text-foreground font-semibold text-lg">Gemini AI is analysing your profile...</h3>
              <div className="space-y-1 text-sm text-muted-foreground max-w-sm">
                <p>Reading your skills, headline & resume score</p>
                <p>Matching against all available jobs</p>
                <p>Generating personalised career insights</p>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#D4AF37]"
                    style={{ animation: `bounce 1.2s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* CTA — no data yet */}
        {!loading && !data && !error && candidateId && (
          <GlassCard className="p-10 text-center border-[#D4AF37]/20">
            <Sparkles className="h-14 w-14 text-[#D4AF37] mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Meet your AI Career Advisor</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              One click — Gemini reads your full profile and matches you against every job in our database with percentage scores, charts, and personalised tips.
            </p>
            <Button onClick={() => runAnalysis(candidateId!)}
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold px-8 py-6 text-base">
              <Brain className="mr-2 h-5 w-5" /> Analyse My Profile Now
            </Button>
          </GlassCard>
        )}

        {/* No candidate */}
        {!loading && !candidateId && (
          <GlassCard className="p-10 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-foreground font-semibold mb-2">Please log in to use AI features</h3>
            <Button onClick={() => navigate("/login")} className="bg-[#D4AF37] text-black">Go to Login</Button>
          </GlassCard>
        )}

        {/* ── Results ── */}
        {!loading && data && (
          <>
            {/* Overview row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard className="p-5 flex flex-col items-center gap-2 border-[#D4AF37]/20">
                <RadialChart value={profileScore} size={100} stroke={8} color="#D4AF37" />
                <p className="text-xs text-muted-foreground font-medium">Overall Profile Score</p>
              </GlassCard>
              <GlassCard className="p-5 flex flex-col items-center gap-2 border-emerald-500/20">
                <RadialChart value={jobMatches.length > 0 ? Math.round(jobMatches.reduce((s: number, j: any) => s + (j.matchPercentage ?? 0), 0) / jobMatches.length) : 0}
                  size={100} stroke={8} color="#22c55e" />
                <p className="text-xs text-muted-foreground font-medium">Avg Job Match</p>
              </GlassCard>
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-foreground">Strengths</span>
                </div>
                <div className="space-y-1">
                  {profileStrengths.slice(0, 3).map((s, i) => (
                    <p key={i} className="text-xs text-gray-400">• {s}</p>
                  ))}
                </div>
              </GlassCard>
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">Growth Areas</span>
                </div>
                <div className="space-y-1">
                  {profileWeaknesses.slice(0, 3).map((w, i) => (
                    <p key={i} className="text-xs text-gray-400">• {w}</p>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border w-fit flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active ? "bg-[#D4AF37] text-black shadow" : "text-muted-foreground hover:text-foreground"
                    }`}>
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {"count" in tab && (tab as any).count > 0 && (
                      <span className={`text-xs rounded-full px-1.5 py-0.5 ${active ? "bg-black/20" : "bg-[#D4AF37]/20 text-[#D4AF37]"}`}>
                        {(tab as any).count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Tab: Job Matches ── */}
            {activeTab === "matches" && (
              <div className="grid xl:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-4">
                  {jobMatches.length === 0 ? (
                    <GlassCard className="p-8 text-center">
                      <p className="text-muted-foreground">No job matches returned. Try re-analysing.</p>
                    </GlassCard>
                  ) : (
                    jobMatches
                      .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage)
                      .map((match: any, i: number) => {
                        const pct = match.matchPercentage ?? 0;
                        const color = matchColor(pct);
                        return (
                          <GlassCard key={i} className="p-6 hover:border-[#D4AF37]/30 transition-all">
                            <div className="flex items-start gap-5">
                              {/* Radial */}
                              <div className="shrink-0">
                                <RadialChart value={pct} size={80} stroke={7} color={color} />
                                <p className="text-xs text-muted-foreground text-center mt-1">Match</p>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h3
                                    className="text-lg font-semibold text-foreground cursor-pointer hover:text-[#D4AF37]"
                                    onClick={() => match.jobId && navigate(`/jobseeker/job-details/${match.jobId}`)}
                                  >
                                    {match.jobTitle}
                                  </h3>
                                  {i === 0 && <Badge className="bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30 text-xs"><Award className="h-3 w-3 mr-1" />Best Match</Badge>}
                                  {pct >= 80 && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Strong Fit</Badge>}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                                  {match.company && <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />{match.company}</span>}
                                  {match.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{match.location}</span>}
                                  {match.salaryEstimate && <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="h-3.5 w-3.5" />{match.salaryEstimate}</span>}
                                </div>

                                {match.whyGoodFit && (
                                  <p className="text-sm text-gray-400 mb-3 italic">"{match.whyGoodFit}"</p>
                                )}

                                <div className="flex flex-wrap gap-2 mb-2">
                                  {(match.matchedSkills ?? []).map((s: string) => (
                                    <Badge key={s} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">✓ {s}</Badge>
                                  ))}
                                  {(match.missingSkills ?? []).map((s: string) => (
                                    <Badge key={s} className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">✗ {s}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Match strength</span>
                                <span style={{ color }}>{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000"
                                  style={{ width: `${pct}%`, backgroundColor: color }} />
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              {match.jobId && (
                                <Button size="sm" onClick={() => navigate(`/jobseeker/job-details/${match.jobId}`)}
                                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
                                  View Job <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </GlassCard>
                        );
                      })
                  )}
                </div>

                {/* Sidebar: Radar */}
                {skillBreakdown.length > 0 && (
                  <div className="space-y-4">
                    <GlassCard className="p-5">
                      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-[#D4AF37]" /> Skill Radar
                      </h3>
                      <RadarChart data={skillBreakdown.map((s: any) => ({ category: s.category, score: s.score }))} />
                    </GlassCard>
                    <GlassCard className="p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Top Skills by Category</h3>
                      <div className="space-y-3">
                        {skillBreakdown.map((s: any, i: number) => (
                          <SkillBar key={i} label={s.category} score={s.score}
                            color={s.score >= 70 ? "#22c55e" : s.score >= 40 ? "#D4AF37" : "#ef4444"} />
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Skill Analysis ── */}
            {activeTab === "skills" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#D4AF37]" /> Skill Breakdown
                  </h2>
                  {skillBreakdown.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No skill data available.</p>
                  ) : (
                    <div className="space-y-4">
                      {skillBreakdown.map((s: any, i: number) => (
                        <SkillBar key={i} label={s.category} score={s.score}
                          color={s.score >= 70 ? "#22c55e" : s.score >= 40 ? "#D4AF37" : "#ef4444"} />
                      ))}
                    </div>
                  )}
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#D4AF37]" /> Radar Overview
                  </h2>
                  {skillBreakdown.length > 0
                    ? <RadarChart data={skillBreakdown.map((s: any) => ({ category: s.category, score: s.score }))} />
                    : <p className="text-muted-foreground text-sm">No data.</p>}
                </GlassCard>

                <GlassCard className="p-6 lg:col-span-2">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#D4AF37]" /> Learning Recommendations
                  </h2>
                  {learningRecs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No learning recommendations yet.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {learningRecs.map((rec: any, i: number) => (
                        <div key={i} className="rounded-xl bg-secondary/50 border border-border p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-foreground font-semibold">{rec.skill}</h4>
                            <PriorityBadge priority={rec.priority} />
                          </div>
                          <p className="text-sm text-gray-400">{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>
            )}

            {/* ── Tab: Career Path ── */}
            {activeTab === "career" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#D4AF37]" /> Career Suggestions
                  </h2>
                  {careerSuggestions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No suggestions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {careerSuggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 border border-border p-4">
                          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Strengths
                  </h2>
                  <div className="space-y-2 mb-6">
                    {profileStrengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> {s}
                      </div>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-amber-400" /> Growth Areas
                  </h2>
                  <div className="space-y-2">
                    {profileWeaknesses.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <ChevronRight className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" /> {w}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* ── Tab: Resume Tips ── */}
            {activeTab === "resume" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#D4AF37]" /> Resume Improvements
                  </h2>
                  {resumeImprovements.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No suggestions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {resumeImprovements.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 border border-border p-4">
                          <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-300">{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-5">
                    <Button variant="outline" onClick={() => navigate("/jobseeker/resume")}
                      className="border-border text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/40">
                      <FileText className="mr-2 h-4 w-4" /> Update My Resume
                    </Button>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#D4AF37]" /> Learning Priorities
                  </h2>
                  <div className="space-y-3">
                    {learningRecs.map((rec: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-secondary/50 border border-border p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{rec.skill}</p>
                          <p className="text-xs text-muted-foreground">{rec.reason}</p>
                        </div>
                        <PriorityBadge priority={rec.priority} />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </DashboardLayout>
  );
}
