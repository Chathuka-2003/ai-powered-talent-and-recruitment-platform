import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  MapPin,
  Star,
  ArrowRight,
  Search,
  Calendar,
  Briefcase,
  CheckCircle,
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

interface Job {
  id: number;
  title: string;
  department: string;
  slots: number;
  posted: string;
  location: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    slots: 2,
    posted: "Jun 10, 2026",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    title: "Product Manager – Growth",
    department: "Product",
    slots: 1,
    posted: "Jun 08, 2026",
    location: "New York, NY",
  },
  {
    id: 3,
    title: "ML Research Scientist",
    department: "AI Research",
    slots: 3,
    posted: "Jun 05, 2026",
    location: "Remote",
  },
  {
    id: 4,
    title: "Head of Design",
    department: "Design",
    slots: 1,
    posted: "Jun 01, 2026",
    location: "Austin, TX",
  },
];

interface Candidate {
  name: string;
  currentRole: string;
  location: string;
  matchScore: number;
  breakdown: {
    skills: number;
    experience: number;
    culturalFit: number;
    location: number;
  };
}

const matchesByJob: Record<number, Candidate[]> = {
  1: [
    {
      name: "Priya Sharma",
      currentRole: "Staff Engineer @ Google",
      location: "Mountain View, CA",
      matchScore: 97,
      breakdown: { skills: 98, experience: 95, culturalFit: 97, location: 100 },
    },
    {
      name: "Alexandra Chen",
      currentRole: "Senior Engineer @ Stripe",
      location: "San Francisco, CA",
      matchScore: 94,
      breakdown: { skills: 94, experience: 92, culturalFit: 91, location: 100 },
    },
    {
      name: "Marcus Williams",
      currentRole: "Tech Lead @ Airbnb",
      location: "San Francisco, CA",
      matchScore: 89,
      breakdown: { skills: 88, experience: 87, culturalFit: 91, location: 100 },
    },
    {
      name: "James Park",
      currentRole: "Senior Engineer @ Netflix",
      location: "Los Gatos, CA",
      matchScore: 85,
      breakdown: { skills: 91, experience: 84, culturalFit: 82, location: 90 },
    },
    {
      name: "Elena Vasquez",
      currentRole: "Software Engineer @ Meta",
      location: "Menlo Park, CA",
      matchScore: 82,
      breakdown: { skills: 86, experience: 78, culturalFit: 85, location: 95 },
    },
  ],
  2: [
    {
      name: "Sofia Martinez",
      currentRole: "Senior PM @ Shopify",
      location: "New York, NY",
      matchScore: 96,
      breakdown: { skills: 95, experience: 97, culturalFit: 96, location: 100 },
    },
    {
      name: "David Kim",
      currentRole: "Product Lead @ Twitter",
      location: "New York, NY",
      matchScore: 91,
      breakdown: { skills: 90, experience: 93, culturalFit: 89, location: 100 },
    },
    {
      name: "Rachel Torres",
      currentRole: "PM @ HubSpot",
      location: "Boston, MA",
      matchScore: 83,
      breakdown: { skills: 84, experience: 82, culturalFit: 87, location: 70 },
    },
    {
      name: "Noah Johnson",
      currentRole: "Growth PM @ Figma",
      location: "San Francisco, CA",
      matchScore: 79,
      breakdown: { skills: 82, experience: 76, culturalFit: 81, location: 60 },
    },
    {
      name: "Aisha Patel",
      currentRole: "Associate PM @ Salesforce",
      location: "New York, NY",
      matchScore: 74,
      breakdown: { skills: 72, experience: 71, culturalFit: 83, location: 100 },
    },
  ],
  3: [
    {
      name: "Dr. Wei Zhang",
      currentRole: "Research Scientist @ OpenAI",
      location: "Remote",
      matchScore: 99,
      breakdown: { skills: 99, experience: 98, culturalFit: 99, location: 100 },
    },
    {
      name: "Ravi Menon",
      currentRole: "ML Engineer @ DeepMind",
      location: "Remote",
      matchScore: 95,
      breakdown: { skills: 97, experience: 92, culturalFit: 94, location: 100 },
    },
    {
      name: "Laura Becker",
      currentRole: "AI Researcher @ Anthropic",
      location: "San Francisco, CA",
      matchScore: 92,
      breakdown: { skills: 96, experience: 89, culturalFit: 91, location: 95 },
    },
    {
      name: "Carlos Reyes",
      currentRole: "ML Scientist @ Apple",
      location: "Cupertino, CA",
      matchScore: 87,
      breakdown: { skills: 90, experience: 85, culturalFit: 84, location: 90 },
    },
    {
      name: "Yuki Tanaka",
      currentRole: "Senior Data Scientist @ Amazon",
      location: "Seattle, WA",
      matchScore: 83,
      breakdown: { skills: 88, experience: 81, culturalFit: 80, location: 85 },
    },
  ],
  4: [
    {
      name: "Isabella Rossi",
      currentRole: "Design Director @ Figma",
      location: "Austin, TX",
      matchScore: 98,
      breakdown: { skills: 99, experience: 97, culturalFit: 98, location: 100 },
    },
    {
      name: "Tyler Brooks",
      currentRole: "VP Design @ Canva",
      location: "Remote",
      matchScore: 91,
      breakdown: { skills: 93, experience: 95, culturalFit: 88, location: 85 },
    },
    {
      name: "Mia Nakamura",
      currentRole: "Principal Designer @ Apple",
      location: "Austin, TX",
      matchScore: 88,
      breakdown: { skills: 91, experience: 86, culturalFit: 87, location: 100 },
    },
    {
      name: "Omar Hassan",
      currentRole: "Design Lead @ Airbnb",
      location: "San Francisco, CA",
      matchScore: 82,
      breakdown: { skills: 85, experience: 83, culturalFit: 81, location: 75 },
    },
    {
      name: "Grace Liu",
      currentRole: "Senior UX @ Spotify",
      location: "New York, NY",
      matchScore: 76,
      breakdown: { skills: 79, experience: 74, culturalFit: 80, location: 70 },
    },
  ],
};

const matchFactors = [
  {
    label: "Semantic Skill Matching",
    description: "NLP-powered comparison of candidate skills against job requirements, including inferred proficiencies.",
    icon: Target,
  },
  {
    label: "Experience Alignment",
    description: "Years of experience, industry relevance, and role progression scoring weighted by seniority level.",
    icon: Briefcase,
  },
  {
    label: "Location Preference",
    description: "Geo-proximity scoring with remote work preference detection and relocation willingness signals.",
    icon: MapPin,
  },
  {
    label: "Cultural Fit Indicators",
    description: "Company size, growth stage, and team signals inferred from candidate work history patterns.",
    icon: Star,
  },
];

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-foreground/60">{label}</span>
        <span className="text-xs text-[#D4AF37] font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/70 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function AIJobMatching() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]);
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  );
  const candidates = matchesByJob[selectedJob.id] ?? [];

  return (
    <ModuleLayout
      title="AI Job Matching"
      subtitle="Intelligent candidate-to-job compatibility scoring"
      icon={Target}
      tabs={aiTabs}
      backPath="/recruiter/dashboard"
      backLabel="Recruiter Portal"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Matches Generated", value: "12,847", icon: Target, sub: "All time" },
          { label: "Avg Match Accuracy", value: "96.2%", icon: CheckCircle, sub: "Validated placements" },
          { label: "Time Saved", value: "340 hrs/mo", icon: TrendingUp, sub: "vs. manual screening" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Job Selector */}
        <div>
          <GlassCard className="p-6 h-full">
            <h3 className="text-foreground font-semibold mb-4">Active Job Postings</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div className="space-y-2">
              {filteredJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedJob.id === job.id
                      ? "bg-[#D4AF37]/10 border-[#D4AF37]/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="font-medium text-foreground text-sm mb-1">{job.title}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs">
                      {job.department}
                    </Badge>
                    <span className="text-xs text-foreground/40 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {job.slots} slot{job.slots > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-foreground/40">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-foreground/30">
                    <Calendar className="w-3 h-3" /> {job.posted}
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Matched Candidates */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-foreground font-semibold">Top Matches</h3>
                <div className="text-xs text-foreground/40 mt-0.5">for {selectedJob.title}</div>
              </div>
              <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border">
                {candidates.length} matches
              </Badge>
            </div>
            <div className="space-y-4">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate.name}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-border transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank + Score */}
                    <div className="flex-shrink-0 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-border flex items-center justify-center">
                        <span className="text-[#D4AF37] font-bold text-lg">
                          {candidate.matchScore}
                        </span>
                      </div>
                      <div className="text-xs text-foreground/30 mt-1">#{index + 1}</div>
                    </div>

                    {/* Info + Bars */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-foreground font-semibold text-sm">{candidate.name}</div>
                          <div className="text-xs text-foreground/50">{candidate.currentRole}</div>
                          <div className="flex items-center gap-1 text-xs text-foreground/40 mt-0.5">
                            <MapPin className="w-3 h-3" /> {candidate.location}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-3 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 text-foreground/60 hover:text-foreground hover:bg-white/10"
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs h-7 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold"
                          >
                            Schedule
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <ScoreBar label="Skills" value={candidate.breakdown.skills} />
                        <ScoreBar label="Experience" value={candidate.breakdown.experience} />
                        <ScoreBar label="Cultural Fit" value={candidate.breakdown.culturalFit} />
                        <ScoreBar label="Location" value={candidate.breakdown.location} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Match Factors */}
      <GlassCard className="p-6">
        <h3 className="text-foreground font-semibold mb-5">Match Factors Explained</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {matchFactors.map((factor) => (
            <div
              key={factor.label}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 w-fit mb-3">
                <factor.icon className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1.5">{factor.label}</div>
              <div className="text-xs text-foreground/50 leading-relaxed">{factor.description}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </ModuleLayout>
  );
}
