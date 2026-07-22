import { useState, useEffect } from "react";
import { api } from "../../api";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar, Video, MapPin, Clock, Building, Users, Loader2, CalendarX } from "lucide-react";
import { useNavigate } from "react-router";
import { AddToCalendarButton } from "../../components/AddToCalendarButton";

type InterviewStatus = "Upcoming" | "Completed" | "Cancelled" | "Pending";

const statusColors: Record<string, string> = {
  Upcoming: "bg-green-500/10 text-green-400 border border-green-500/20",
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Completed: "bg-gray-500/10 text-muted-foreground border border-gray-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export function JobSeekerInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const storedUser = localStorage.getItem("talentai.user");
        if (!storedUser) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);
        if (!user?.id) {
          setLoading(false);
          return;
        }

        // Ensure candidate record exists
        const candidate = await api.candidates.ensure(user.id).catch(() => null);
        if (!candidate?.id) {
          setInterviews([]);
          return;
        }

        const data = await api.interviews.getByCandidate(candidate.id);
        setInterviews(data);
      } catch (err: any) {
        console.error("Failed to load interviews", err);
        setError("Unable to load your interviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const upcomingInterviews = interviews.filter(
    (i) => i.status === "Upcoming" || i.status === "Pending"
  );
  const pastInterviews = interviews.filter(
    (i) => i.status === "Completed" || i.status === "Cancelled"
  );

  return (
    <DashboardLayout role="jobseeker">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Interviews</h1>
          <p className="text-muted-foreground">
            Manage your interview schedule and track upcoming sessions
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: interviews.length, color: "text-[#D4AF37]" },
          { label: "Upcoming", value: upcomingInterviews.length, color: "text-green-400" },
          { label: "Completed", value: pastInterviews.filter(i => i.status === "Completed").length, color: "text-blue-400" },
          { label: "Cancelled", value: pastInterviews.filter(i => i.status === "Cancelled").length, color: "text-red-400" },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4 text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {loading && (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="text-muted-foreground">Loading your interviews...</p>
        </GlassCard>
      )}

      {error && !loading && (
        <GlassCard className="p-8 text-center">
          <p className="text-red-400">{error}</p>
        </GlassCard>
      )}

      {!loading && !error && interviews.length === 0 && (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-[#D4AF37]/10 p-4">
            <CalendarX className="h-10 w-10 text-[#D4AF37]" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">No interviews yet</h3>
            <p className="text-muted-foreground max-w-sm">
              When a recruiter schedules an interview with you, it will appear here.
              Keep applying to jobs to get started!
            </p>
          </div>
          <Button onClick={() => navigate("/jobseeker/jobs")} className="mt-2">
            Browse Jobs
          </Button>
        </GlassCard>
      )}

      {!loading && !error && interviews.length > 0 && (
        <div className="space-y-8">
          {/* Upcoming */}
          {upcomingInterviews.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                Upcoming Interviews
              </h2>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastInterviews.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Past Interviews
              </h2>
              <div className="space-y-4">
                {pastInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    navigate={navigate}
                    past
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

function InterviewCard({
  interview,
  navigate,
  past = false,
}: {
  interview: any;
  navigate: (path: string) => void;
  past?: boolean;
}) {
  const statusClass = statusColors[interview.status] ?? statusColors["Pending"];

  return (
    <GlassCard className={`p-6 ${past ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge className={`text-xs ${statusClass}`}>{interview.status}</Badge>
            <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37]/40 text-xs">
              {interview.type}
            </Badge>
          </div>
          <h3 className="text-xl font-semibold text-foreground mt-2">{interview.position}</h3>
          <div className="flex items-center space-x-2 text-gray-300 mt-1">
            <Building className="h-4 w-4 shrink-0" />
            <span>{interview.company}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-[#D4AF37]/10 p-2 shrink-0">
            <Calendar className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-foreground">{interview.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-[#D4AF37]/10 p-2 shrink-0">
            <Clock className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="text-foreground">{interview.time}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-[#D4AF37]/10 p-2 shrink-0">
            <MapPin className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="text-foreground">{interview.location || "Virtual"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-[#D4AF37]/10 p-2 shrink-0">
            <Users className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interviewer</p>
            <p className="text-foreground">{interview.interviewer || "To be assigned"}</p>
          </div>
        </div>
      </div>

      {!past && (
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90"
            onClick={() => interview.meetingLink ? window.open(interview.meetingLink, "_blank") : navigate("/interviews/video-room")}
          >
            <Video className="mr-2 h-4 w-4" />
            Join Video Room
          </Button>
          <AddToCalendarButton interview={interview} />
        </div>
      )}
    </GlassCard>
  );
}
