import { useState, useEffect } from "react";
import { api } from "../../api";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Calendar } from "../../components/ui/calendar";
import { Button } from "../../components/ui/button";
import { AddToCalendarButton } from "../../components/AddToCalendarButton";
import { CalendarDays, Clock, MapPin, Video, Users, Building, Loader2 } from "lucide-react";

export function JobSeekerCalendar() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const storedUser = localStorage.getItem("talentai.user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        if (!user?.id) return;

        const candidate = await api.candidates.ensure(user.id).catch(() => null);
        if (!candidate?.id) {
          setInterviews([]);
          return;
        }

        const data = await api.interviews.getByCandidate(candidate.id);
        setInterviews(data);
      } catch (err) {
        console.error("Failed to load interviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const activeInterviews = interviews.filter(i => i.status !== "Cancelled");

  const formatBackendDate = (d?: Date) => {
    if (!d) return "";
    return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  };

  const selectedDateStr = formatBackendDate(selectedDate);
  const interviewsOnSelectedDate = activeInterviews.filter(i => i.date === selectedDateStr);

  const upcomingInterviews = activeInterviews.filter(i => i.status === "Upcoming" || i.status === "Pending");
  
  const interviewDates = upcomingInterviews.map(i => new Date(i.date)).filter(d => !isNaN(d.getTime()));

  return (
    <DashboardLayout role="jobseeker">
      <div className="mb-6">
        <p className="text-sm text-[#D4AF37]">Dashboard / Calendar Integration</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Calendar Integration</h1>
        <p className="text-muted-foreground mt-1">
          Manage your schedule and sync upcoming interviews to your personal calendar.
        </p>
      </div>

      {loading ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="text-muted-foreground">Loading your calendar...</p>
        </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-[auto_1fr] gap-6 items-start">
          
          <GlassCard className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
              Select Date
            </h3>
            <div className="flex justify-center bg-secondary/30 rounded-xl p-2 border border-border">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
                modifiers={{
                  hasInterview: interviewDates,
                }}
                modifiersStyles={{
                  hasInterview: {
                    fontWeight: "bold",
                    color: "#D4AF37",
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                  }
                }}
              />
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]" />
                Has Scheduled Interviews
              </div>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="p-4 bg-secondary/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#D4AF37]" />
                Schedule for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : "Select a date"}
              </h2>
              <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20">
                {interviewsOnSelectedDate.length} Event(s)
              </Badge>
            </GlassCard>

            {interviewsOnSelectedDate.length === 0 ? (
              <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-secondary p-4 mb-4">
                  <CalendarDays className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-foreground font-semibold">No interviews scheduled</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  You have a free schedule on this date. Select highlighted dates on the calendar to view upcoming interviews.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {interviewsOnSelectedDate.map((interview) => (
                  <GlassCard key={interview.id} className="p-6 border-l-4 border-l-[#D4AF37]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 text-xs">
                            {interview.type}
                          </Badge>
                          <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs">
                            {interview.status}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mt-2">{interview.position}</h3>
                        <p className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                          <Building className="h-4 w-4" /> {interview.company}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <AddToCalendarButton interview={interview} />
                        {interview.meetingLink && (
                          <Button 
                            className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90 w-full"
                            onClick={() => window.open(interview.meetingLink, "_blank")}
                          >
                            <Video className="mr-2 h-4 w-4" /> Join
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/80">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="text-sm font-medium text-foreground">{interview.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/80">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium text-foreground">{interview.location || "Virtual"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/80">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Interviewer</p>
                          <p className="text-sm font-medium text-foreground">{interview.interviewer || "Pending"}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
