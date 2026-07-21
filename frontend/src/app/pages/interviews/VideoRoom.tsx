import { useState } from "react";
import { useNavigate } from "react-router";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  CalendarDays,
  GitBranch,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Circle,
  Square,
  Settings2,
} from "lucide-react";
import { getCurrentRole } from "../../auth";

const interviewTabs = [
  { label: "Schedule", path: "/interviews/schedule", icon: Calendar },
  { label: "Calendar", path: "/interviews/calendar", icon: CalendarDays },
  { label: "Timeline", path: "/interviews/timeline", icon: GitBranch },
  { label: "Video Room", path: "/interviews/video-room", icon: Video },
  { label: "Integrations", path: "/interviews/calendar-integration", icon: Settings2 },
];

const technicalQuestions = [
  {
    id: 1,
    q: "Explain the difference between useMemo and useCallback in React. When would you use each?",
  },
  {
    id: 2,
    q: "How would you optimize a React application that has performance issues with large lists?",
  },
  {
    id: 3,
    q: "Describe your approach to state management in a large-scale React application.",
  },
  {
    id: 4,
    q: "What are Web Workers and when would you use them in a frontend application?",
  },
  {
    id: 5,
    q: "Walk me through how you would implement a real-time collaborative feature in a web app.",
  },
];

const scoreLabels = [
  { label: "Poor", color: "border-red-500/40 text-red-400 hover:bg-red-500/20" },
  { label: "Fair", color: "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/20" },
  { label: "Good", color: "border-blue-500/40 text-blue-400 hover:bg-blue-500/20" },
  { label: "Excellent", color: "border-green-500/40 text-green-400 hover:bg-green-500/20" },
];

export function VideoRoom() {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [notes, setNotes] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [selectedScore, setSelectedScore] = useState<string | null>(null);

  return (
    <ModuleLayout
      title="Video Interview Room"
      subtitle="Conduct professional video interviews"
      icon={Video}
      tabs={interviewTabs}
      backPath={`/${getCurrentRole() || "jobseeker"}/dashboard`}
      backLabel="Back to Portal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Session info bar */}
          <GlassCard className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <div>
                <span className="text-foreground font-semibold">Marcus Johnson</span>
                <span className="text-muted-foreground text-sm ml-2">· Senior Frontend Engineer</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {recording && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs animate-pulse">
                  <Circle className="h-2.5 w-2.5 fill-current" />
                  REC
                </div>
              )}
              <span className="text-[#D4AF37] font-mono text-sm font-medium">00:23:47</span>
            </div>
          </GlassCard>

          {/* Video grid */}
          <div className="relative bg-[#0A0A0A] rounded-xl border border-border overflow-hidden" style={{ minHeight: "380px" }}>
            {/* Main candidate feed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-secondary border-2 border-[#D4AF37]/40 flex items-center justify-center">
                  <span className="text-[#D4AF37] text-2xl font-bold">MJ</span>
                </div>
                <div className="text-center">
                  <div className="text-foreground font-semibold">Marcus Johnson</div>
                  <div className="text-muted-foreground text-sm">Candidate</div>
                </div>
                {!cameraOn && (
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <VideoOff className="h-3.5 w-3.5" />
                    Camera off
                  </div>
                )}
              </div>
            </div>

            {/* PiP: interviewer feed */}
            <div className="absolute bottom-4 right-4 w-36 h-24 bg-card rounded-lg border border-border flex items-center justify-center shadow-xl">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                  <span className="text-[#D4AF37] text-sm font-bold">SC</span>
                </div>
                <span className="text-gray-300 text-[10px]">You</span>
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Control bar */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  micOn
                    ? "border-border bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                    : "border-red-500/40 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setCameraOn(!cameraOn)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  cameraOn
                    ? "border-border bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                    : "border-red-500/40 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              <button className="w-12 h-12 rounded-full border border-gray-700 bg-secondary text-gray-300 hover:text-foreground hover:border-gray-500 flex items-center justify-center transition-all">
                <Monitor className="h-5 w-5" />
              </button>

              <button
                onClick={() => setRecording(!recording)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  recording
                    ? "border-red-500 bg-red-500/30 text-red-400"
                    : "border-gray-700 bg-secondary text-gray-300 hover:text-foreground"
                }`}
              >
                {recording ? <Square className="h-4 w-4 fill-current" /> : <Circle className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  chatOpen
                    ? "border-blue-500/40 bg-blue-500/20 text-blue-400"
                    : "border-gray-700 bg-secondary text-gray-300 hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate("/interviews/schedule")}
                className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 text-foreground flex items-center justify-center transition-all ml-2"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <span className="text-muted-foreground text-[10px]">{micOn ? "Mute" : "Unmute"}</span>
              <span className="text-muted-foreground text-[10px]">{cameraOn ? "Stop Video" : "Start Video"}</span>
              <span className="text-muted-foreground text-[10px]">Share</span>
              <span className="text-muted-foreground text-[10px]">{recording ? "Stop Rec" : "Record"}</span>
              <span className="text-muted-foreground text-[10px]">Chat</span>
              <span className="text-muted-foreground text-[10px] ml-2">End Call</span>
            </div>
          </GlassCard>

          {/* Interview Toolkit */}
          <GlassCard className="p-5">
            <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
              <Video className="h-4 w-4 text-[#D4AF37]" />
              Interview Toolkit — Question Bank
            </h3>
            <div className="space-y-2">
              {technicalQuestions.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#D4AF37]/15 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedQuestion(expandedQuestion === item.id ? null : item.id)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#D4AF37]/5 transition-colors"
                  >
                    <span className="text-gray-300 text-sm">Q{item.id}. {item.q.substring(0, 60)}...</span>
                    <span className="text-[#D4AF37] text-xs ml-2 flex-shrink-0">
                      {expandedQuestion === item.id ? "▲" : "▼"}
                    </span>
                  </button>
                  {expandedQuestion === item.id && (
                    <div className="px-4 pb-3 border-t border-border">
                      <p className="text-muted-foreground text-sm mt-2">{item.q}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right panel */}
        {chatOpen && (
          <div className="flex flex-col gap-4">
            {/* Candidate info */}
            <GlassCard className="p-4">
              <h3 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
                Candidate Info
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-border flex items-center justify-center text-[#D4AF37] font-bold">
                  MJ
                </div>
                <div>
                  <div className="text-foreground font-medium text-sm">Marcus Johnson</div>
                  <div className="text-muted-foreground text-xs">Senior Frontend Engineer</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="text-gray-300">June 17, 2026 · 10:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-gray-300">60 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Round</span>
                  <span className="text-[#D4AF37]">Technical</span>
                </div>
              </div>
            </GlassCard>

            {/* Quick Score */}
            <GlassCard className="p-4">
              <h3 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
                Quick Score
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {scoreLabels.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedScore(s.label)}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all ${s.color} ${
                      selectedScore === s.label ? "ring-1 ring-offset-1 ring-offset-[#1E1E1E] ring-current" : ""
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {selectedScore && (
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  Scored: <span className="text-foreground font-medium">{selectedScore}</span>
                </div>
              )}
            </GlassCard>

            {/* Notes */}
            <GlassCard className="p-4 flex-1">
              <h3 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
                Interview Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type interview notes here... (auto-saved)"
                rows={12}
                className="w-full bg-background border border-[#D4AF37]/15 rounded-lg px-3 py-2.5 text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 resize-none leading-relaxed"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 text-xs h-8"
                >
                  Save Notes
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
