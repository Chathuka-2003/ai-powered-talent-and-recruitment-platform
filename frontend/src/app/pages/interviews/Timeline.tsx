import { useState } from "react";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  CalendarDays,
  GitBranch,
  Video,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Settings2,
} from "lucide-react";
import { getCurrentRole } from "../../auth";
import { api } from "../../api";
import { useEffect } from "react";

const interviewTabs = [
  { label: "Schedule", path: "/interviews/schedule", icon: Calendar },
  { label: "Calendar", path: "/interviews/calendar", icon: CalendarDays },
  { label: "Timeline", path: "/interviews/timeline", icon: GitBranch },
  { label: "Video Room", path: "/interviews/video-room", icon: Video },
  { label: "Integrations", path: "/interviews/calendar-integration", icon: Settings2 },
];

const stages = ["Phone Screen", "Technical", "HR Round", "Panel", "Final"];



const stageColors = [
  "border-blue-400 bg-blue-400",
  "border-purple-400 bg-purple-400",
  "border-green-400 bg-green-400",
  "border-orange-400 bg-orange-400",
  "border-[#D4AF37] bg-[#D4AF37]",
];

const stageTextColors = [
  "text-blue-400",
  "text-purple-400",
  "text-green-400",
  "text-orange-400",
  "text-[#D4AF37]",
];

export function InterviewTimeline() {
  const role = getCurrentRole() || "jobseeker";
  const userId = localStorage.getItem("talentai.user") || "";
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", ...stages];
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!userId) return;
      setLoading(true);
      try {
        let rawEvents = [];
        if (role === "jobseeker") {
          const candidate = await api.candidates.getByUserId(userId).catch(() => null);
          if (candidate?.id) {
            rawEvents = await api.interviews.getByCandidate(candidate.id);
          }
        }
        else if (role === "recruiter") {
          rawEvents = await api.interviews.getByRecruiter(userId);
        }
        else if (role === "hiring-manager") {
          rawEvents = await api.interviews.getByHiringManager(userId);
        }

        const parsedCandidates = rawEvents.map((r: any) => {
          let stageIndex = stages.findIndex(s => s.toLowerCase().startsWith((r.type || "phone").toLowerCase()));
          if (stageIndex === -1) stageIndex = 1;
          
          return {
            id: r.id,
            name: r.candidateName || r.interviewer || "Candidate",
            position: r.position || r.company || "Open Role",
            currentStage: stageIndex,
            daysInStage: 1,
            lastActivity: r.date || "Today",
            nextAction: r.status === "Pending" ? "Confirm Interview" : "Conduct Interview",
          };
        });
        setCandidates(parsedCandidates);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [role, userId]);

  const filteredCandidates = activeFilter === "All"
    ? candidates
    : candidates.filter((c) => stages[c.currentStage] === activeFilter);

  const stageStats = stages.map((stage, idx) => ({
    label: stage,
    count: candidates.filter(c => c.currentStage === idx).length,
    color: stageTextColors[idx],
    bg: stageColors[idx].split(" ")[1] + "/20"
  }));

  const bottleneckStage = stageStats.find((s) => s.count > 10 && s.label !== "Phone Screen");

  return (
    <ModuleLayout
      title="Interview Timeline"
      subtitle="Track candidate progress through the interview pipeline"
      icon={GitBranch}
      tabs={interviewTabs}
      backPath={`/${getCurrentRole() || "jobseeker"}/dashboard`}
      backLabel="Back to Portal"
    >
      {/* Stage stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {stageStats.map((s) => (
          <GlassCard key={s.label} className="p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${s.bg} ${s.color} font-medium`}>
              {s.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Bottleneck Alert */}
      {bottleneckStage && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-yellow-400 font-semibold text-sm">Bottleneck Alert</div>
            <div className="text-yellow-300/80 text-xs mt-0.5">
              {bottleneckStage.label} round is a bottleneck ({bottleneckStage.count} candidates, avg 8 days). Consider adding more interviewers or scheduling batch sessions.
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeFilter === f
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "text-muted-foreground border-border hover:text-foreground hover:border-[#D4AF37]/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Candidate Timeline Cards */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <GlassCard key={candidate.id} className="p-5 hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Avatar & info */}
              <div className="flex items-start gap-3 md:w-56 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-border flex items-center justify-center text-[#D4AF37] font-semibold text-sm flex-shrink-0">
                  {candidate.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-foreground font-medium text-sm">{candidate.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{candidate.position}</div>
                  <div className="flex items-center gap-1 mt-1.5 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {candidate.daysInStage}d in stage
                  </div>
                </div>
              </div>

              {/* Pipeline stages */}
              <div className="flex-1">
                <div className="flex items-center">
                  {stages.map((stage, idx) => {
                    const isCompleted = idx < candidate.currentStage;
                    const isCurrent = idx === candidate.currentStage;
                    const isUpcoming = idx > candidate.currentStage;
                    return (
                      <div key={stage} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              isCompleted
                                ? "border-[#D4AF37] bg-[#D4AF37]"
                                : isCurrent
                                ? `${stageColors[idx]} ring-2 ring-offset-2 ring-offset-[#1E1E1E]`
                                : "border-gray-600 bg-transparent"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-black" />
                            ) : isCurrent ? (
                              <Circle className={`h-3 w-3 ${isCurrent ? "text-black" : "text-muted-foreground"} fill-current`} />
                            ) : (
                              <Circle className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <span
                            className={`text-[9px] mt-1 font-medium text-center whitespace-nowrap ${
                              isCompleted
                                ? "text-[#D4AF37]"
                                : isCurrent
                                ? stageTextColors[idx]
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage.split(" ")[0]}
                          </span>
                        </div>
                        {idx < stages.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 rounded mb-3.5 ${
                              idx < candidate.currentStage ? "bg-[#D4AF37]" : "bg-gray-700"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right side: activity & action */}
              <div className="md:w-48 flex-shrink-0 flex flex-col gap-2">
                <div className="text-muted-foreground text-xs">
                  Last activity: <span className="text-gray-300">{candidate.lastActivity}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 border border-border h-8 text-xs"
                >
                  {candidate.nextAction}
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </ModuleLayout>
  );
}
