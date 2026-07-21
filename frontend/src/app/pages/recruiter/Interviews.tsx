import { useState, useEffect } from "react";
import { api } from "../../api";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { AddToCalendarButton } from "../../components/AddToCalendarButton";
import {
  Calendar,
  Video,
  Phone,
  Users,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Briefcase,
} from "lucide-react";

type InterviewType = "Phone" | "Technical" | "HR" | "Panel";
type InterviewStatus = "Confirmed" | "Pending" | "Reschedule Requested";

interface Interview {
  id: string;
  candidateName: string;
  candidateTitle: string;
  position: string;
  date: string;
  time: string;
  type: InterviewType;
  interviewer: string;
  status: InterviewStatus;
  videoLink: boolean;
}


const typeConfig: Record<InterviewType, { icon: React.ReactNode; color: string }> = {
  Phone: { icon: <Phone className="w-3.5 h-3.5" />, color: "bg-green-500/10 text-green-400 border border-green-500/20" },
  Technical: { icon: <Briefcase className="w-3.5 h-3.5" />, color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  HR: { icon: <User className="w-3.5 h-3.5" />, color: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  Panel: { icon: <Users className="w-3.5 h-3.5" />, color: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
};

const statusConfig: Record<InterviewStatus, { color: string; icon: React.ReactNode }> = {
  Confirmed: { color: "bg-green-500/10 text-green-400 border border-green-500/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  Pending: { color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", icon: <Clock className="w-3.5 h-3.5" /> },
  "Reschedule Requested": { color: "bg-orange-500/10 text-orange-400 border border-orange-500/20", icon: <RefreshCw className="w-3.5 h-3.5" /> },
};

export function RecruiterInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const storedUser = localStorage.getItem("talentai.user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.id) {
            const data = await api.interviews.getByRecruiter(user.id);
            setInterviews(data);
          }
        }
      } catch (err) {
        console.error("Failed to load interviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const visible = interviews.filter((i) => !cancelled.includes(i.id));

  // Dynamic stats
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  const totalScheduled = interviews.length;
  // This week calculation: roughly checking if date is within 7 days
  const thisWeek = interviews.filter(i => {
    const d = new Date(i.date);
    const diffTime = Math.abs(d.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7 && d >= now;
  }).length;
  
  const completed = interviews.filter(i => i.status === "Completed").length;
  const cancelledCount = cancelled.length + interviews.filter(i => i.status === "Cancelled").length;

  const stats = [
    { label: "Total Scheduled", value: totalScheduled.toString(), icon: <Calendar className="w-5 h-5" />, color: "text-[#D4AF37]" },
    { label: "Next 7 Days", value: thisWeek.toString(), icon: <Clock className="w-5 h-5" />, color: "text-blue-400" },
    { label: "Completed", value: completed.toString(), icon: <CheckCircle className="w-5 h-5" />, color: "text-green-400" },
    { label: "Cancelled", value: cancelledCount.toString(), icon: <XCircle className="w-5 h-5" />, color: "text-red-400" },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interview Management</h1>
            <p className="text-muted-foreground mt-1">Upcoming interviews for the next 7 days</p>
          </div>
          <Button 
            className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90"
            onClick={() => navigate("/recruiter/interviews/schedule")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={stat.color}>{stat.icon}</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Interview List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
            Upcoming Interviews
          </h2>
          {visible.map((interview) => (
            <GlassCard key={interview.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-border flex items-center justify-center text-[#D4AF37] font-bold text-lg shrink-0">
                    {interview.candidateName.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-foreground font-semibold">{interview.candidateName}</h3>
                      <span className="text-muted-foreground text-sm">·</span>
                      <span className="text-muted-foreground text-sm">{interview.candidateTitle}</span>
                    </div>
                    <p className="text-[#D4AF37] text-sm mt-0.5 font-medium">{interview.position}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {interview.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {interview.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs flex items-center gap-1 ${typeConfig[interview.type as InterviewType]?.color || ""}`}>
                        {typeConfig[interview.type as InterviewType]?.icon}
                        {interview.type}
                      </Badge>
                      <Badge className={`text-xs flex items-center gap-1 ${statusConfig[interview.status as InterviewStatus]?.color || ""}`}>
                        {statusConfig[interview.status as InterviewStatus]?.icon}
                        {interview.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {interview.videoLink && (
                    <Button
                      onClick={() => navigate("/interviews/video-room")}
                      className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90 text-sm"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Video Call
                    </Button>
                  )}
                  <AddToCalendarButton interview={interview} compact />
                  <Button
                    variant="outline"
                    className="border-border text-gray-300 hover:border-[#D4AF37]/40 text-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCancelled((c) => [...c, interview.id])}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 text-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}

          {visible.length === 0 && (
            <GlassCard className="p-6">
              <p className="text-center text-muted-foreground py-8">
                No upcoming interviews scheduled.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
