import { useState } from "react";
import { Button } from "../../components/ui/button";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  Maximize2,
} from "lucide-react";

export function VideoInterview() {
  const navigate = useNavigate();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isRecording] = useState(true);

  const participants = [
    { id: 1, name: "You", role: "Candidate", videoOn: true },
    { id: 2, name: "Sarah Johnson", role: "HR Manager", videoOn: true },
    { id: 3, name: "Mike Chen", role: "Tech Lead", videoOn: true },
  ];

  const handleEndCall = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Interview: Senior React Developer
            </h1>
            <p className="text-muted-foreground">Tech Innovations Inc.</p>
          </div>
          {isRecording && (
            <Badge className="bg-red-500/20 text-red-500 border-red-500/40">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
              Recording
            </Badge>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {participants.map((participant) => (
            <GlassCard key={participant.id} className="aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D2D2D] to-[#1E1E1E] flex items-center justify-center">
                {participant.videoOn ? (
                  <div className="text-center">
                    <Users className="h-16 w-16 text-[#D4AF37] mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Camera Preview</p>
                  </div>
                ) : (
                  <VideoOff className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-semibold text-sm">{participant.name}</p>
                    <p className="text-muted-foreground text-xs">{participant.role}</p>
                  </div>
                  <Mic className="h-4 w-4 text-[#D4AF37]" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Controls */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">3 participants</span>
              </div>
              <div className="text-muted-foreground">•</div>
              <span className="text-muted-foreground">45:23</span>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="icon"
                className="rounded-full"
                onClick={() => setVideoEnabled(!videoEnabled)}
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={audioEnabled ? "default" : "destructive"}
                size="icon"
                className="rounded-full"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Monitor className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Maximize2 className="h-5 w-5" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>

            <div className="w-32" />
          </div>
        </GlassCard>

        {/* Interview Notes Panel */}
        <GlassCard className="p-6 mt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Interview Notes</h3>
          <textarea
            className="w-full h-32 bg-card border border-border rounded-lg p-3 text-foreground resize-none"
            placeholder="Take notes during the interview..."
          />
        </GlassCard>
      </div>
    </div>
  );
}
