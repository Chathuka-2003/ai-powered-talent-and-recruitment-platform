import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar as CalendarIcon, Clock, Users, Plus, CheckCircle, Video, Briefcase, User, MapPin, Link as LinkIcon, Loader2 } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { AddToCalendarButton } from "../../components/AddToCalendarButton";
import { api } from "../../api";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";

export function InterviewScheduling() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Form State
  const [selectedApp, setSelectedApp] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [type, setType] = useState("Technical");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("talentai.user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.id) {
            setUserId(user.id);
            const [ints, apps] = await Promise.all([
              api.interviews.getByRecruiter(user.id),
              api.applications.getForRecruiter(user.id)
            ]);
            setInterviews(ints);
            // Only show apps that are shortlisted or similar if we wanted to filter, 
            // but for now we'll allow scheduling for any active app
            setApplications(apps);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
        toast.error("Failed to load interview data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !date || !time) {
      toast.error("Please fill in candidate, date, and time.");
      return;
    }
    setSubmitting(true);
    try {
      // Format date to YYYY-MM-DD
      const dateStr = date.toISOString().split("T")[0];
      // Note: time should be HH:mm:ss for TimeSpan in C#
      let timeStr = time;
      if (timeStr.length === 5) timeStr += ":00"; // e.g., "14:30:00"
      
      const payload = {
        ApplicationId: selectedApp,
        RecruiterId: userId,
        InterviewDate: dateStr,
        InterviewTime: timeStr,
        Location: location,
        MeetingLink: meetingLink,
        Type: type,
        Status: "Pending"
      };

      const res = await api.interviews.create(payload);
      toast.success("Interview scheduled successfully!");
      
      // Refresh interviews
      const ints = await api.interviews.getByRecruiter(userId);
      setInterviews(ints);
      
      // Reset form
      setSelectedApp("");
      setTime("");
      setLocation("");
      setMeetingLink("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  const getIconForType = (t: string) => {
    switch (t) {
      case "Phone": return <Clock className="w-4 h-4 mr-1" />;
      case "Technical": return <Briefcase className="w-4 h-4 mr-1" />;
      case "HR": return <User className="w-4 h-4 mr-1" />;
      case "Panel": return <Users className="w-4 h-4 mr-1" />;
      default: return <Video className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-[#D4AF37] to-white bg-clip-text text-transparent">Interview Scheduling</h1>
          <p className="text-muted-foreground">Manage and schedule candidate interviews</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Calendar */}
        <div className="space-y-6">
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-semibold text-[#D4AF37] mb-6 flex items-center text-lg">
              <Plus className="mr-2 h-5 w-5" />
              Schedule New
            </h3>
            <form onSubmit={handleSchedule} className="space-y-4 relative z-10">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Select Candidate / Job</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2.5 text-foreground text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                  disabled={loading}
                >
                  <option value="">-- Choose Application --</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.candidateName} - {app.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Interview Type</label>
                <select 
                  className="w-full bg-background border border-border rounded-md p-2.5 text-foreground text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Phone">Phone Screen</option>
                  <option value="Technical">Technical Round</option>
                  <option value="HR">HR Round</option>
                  <option value="Panel">Panel Interview</option>
                  <option value="Video">Video Interview</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Time</label>
                  <Input 
                    type="time" 
                    className="bg-background border-border text-foreground"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Location</label>
                  <Input 
                    placeholder="e.g. Room 4B" 
                    className="bg-background border-border text-foreground"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Meeting Link</label>
                <Input 
                  placeholder="https://zoom.us/j/..." 
                  className="bg-background border-border text-foreground"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium" disabled={submitting || loading}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-[#D4AF37]" />
              Select Date
            </h3>
            <div className="flex justify-center bg-background/50 rounded-lg p-2 border border-border">
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate}
                className="rounded-md border-0 pointer-events-auto text-foreground" 
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Upcoming List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Schedules</h2>
            <Badge variant="outline" className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20">
              {interviews.length} Total
            </Badge>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : interviews.length === 0 ? (
            <GlassCard className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Interviews Scheduled</h3>
              <p className="text-muted-foreground text-sm max-w-md">You haven't scheduled any interviews yet. Select a candidate from the left panel to schedule one.</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <GlassCard key={interview.id} className="p-5 hover:border-[#D4AF37]/30 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        {interview.candidateName ? interview.candidateName.charAt(0) : "C"}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-0.5 group-hover:text-[#D4AF37] transition-colors">{interview.candidateName || "Candidate"}</h3>
                        <p className="text-[#D4AF37]/80 text-sm font-medium mb-3">{interview.position || "Position"}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(interview.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {interview.time.substring(0, 5)}
                          </div>
                          {interview.location && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {interview.location}
                            </div>
                          )}
                          {interview.meetingLink && (
                            <div className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer">
                              <LinkIcon className="h-4 w-4 mr-2" />
                              <span className="underline">Meeting Link</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 sm:w-auto w-full sm:mt-0 mt-2">
                      <Badge className="bg-secondary/80 text-foreground border border-border flex items-center py-1">
                        {getIconForType(interview.type)}
                        {interview.type}
                      </Badge>
                      <Badge variant="outline" className={
                        interview.status === "Confirmed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        interview.status === "Completed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }>
                        {interview.status}
                      </Badge>
                      <div className="mt-1">
                        <AddToCalendarButton interview={interview} compact />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
