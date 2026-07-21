import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  Award,
  Users,
  Star,
  Trophy,
  MapPin,
  ChevronDown,
  ChevronUp,
  GitCompare,
  Bookmark,
  Eye,
} from "lucide-react";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

const aiTabs = [
  { label: "Resume Parsing", path: "/ai/resume-parsing", icon: FileText },
  { label: "Job Matching", path: "/ai/job-matching", icon: Target },
  { label: "Candidate Ranking", path: "/ai/candidate-ranking", icon: TrendingUp },
  { label: "AI Analytics", path: "/ai/analytics", icon: BarChart3 },
];

const positions = [
  "Senior Full-Stack Engineer",
  "Product Manager – Growth",
  "ML Research Scientist",
  "Head of Design",
];

interface RankedCandidate {
  rank: number;
  name: string;
  headline: string;
  location: string;
  compositeScore: number;
  scores: {
    technicalSkills: number;
    communication: number;
    leadership: number;
    culturalFit: number;
    domainKnowledge: number;
  };
  shortlisted?: boolean;
}

const candidatesByPosition: Record<string, RankedCandidate[]> = {
  "Senior Full-Stack Engineer": [
    {
      rank: 1, name: "Priya Sharma", headline: "Staff Engineer @ Google · 11 yrs",
      location: "Mountain View, CA", compositeScore: 97,
      scores: { technicalSkills: 99, communication: 93, leadership: 95, culturalFit: 97, domainKnowledge: 98 },
      shortlisted: true,
    },
    {
      rank: 2, name: "Alexandra Chen", headline: "Senior Engineer @ Stripe · 8 yrs",
      location: "San Francisco, CA", compositeScore: 94,
      scores: { technicalSkills: 96, communication: 91, leadership: 88, culturalFit: 93, domainKnowledge: 95 },
      shortlisted: true,
    },
    {
      rank: 3, name: "Marcus Williams", headline: "Tech Lead @ Airbnb · 5 yrs",
      location: "San Francisco, CA", compositeScore: 89,
      scores: { technicalSkills: 90, communication: 87, leadership: 86, culturalFit: 89, domainKnowledge: 91 },
    },
    {
      rank: 4, name: "James Park", headline: "Senior Engineer @ Netflix · 7 yrs",
      location: "Los Gatos, CA", compositeScore: 85,
      scores: { technicalSkills: 88, communication: 82, leadership: 79, culturalFit: 84, domainKnowledge: 87 },
    },
    {
      rank: 5, name: "Elena Vasquez", headline: "Software Engineer @ Meta · 4 yrs",
      location: "Menlo Park, CA", compositeScore: 82,
      scores: { technicalSkills: 85, communication: 80, leadership: 74, culturalFit: 82, domainKnowledge: 84 },
    },
    {
      rank: 6, name: "David Liu", headline: "Full-Stack Dev @ Uber · 6 yrs",
      location: "San Francisco, CA", compositeScore: 78,
      scores: { technicalSkills: 81, communication: 77, leadership: 72, culturalFit: 78, domainKnowledge: 79 },
    },
    {
      rank: 7, name: "Aria Johnson", headline: "Engineer @ Twilio · 3 yrs",
      location: "Remote", compositeScore: 74,
      scores: { technicalSkills: 77, communication: 75, leadership: 65, culturalFit: 76, domainKnowledge: 73 },
    },
    {
      rank: 8, name: "Ben Carter", headline: "Software Dev @ Zoom · 2 yrs",
      location: "San Jose, CA", compositeScore: 69,
      scores: { technicalSkills: 72, communication: 70, leadership: 60, culturalFit: 68, domainKnowledge: 71 },
    },
  ],
  "Product Manager – Growth": [
    {
      rank: 1, name: "Sofia Martinez", headline: "Senior PM @ Shopify · 7 yrs",
      location: "New York, NY", compositeScore: 96,
      scores: { technicalSkills: 85, communication: 98, leadership: 96, culturalFit: 97, domainKnowledge: 95 },
      shortlisted: true,
    },
    {
      rank: 2, name: "David Kim", headline: "Product Lead @ Twitter · 9 yrs",
      location: "New York, NY", compositeScore: 91,
      scores: { technicalSkills: 80, communication: 94, leadership: 92, culturalFit: 90, domainKnowledge: 91 },
    },
    {
      rank: 3, name: "Rachel Torres", headline: "PM @ HubSpot · 5 yrs",
      location: "Boston, MA", compositeScore: 84,
      scores: { technicalSkills: 75, communication: 89, leadership: 83, culturalFit: 86, domainKnowledge: 84 },
    },
    {
      rank: 4, name: "Noah Johnson", headline: "Growth PM @ Figma · 4 yrs",
      location: "San Francisco, CA", compositeScore: 79,
      scores: { technicalSkills: 72, communication: 84, leadership: 77, culturalFit: 81, domainKnowledge: 78 },
    },
    {
      rank: 5, name: "Aisha Patel", headline: "Associate PM @ Salesforce · 2 yrs",
      location: "New York, NY", compositeScore: 72,
      scores: { technicalSkills: 65, communication: 80, leadership: 68, culturalFit: 78, domainKnowledge: 72 },
    },
    {
      rank: 6, name: "Ethan Moore", headline: "PM @ Atlassian · 3 yrs",
      location: "Remote", compositeScore: 68,
      scores: { technicalSkills: 62, communication: 75, leadership: 65, culturalFit: 71, domainKnowledge: 67 },
    },
    {
      rank: 7, name: "Lily Zhang", headline: "Junior PM @ Dropbox · 1 yr",
      location: "San Francisco, CA", compositeScore: 62,
      scores: { technicalSkills: 58, communication: 70, leadership: 58, culturalFit: 65, domainKnowledge: 63 },
    },
    {
      rank: 8, name: "Sam Ortega", headline: "Product Analyst @ Adobe · 2 yrs",
      location: "San Jose, CA", compositeScore: 57,
      scores: { technicalSkills: 55, communication: 66, leadership: 52, culturalFit: 60, domainKnowledge: 58 },
    },
  ],
  "ML Research Scientist": [
    {
      rank: 1, name: "Dr. Wei Zhang", headline: "Research Scientist @ OpenAI · 8 yrs",
      location: "Remote", compositeScore: 99,
      scores: { technicalSkills: 99, communication: 95, leadership: 97, culturalFit: 99, domainKnowledge: 99 },
      shortlisted: true,
    },
    {
      rank: 2, name: "Ravi Menon", headline: "ML Engineer @ DeepMind · 6 yrs",
      location: "Remote", compositeScore: 95,
      scores: { technicalSkills: 97, communication: 90, leadership: 91, culturalFit: 94, domainKnowledge: 98 },
    },
    {
      rank: 3, name: "Laura Becker", headline: "AI Researcher @ Anthropic · 4 yrs",
      location: "San Francisco, CA", compositeScore: 92,
      scores: { technicalSkills: 96, communication: 88, leadership: 85, culturalFit: 91, domainKnowledge: 97 },
    },
    {
      rank: 4, name: "Carlos Reyes", headline: "ML Scientist @ Apple · 5 yrs",
      location: "Cupertino, CA", compositeScore: 87,
      scores: { technicalSkills: 91, communication: 83, leadership: 81, culturalFit: 86, domainKnowledge: 93 },
    },
    {
      rank: 5, name: "Yuki Tanaka", headline: "Data Scientist @ Amazon · 4 yrs",
      location: "Seattle, WA", compositeScore: 82,
      scores: { technicalSkills: 87, communication: 78, leadership: 75, culturalFit: 81, domainKnowledge: 88 },
    },
    {
      rank: 6, name: "Fatima Al-Hassan", headline: "Research Engineer @ FAIR · 3 yrs",
      location: "Remote", compositeScore: 77,
      scores: { technicalSkills: 82, communication: 74, leadership: 70, culturalFit: 76, domainKnowledge: 84 },
    },
    {
      rank: 7, name: "Liam O'Connor", headline: "ML Engineer @ Tesla · 3 yrs",
      location: "Austin, TX", compositeScore: 71,
      scores: { technicalSkills: 76, communication: 69, leadership: 63, culturalFit: 70, domainKnowledge: 79 },
    },
    {
      rank: 8, name: "Nadia Kowalski", headline: "Data Engineer @ Microsoft · 2 yrs",
      location: "Seattle, WA", compositeScore: 65,
      scores: { technicalSkills: 70, communication: 63, leadership: 57, culturalFit: 64, domainKnowledge: 72 },
    },
  ],
  "Head of Design": [
    {
      rank: 1, name: "Isabella Rossi", headline: "Design Director @ Figma · 10 yrs",
      location: "Austin, TX", compositeScore: 98,
      scores: { technicalSkills: 97, communication: 98, leadership: 99, culturalFit: 98, domainKnowledge: 98 },
      shortlisted: true,
    },
    {
      rank: 2, name: "Tyler Brooks", headline: "VP Design @ Canva · 8 yrs",
      location: "Remote", compositeScore: 92,
      scores: { technicalSkills: 91, communication: 94, leadership: 95, culturalFit: 90, domainKnowledge: 93 },
    },
    {
      rank: 3, name: "Mia Nakamura", headline: "Principal Designer @ Apple · 7 yrs",
      location: "Austin, TX", compositeScore: 88,
      scores: { technicalSkills: 87, communication: 89, leadership: 86, culturalFit: 89, domainKnowledge: 90 },
    },
    {
      rank: 4, name: "Omar Hassan", headline: "Design Lead @ Airbnb · 6 yrs",
      location: "San Francisco, CA", compositeScore: 83,
      scores: { technicalSkills: 82, communication: 85, leadership: 81, culturalFit: 83, domainKnowledge: 86 },
    },
    {
      rank: 5, name: "Grace Liu", headline: "Senior UX @ Spotify · 5 yrs",
      location: "New York, NY", compositeScore: 77,
      scores: { technicalSkills: 76, communication: 80, leadership: 73, culturalFit: 78, domainKnowledge: 80 },
    },
    {
      rank: 6, name: "Felix Wagner", headline: "UI Designer @ Uber · 4 yrs",
      location: "Remote", compositeScore: 71,
      scores: { technicalSkills: 73, communication: 74, leadership: 66, culturalFit: 72, domainKnowledge: 74 },
    },
    {
      rank: 7, name: "Zara Ahmed", headline: "Product Designer @ HubSpot · 3 yrs",
      location: "Boston, MA", compositeScore: 65,
      scores: { technicalSkills: 67, communication: 69, leadership: 60, culturalFit: 65, domainKnowledge: 68 },
    },
    {
      rank: 8, name: "Chris Nguyen", headline: "UX Designer @ Dropbox · 2 yrs",
      location: "San Francisco, CA", compositeScore: 59,
      scores: { technicalSkills: 62, communication: 63, leadership: 53, culturalFit: 60, domainKnowledge: 62 },
    },
  ],
};

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-foreground/50 w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/60 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-foreground/60 w-8 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8961E] flex items-center justify-center shadow-lg">
          <Trophy className="w-5 h-5 text-black" />
        </div>
        <span className="text-xs text-[#D4AF37] font-bold mt-1">1st</span>
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] flex items-center justify-center shadow-lg">
          <Award className="w-5 h-5 text-black" />
        </div>
        <span className="text-xs text-foreground/70 font-bold mt-1">2nd</span>
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center shadow-lg">
          <Award className="w-5 h-5 text-black" />
        </div>
        <span className="text-xs text-orange-400 font-bold mt-1">3rd</span>
      </div>
    );
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <span className="text-foreground/70 font-bold text-sm">{rank}</span>
      </div>
      <span className="text-xs text-foreground/30 mt-1">#{rank}</span>
    </div>
  );
}

export function AICandidateRankingModule() {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState(positions[0]);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [compareSet, setCompareSet] = useState<Set<string>>(new Set());
  const [shortlisted, setShortlisted] = useState<Set<string>>(
    new Set(
      Object.values(candidatesByPosition)
        .flat()
        .filter((c) => c.shortlisted)
        .map((c) => c.name)
    )
  );

  const candidates = candidatesByPosition[selectedPosition] ?? [];

  function toggleCompare(name: string) {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < 2) {
        next.add(name);
      }
      return next;
    });
  }

  function toggleShortlist(name: string) {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const compareList = candidates.filter((c) => compareSet.has(c.name));
  const scoreKeys: (keyof RankedCandidate["scores"])[] = [
    "technicalSkills",
    "communication",
    "leadership",
    "culturalFit",
    "domainKnowledge",
  ];
  const scoreLabels: Record<keyof RankedCandidate["scores"], string> = {
    technicalSkills: "Technical Skills",
    communication: "Communication",
    leadership: "Leadership",
    culturalFit: "Cultural Fit",
    domainKnowledge: "Domain Knowledge",
  };

  return (
    <ModuleLayout
      title="AI Candidate Ranking"
      subtitle="Multi-dimensional candidate scoring and comparison"
      icon={TrendingUp}
      tabs={aiTabs}
      backPath="/recruiter/dashboard"
      backLabel="Recruiter Portal"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Candidates Ranked", value: "234", icon: Users, sub: "Current pipeline" },
          { label: "Shortlisted", value: "18", icon: Star, sub: "Across all positions" },
          { label: "Interview Rate (Top 10)", value: "92%", icon: Trophy, sub: "Historical accuracy" },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                <stat.icon className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-xs text-foreground/60 font-medium">{stat.label}</div>
            <div className="text-xs text-foreground/40 mt-1">{stat.sub}</div>
          </GlassCard>
        ))}
      </div>

      {/* Position Selector */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-foreground/60 font-medium">Position:</span>
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => { setSelectedPosition(pos); setCompareSet(new Set()); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedPosition === pos
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]"
                  : "bg-white/5 border-white/10 text-foreground/60 hover:text-foreground hover:bg-white/10"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Compare Mode Panel */}
      {compareSet.size === 2 && compareList.length === 2 && (
        <GlassCard className="p-6 mb-6 border border-border">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-foreground font-semibold flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-[#D4AF37]" /> Candidate Comparison
            </h3>
            <Button
              size="sm"
              variant="ghost"
              className="text-foreground/50 hover:text-foreground text-xs"
              onClick={() => setCompareSet(new Set())}
            >
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1" />
            {compareList.map((c) => (
              <div key={c.name} className="text-center">
                <div className="text-foreground font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-foreground/40 mb-2">{c.headline}</div>
                <div className="text-3xl font-bold text-[#D4AF37]">{c.compositeScore}</div>
                <div className="text-xs text-foreground/40">Composite</div>
              </div>
            ))}
            {scoreKeys.map((key) => (
              <>
                <div key={key + "-label"} className="flex items-center text-xs text-foreground/60">
                  {scoreLabels[key]}
                </div>
                {compareList.map((c) => {
                  const val = c.scores[key];
                  const other = compareList.find((x) => x.name !== c.name)!.scores[key];
                  const better = val >= other;
                  return (
                    <div key={c.name + key} className="flex flex-col items-center gap-1">
                      <div
                        className={`text-sm font-bold ${better ? "text-[#D4AF37]" : "text-foreground/50"}`}
                      >
                        {val}
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${better ? "bg-[#D4AF37]" : "bg-white/30"}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </GlassCard>
      )}

      {compareSet.size === 1 && (
        <div className="mb-4 p-3 rounded-lg bg-[#D4AF37]/10 border border-border text-sm text-[#D4AF37]">
          Select one more candidate to compare side-by-side.
        </div>
      )}

      {/* Ranked List */}
      <div className="space-y-3 mb-6">
        {candidates.map((candidate) => (
          <GlassCard key={candidate.name} className="p-5">
            <div className="flex items-start gap-4">
              <RankBadge rank={candidate.rank} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-foreground font-semibold">{candidate.name}</div>
                    <div className="text-xs text-foreground/50 mt-0.5">{candidate.headline}</div>
                    <div className="flex items-center gap-1 text-xs text-foreground/40 mt-0.5">
                      <MapPin className="w-3 h-3" /> {candidate.location}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-3xl font-bold text-[#D4AF37]">
                      {candidate.compositeScore}
                    </div>
                    <div className="text-xs text-foreground/40">Composite Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                  {scoreKeys.map((key) => (
                    <MiniBar
                      key={key}
                      label={scoreLabels[key]}
                      value={candidate.scores[key]}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7 text-foreground/60 hover:text-foreground hover:bg-white/10 gap-1"
                  >
                    <Eye className="w-3 h-3" /> View Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleCompare(candidate.name)}
                    className={`text-xs h-7 gap-1 ${
                      compareSet.has(candidate.name)
                        ? "text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20"
                        : "text-foreground/60 hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    <GitCompare className="w-3 h-3" /> Compare
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleShortlist(candidate.name)}
                    className={`text-xs h-7 gap-1 ${
                      shortlisted.has(candidate.name)
                        ? "text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20"
                        : "text-foreground/60 hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    {shortlisted.has(candidate.name) ? "Shortlisted" : "Shortlist"}
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Ranking Methodology */}
      <GlassCard className="p-6">
        <button
          onClick={() => setMethodologyOpen((v) => !v)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-foreground font-semibold">Ranking Methodology</span>
          </div>
          {methodologyOpen ? (
            <ChevronUp className="w-4 h-4 text-foreground/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-foreground/40" />
          )}
        </button>
        {methodologyOpen && (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-foreground/60 leading-relaxed">
              Our AI ranking engine uses a weighted multi-dimensional scoring model trained on
              thousands of successful placements. The composite score is calculated as follows:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: "Technical Skills", weight: "30%", desc: "Skill match depth and recency" },
                { label: "Domain Knowledge", weight: "25%", desc: "Industry and role-specific expertise" },
                { label: "Leadership", weight: "20%", desc: "Team lead signals and scope" },
                { label: "Communication", weight: "15%", desc: "Writing quality and presentation" },
                { label: "Cultural Fit", weight: "10%", desc: "Company size and values alignment" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-[#D4AF37] font-bold text-lg mb-1">{m.weight}</div>
                  <div className="text-foreground text-xs font-semibold mb-1">{m.label}</div>
                  <div className="text-foreground/40 text-xs">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </ModuleLayout>
  );
}
