import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Link, useLocation } from "react-router";
import {
  Calendar,
  CalendarDays,
  GitBranch,
  Video,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { getCurrentRole } from "../../auth";
import { api } from "../../api";

const interviewTabs = [
  { label: "Schedule", path: "/interviews/schedule", icon: Calendar },
  { label: "Calendar", path: "/interviews/calendar", icon: CalendarDays },
  { label: "Timeline", path: "/interviews/timeline", icon: GitBranch },
  { label: "Video Room", path: "/interviews/video-room", icon: Video },
  { label: "Integrations", path: "/interviews/calendar-integration", icon: Settings2 },
];

interface InterviewEvent {
  id: number;
  day: number;
  time: string;
  candidate: string;
  type: "Phone" | "Technical" | "HR" | "Panel" | "Final";
}


const typeColors: Record<string, string> = {
  Phone: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Technical: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  HR: "bg-green-500/20 text-green-300 border-green-500/30",
  Panel: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Final: "bg-[#D4AF37]/20 text-[#D4AF37] border-border",
};

const typeDotColors: Record<string, string> = {
  Phone: "bg-blue-400",
  Technical: "bg-purple-400",
  HR: "bg-green-400",
  Panel: "bg-orange-400",
  Final: "bg-[#D4AF37]",
};

function parseTime(timeStr: string) {
  // Try parsing "09:00" or "09:00 - 10:00"
  let match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  }
  if (!match) return 9;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  
  // If AM/PM is present in the string
  if (timeStr.toLowerCase().includes("pm") && hours < 12) hours += 12;
  if (timeStr.toLowerCase().includes("am") && hours === 12) hours = 0;
  
  return hours + minutes / 60;
}

function formatTime(timeStr: string) {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function InterviewCalendar() {
  const role = getCurrentRole() || "jobseeker";
  const user = (() => {
    try {
      const u = localStorage.getItem("talentai.user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  })();
  const userId = user?.id || "";
  const location = useLocation();

  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<number | null>(17);
  const [events, setEvents] = useState<InterviewEvent[]>([]);
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

        const parsedEvents: InterviewEvent[] = rawEvents.map((r: any) => {
          // r.date is usually "June 17, 2026"
          const dateObj = new Date(r.date || new Date());
          const day = dateObj.getDate();
          return {
            id: r.id,
            day: day,
            time: formatTime(r.time || "09:00"),
            candidate: r.candidateName || r.interviewer || "Unknown",
            type: r.type || "Technical",
          };
        });
        setEvents(parsedEvents);
      } catch (err) {
        console.error("Failed to load interviews", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [role, userId]);

  // Use the current month details based on current date
  const now = new Date();
  const startDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay(); 
  // adjusted so Monday=0 for ease, standard getDay is Sun=0
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; 
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const interviewsByDay: Record<number, InterviewEvent[]> = {};
  events.forEach((iv) => {
    if (!interviewsByDay[iv.day]) interviewsByDay[iv.day] = [];
    interviewsByDay[iv.day].push(iv);
  });

  const selectedDayInterviews = selectedDay ? (interviewsByDay[selectedDay] || []) : [];

  // Build calendar cells for month view
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Calculate current week for week view based on selectedDay
  // selectedDay = 17. 17 + startDayOfWeek = 17 (0-indexed offset).
  // The week starts on Monday (index 0).
  const currentOffset = (selectedDay || 17) + startDayOfWeek - 1;
  const weekStartDay = (selectedDay || now.getDate()) - (currentOffset % 7);
  const weekDays = Array.from({ length: 7 }).map((_, i) => weekStartDay + i);

  // Time grid hours
  const hours = Array.from({ length: 13 }).map((_, i) => i + 7); // 7 AM to 7 PM

  return (
    <DashboardLayout role={role as any}>
      <div className="max-w-7xl mx-auto flex flex-col h-full gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-[#D4AF37]" />
              Interview Calendar
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Visual calendar view of all scheduled interviews</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/interviews/calendar-integration">
              <Button variant="outline" className="border-[#4285F4]/30 hover:bg-[#4285F4]/10 text-[#4285F4]">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync with Google Calendar
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-card/50 border border-border p-1 rounded-lg self-start">
          {interviewTabs.map((tab) => {
            const isActive = location.pathname.includes(tab.path);
            const Icon = tab.icon;
            return (
              <Link key={tab.label} to={tab.path}>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#D4AF37]" : ""}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              </Link>
            );
          })}
        </div>

        {/* View toggle & navigation */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-foreground font-semibold text-lg">{monthName}</h2>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
            {loading && <span className="text-xs text-muted-foreground ml-2">Loading...</span>}
          </div>
          <div className="flex bg-card rounded-lg border border-border p-1 gap-1">
          {(["month", "week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                view === v
                  ? "bg-[#D4AF37] text-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <GlassCard className="p-0 overflow-hidden flex flex-col h-[700px]">
            {view === "month" ? (
              <div className="p-4 flex-1 flex flex-col">
                <div className="grid grid-cols-7 mb-2">
                  {dayHeaders.map((h) => (
                    <div key={h} className="text-center text-muted-foreground text-xs font-medium py-2">
                      {h}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 flex-1">
                  {cells.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} className="border border-transparent" />;
                    const dayEvents = interviewsByDay[day] || [];
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selectedDay === day;
                    const isToday = day === 17;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`p-1.5 rounded-lg text-left transition-all border flex flex-col ${
                          isSelected
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : hasEvents
                            ? "border-[#D4AF37]/25 hover:border-[#D4AF37]/50 bg-secondary/40"
                            : "border-transparent hover:border-border hover:bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ${isToday ? "bg-[#D4AF37] text-black" : isSelected ? "text-[#D4AF37]" : "text-gray-300"}`}>
                            {day}
                          </span>
                          {hasEvents && (
                            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-1.5 font-medium">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-0.5 flex-1 overflow-hidden">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <div key={ev.id} className={`flex items-center gap-1 text-[9px] rounded px-1 py-0.5 truncate ${typeColors[ev.type]}`}>
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeDotColors[ev.type]}`} />
                              <span className="truncate">{ev.candidate.split(" ")[0]}</span>
                            </div>
                          ))}
                          {dayEvents.length > 3 && <div className="text-[9px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Week View Headers */}
                <div className="grid grid-cols-8 border-b border-border">
                  <div className="col-span-1 border-r border-border p-2 flex items-end justify-center">
                    <span className="text-xs text-muted-foreground">GMT+05:30</span>
                  </div>
                  {weekDays.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`col-span-1 p-2 text-center border-r border-border hover:bg-secondary/30 transition-colors ${selectedDay === day ? 'bg-[#D4AF37]/5' : ''}`}
                    >
                      <div className="text-xs text-muted-foreground uppercase mb-1">{dayHeaders[idx]}</div>
                      <div className={`text-xl mx-auto w-8 h-8 flex items-center justify-center rounded-full ${day === 17 ? 'bg-[#D4AF37] text-black font-semibold' : selectedDay === day ? 'text-[#D4AF37] font-semibold' : 'text-foreground'}`}>
                        {day > 0 && day <= daysInMonth ? day : ""}
                      </div>
                    </button>
                  ))}
                </div>
                {/* Week View Grid */}
                <div className="flex-1 overflow-y-auto relative">
                  <div className="grid grid-cols-8 relative min-h-[800px]">
                    {/* Time labels */}
                    <div className="col-span-1 border-r border-border">
                      {hours.map(hour => (
                        <div key={hour} className="h-16 border-b border-border/50 flex items-start justify-center pt-2 relative">
                          <span className="text-[10px] text-muted-foreground absolute -top-2.5 bg-card px-1">
                            {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Day columns */}
                    {weekDays.map((day, dayIdx) => (
                      <div key={day} className="col-span-1 border-r border-border relative">
                        {hours.map(hour => (
                          <div key={`${day}-${hour}`} className="h-16 border-b border-border/20" />
                        ))}
                        {/* Render events for this day */}
                        {(interviewsByDay[day] || []).map((ev) => {
                          const timeVal = parseTime(ev.time);
                          if (timeVal < 7 || timeVal > 19) return null;
                          const topOffset = (timeVal - 7) * 4; // 4rem = 64px per hour
                          const durationHours = 1; // Assuming 1 hour events
                          
                          return (
                            <div
                              key={ev.id}
                              className={`absolute left-1 right-1 rounded p-1.5 border shadow-sm flex flex-col justify-start overflow-hidden hover:z-10 hover:shadow-md transition-all cursor-pointer ${typeColors[ev.type]}`}
                              style={{ top: `${topOffset}rem`, height: `${durationHours * 4}rem`, minHeight: '3rem' }}
                            >
                              <div className="text-[10px] font-semibold truncate leading-tight">{ev.candidate}</div>
                              <div className="text-[9px] opacity-80 truncate leading-tight">{ev.time}</div>
                              <div className="text-[9px] font-medium opacity-90 truncate mt-0.5">{ev.type} Round</div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Legend */}
            {view === "month" && (
              <div className="flex flex-wrap gap-3 p-4 border-t border-border">
                {Object.entries(typeDotColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-muted-foreground text-xs">{type}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Day detail panel */}
        <div>
          <GlassCard className="p-4 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-[#D4AF37]" />
              <h3 className="text-foreground font-semibold">
                {selectedDay ? `June ${selectedDay}, 2026` : "Select a day"}
              </h3>
            </div>
            {selectedDay && selectedDayInterviews.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No interviews scheduled</p>
            )}
            {!selectedDay && (
              <p className="text-muted-foreground text-sm text-center py-8">Click a day to see interviews</p>
            )}
            <div className="space-y-3">
              {selectedDayInterviews.map((iv) => (
                <div key={iv.id} className={`rounded-lg border p-3 ${typeColors[iv.type]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{iv.type}</span>
                    <span className="flex items-center gap-1 text-xs opacity-80">
                      <Clock className="h-3 w-3" />
                      {iv.time}
                    </span>
                  </div>
                  <div className="text-foreground text-sm font-medium">{iv.candidate}</div>
                </div>
              ))}
            </div>
            {selectedDay && selectedDayInterviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Users className="h-3.5 w-3.5" />
                  {selectedDayInterviews.length} interview{selectedDayInterviews.length > 1 ? "s" : ""} scheduled
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
