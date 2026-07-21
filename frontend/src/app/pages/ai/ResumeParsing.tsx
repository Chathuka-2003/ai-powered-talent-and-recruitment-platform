import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Target,
  TrendingUp,
  BarChart3,
  Upload,
  CheckCircle,
  Zap,
  Clock,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
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

const pipelineSteps = [
  { label: "Upload", icon: Upload, description: "File received" },
  { label: "Extract", icon: FileText, description: "Text extraction" },
  { label: "Parse", icon: Zap, description: "NLP processing" },
  { label: "Analyze", icon: TrendingUp, description: "Skill mapping" },
  { label: "Score", icon: CheckCircle, description: "Match scoring" },
];

type ParseStatus = "Processed" | "Processing" | "Failed";

interface ParsedResume {
  id: number;
  name: string;
  uploadDate: string;
  fileType: string;
  skillsExtracted: number;
  experienceYears: number;
  matchScore: number;
  status: ParseStatus;
}

const parsedResumes: ParsedResume[] = [
  {
    id: 1,
    name: "Alexandra Chen",
    uploadDate: "2026-06-17",
    fileType: "PDF",
    skillsExtracted: 24,
    experienceYears: 8,
    matchScore: 94,
    status: "Processed",
  },
  {
    id: 2,
    name: "Marcus Williams",
    uploadDate: "2026-06-17",
    fileType: "DOCX",
    skillsExtracted: 19,
    experienceYears: 5,
    matchScore: 88,
    status: "Processed",
  },
  {
    id: 3,
    name: "Priya Sharma",
    uploadDate: "2026-06-17",
    fileType: "PDF",
    skillsExtracted: 31,
    experienceYears: 11,
    matchScore: 97,
    status: "Processed",
  },
  {
    id: 4,
    name: "James O'Brien",
    uploadDate: "2026-06-17",
    fileType: "DOC",
    skillsExtracted: 0,
    experienceYears: 0,
    matchScore: 0,
    status: "Processing",
  },
  {
    id: 5,
    name: "Sofia Martinez",
    uploadDate: "2026-06-16",
    fileType: "PDF",
    skillsExtracted: 0,
    experienceYears: 6,
    matchScore: 0,
    status: "Failed",
  },
];

const detailCandidate = {
  name: "Alexandra Chen",
  email: "a.chen@email.com",
  phone: "+1 (415) 555-0192",
  location: "San Francisco, CA",
  confidence: 98.3,
  skills: [
    "React", "TypeScript", "Node.js", "Python", "AWS", "Docker",
    "GraphQL", "PostgreSQL", "Machine Learning", "System Design",
    "Team Leadership", "Agile", "CI/CD", "Kubernetes",
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Stripe",
      period: "2022 – Present",
      years: 4,
    },
    {
      role: "Software Engineer",
      company: "Airbnb",
      period: "2019 – 2022",
      years: 3,
    },
    {
      role: "Junior Developer",
      company: "TechStart Inc.",
      period: "2018 – 2019",
      years: 1,
    },
  ],
  education: [
    { degree: "M.S. Computer Science", school: "Stanford University", year: "2018" },
    { degree: "B.S. Computer Science", school: "UC Berkeley", year: "2016" },
  ],
};

const statusConfig: Record<ParseStatus, { color: string; icon: React.ReactNode }> = {
  Processed: {
    color: "text-emerald-400",
    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  },
  Processing: {
    color: "text-blue-400",
    icon: <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />,
  },
  Failed: {
    color: "text-red-400",
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
  },
};

export function AIResumeParsing() {
  const navigate = useNavigate();
  const [selectedResume, setSelectedResume] = useState<ParsedResume>(parsedResumes[0]);
  const [dragOver, setDragOver] = useState(false);

  return (
    <ModuleLayout
      title="AI Resume Parsing"
      subtitle="Intelligent resume analysis and data extraction"
      icon={FileText}
      tabs={aiTabs}
      backPath="/recruiter/dashboard"
      backLabel="Recruiter Portal"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Resumes Parsed Today", value: "47", icon: FileText, sub: "+12 from yesterday" },
          { label: "Accuracy Rate", value: "98.3%", icon: CheckCircle, sub: "Industry avg: 91%" },
          { label: "Avg Parse Time", value: "2.1s", icon: Clock, sub: "Per document" },
          { label: "Queue Size", value: "3", icon: Upload, sub: "In processing" },
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

      {/* Upload Zone */}
      <GlassCard className="p-6 mb-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-[#D4AF37] bg-[#D4AF37]/5"
              : "border-white/20 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-[#D4AF37]/10">
              <Upload className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-foreground font-semibold text-lg mb-1">
                Drop resume files here or click to upload
              </div>
              <div className="text-foreground/50 text-sm">
                Supports PDF, DOCX, DOC — up to 10MB per file
              </div>
            </div>
            <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold px-6">
              Browse Files
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Processing Pipeline */}
      <GlassCard className="p-6 mb-6">
        <h3 className="text-foreground font-semibold mb-5">Processing Pipeline</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {pipelineSteps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-border">
                  <step.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-foreground">{step.label}</div>
                  <div className="text-xs text-foreground/40">{step.description}</div>
                </div>
              </div>
              {index < pipelineSteps.length - 1 && (
                <div className="flex-1 min-w-8 h-px bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/10 mb-5" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Main content: table + detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recently Parsed Table */}
        <div className="xl:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-foreground font-semibold mb-5">Recently Parsed Resumes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Candidate", "Date", "Type", "Skills", "Exp (yrs)", "Match", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-foreground/50 font-medium pb-3 pr-4 text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      )
                    )}
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {parsedResumes.map((resume) => {
                    const status = statusConfig[resume.status];
                    return (
                      <tr
                        key={resume.id}
                        onClick={() => resume.status === "Processed" && setSelectedResume(resume)}
                        className={`border-b border-white/5 transition-colors cursor-pointer ${
                          selectedResume.id === resume.id
                            ? "bg-[#D4AF37]/5"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <td className="py-3 pr-4">
                          <span className="text-foreground font-medium">{resume.name}</span>
                        </td>
                        <td className="py-3 pr-4 text-foreground/60">{resume.uploadDate}</td>
                        <td className="py-3 pr-4">
                          <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs">
                            {resume.fileType}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-foreground/80">
                          {resume.skillsExtracted > 0 ? resume.skillsExtracted : "—"}
                        </td>
                        <td className="py-3 pr-4 text-foreground/80">
                          {resume.experienceYears > 0 ? resume.experienceYears : "—"}
                        </td>
                        <td className="py-3 pr-4">
                          {resume.matchScore > 0 ? (
                            <span className="text-[#D4AF37] font-semibold">
                              {resume.matchScore}%
                            </span>
                          ) : (
                            <span className="text-foreground/30">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <div className={`flex items-center gap-1.5 ${status.color}`}>
                            {status.icon}
                            <span className="text-xs">{resume.status}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          {resume.status === "Processed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedResume(resume);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Detail Panel */}
        <div>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground font-semibold">Parsed Details</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{detailCandidate.confidence}% confidence</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-5 p-3 rounded-lg bg-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-medium text-foreground">{detailCandidate.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                {detailCandidate.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                {detailCandidate.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {detailCandidate.location}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-semibold text-foreground/80">Extracted Skills</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detailCandidate.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-[#D4AF37]/10 text-[#D4AF37] border-border text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-semibold text-foreground/80">Work Experience</span>
              </div>
              <div className="relative pl-4 border-l border-border space-y-3">
                {detailCandidate.experience.map((exp) => (
                  <div key={exp.company}>
                    <div className="text-xs font-semibold text-foreground">{exp.role}</div>
                    <div className="text-xs text-[#D4AF37]">{exp.company}</div>
                    <div className="text-xs text-foreground/40">{exp.period}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-semibold text-foreground/80">Education</span>
              </div>
              <div className="space-y-2">
                {detailCandidate.education.map((edu) => (
                  <div key={edu.school}>
                    <div className="text-xs font-semibold text-foreground">{edu.degree}</div>
                    <div className="text-xs text-[#D4AF37]">
                      {edu.school} · {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </ModuleLayout>
  );
}
