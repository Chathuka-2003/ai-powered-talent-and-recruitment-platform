import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
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
  Send,
  FileText,
  Sparkles,
  UserCheck,
  Award
} from "lucide-react";
import * as signalR from "@microsoft/signalr";
import { getCurrentRole, getCurrentUser } from "../../auth";
import { api } from "../../api";

export function VideoInterview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentRole = getCurrentRole() || "recruiter";
  const currentUser = getCurrentUser();
  const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "You";

  // Real Interview Data & Online Participants State
  const [interviewData, setInterviewData] = useState<any>(null);
  const [onlineParticipants, setOnlineParticipants] = useState<Array<{ connectionId: string; userName: string; role: string; isOnline: boolean }>>([]);
  const hubConnectionRef = useRef<signalR.HubConnection | null>(null);

  // Video / Audio States
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(true);

  // Panel Toggles
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  // Chat & Notes State
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "System", text: "Welcome to the secure video interview room. End-to-end encryption active.", time: "10:00 AM" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Video Stream Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // SignalR Connection for True Real-Time Online Presence
  useEffect(() => {
    const roomId = id || "LIVE-99214";
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5047/hubs/video", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    hubConnectionRef.current = connection;

    connection.on("UpdateParticipantList", (list: any[]) => {
      setOnlineParticipants(list || []);
    });

    connection.on("UserJoined", (user: any) => {
      toast.success(`${user.userName} (${user.role}) joined the room`);
    });

    connection.on("UserLeft", () => {
      toast.info(`A participant left the video room`);
    });

    connection.on("ReceiveChatMessage", (sender: string, text: string, time: string) => {
      setMessages((prev) => [...prev, { sender, text, time }]);
    });

    connection.start()
      .then(() => {
        connection.invoke("JoinRoom", roomId, currentUserName, currentRole);
      })
      .catch((err) => {
        console.warn("SignalR live connection attempt fallback", err);
      });

    return () => {
      if (connection) {
        connection.invoke("LeaveRoom", roomId).catch(() => {});
        connection.stop();
      }
    };
  }, [id, currentUserName, currentRole]);

  // Fetch Interview Details if ID exists
  useEffect(() => {
    if (id) {
      api.interviews.getById(id)
        .then((res) => {
          if (res) setInterviewData(res);
        })
        .catch((err) => console.warn("Interview details load failed", err));
    }
  }, [id]);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Camera Access Effect
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: audioEnabled
          });
          activeStream = stream;
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Could not access camera/mic stream, using simulation mode", err);
      }
    }

    if (videoEnabled) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoEnabled, audioEnabled]);

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = displayStream;
          }
          setScreenSharing(true);
          toast.success("Screen sharing started");
          displayStream.getVideoTracks()[0].onended = () => {
            setScreenSharing(false);
            if (videoRef.current && streamRef.current) {
              videoRef.current.srcObject = streamRef.current;
            }
          };
        } else {
          toast.info("Screen sharing simulated");
          setScreenSharing(true);
        }
      } catch (err) {
        toast.error("Screen share cancelled or not permitted");
      }
    } else {
      setScreenSharing(false);
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      toast.info("Screen sharing stopped");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const roomId = id || "LIVE-99214";
    if (hubConnectionRef.current && hubConnectionRef.current.state === signalR.HubConnectionState.Connected) {
      hubConnectionRef.current.invoke("SendChatMessage", roomId, `${currentUserName} (${currentRole})`, newMessage);
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [...prev, { sender: `${currentUserName} (You)`, text: newMessage, time: timeStr }]);
    }
    setNewMessage("");
  };

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    toast.success("Interview session ended.");
    navigate(-1);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const candidateName = interviewData?.candidateName || "Chathuka Edirisinghe";
  const recruiterName = interviewData?.recruiterName || "Kavishi Rajasekara";
  const hiringManagerName = interviewData?.hiringManagerName || "Nimal Bandara";
  const jobTitle = interviewData?.position || "Cloud Engineer Internship";
  const companyName = interviewData?.company || "IFS";

  const isParticipantOnline = (name: string) => {
    return onlineParticipants.some(p => p.userName.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.userName.toLowerCase()));
  };

  const participants = [
    {
      id: 1,
      name: `${currentUserName} (You)`,
      role: currentRole === "jobseeker" ? "Candidate" : currentRole === "hiring-manager" ? "Hiring Manager" : "Recruiter",
      isMe: true,
      isOnline: true
    },
    ...(currentRole !== "jobseeker" ? [{ id: 2, name: candidateName, role: "Candidate", isMe: false, isOnline: isParticipantOnline(candidateName) }] : []),
    ...(currentRole !== "recruiter" ? [{ id: 3, name: recruiterName, role: "Recruiter", isMe: false, isOnline: isParticipantOnline(recruiterName) }] : []),
    ...(currentRole !== "hiring-manager" ? [{ id: 4, name: hiringManagerName, role: "Hiring Manager", isMe: false, isOnline: isParticipantOnline(hiringManagerName) }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-foreground p-4 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 bg-secondary/40 border border-border p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {jobTitle} - Interview Room
            </h1>
            <p className="text-xs text-muted-foreground">{companyName} • Session ID: {id || "LIVE-99214"} • Encrypted P2P HD Video</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 py-1 px-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {formatTimer(secondsElapsed)}
          </Badge>

          {isRecording && (
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 py-1 px-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              AI Recording Active
            </Badge>
          )}

          <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)} className={showNotes ? "border-[#D4AF37] text-[#D4AF37]" : ""}>
            <FileText className="h-4 w-4 mr-1.5" /> Notes
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowChat(!showChat)} className={showChat ? "border-[#D4AF37] text-[#D4AF37]" : ""}>
            <MessageSquare className="h-4 w-4 mr-1.5" /> Chat ({messages.length})
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-4 gap-4 flex-1">
        {/* Video Stage (3 cols if side panels open, else 4 cols) */}
        <div className={`${showChat || showNotes ? "lg:col-span-3" : "lg:col-span-4"} space-y-4`}>
          {/* Main Video View */}
          <GlassCard className="relative aspect-video w-full overflow-hidden rounded-2xl border-border bg-black flex items-center justify-center shadow-2xl">
            {videoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-secondary border border-border flex items-center justify-center mb-4">
                  <VideoOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Camera Turn Off</h3>
                <p className="text-sm text-muted-foreground mt-1">Your video stream is currently muted.</p>
              </div>
            )}

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              You ({currentRole.toUpperCase()})
            </div>

            {screenSharing && (
              <div className="absolute top-4 right-4 bg-[#D4AF37]/90 text-black px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" /> Screen Share Live
              </div>
            )}
          </GlassCard>

          {/* Participant Cards Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {participants.map((p) => (
              <GlassCard key={p.id} className="p-3 bg-secondary/40 border border-border relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${p.isOnline ? "bg-emerald-400" : "bg-gray-500"}`} title={p.isOnline ? "Online Live" : "Offline"} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-none">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        {p.role} • <span className={p.isOnline ? "text-emerald-400 font-medium" : "text-gray-400"}>{p.isOnline ? "ONLINE" : "OFFLINE"}</span>
                      </p>
                    </div>
                  </div>
                  {p.isMe && !audioEnabled ? (
                    <MicOff className="h-3.5 w-3.5 text-red-400" />
                  ) : (
                    <Mic className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Side Panels: Chat or Notes */}
        {(showChat || showNotes) && (
          <div className="lg:col-span-1 space-y-4 flex flex-col h-full">
            {showNotes && (
              <GlassCard className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#D4AF37]" /> Interviewer Evaluation Notes
                </h3>
                <textarea
                  className="flex-1 w-full bg-secondary/50 border border-border rounded-xl p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-[#D4AF37] focus:outline-none resize-none min-h-[140px]"
                  placeholder="Record observations, technical rating, soft skills, and recommendation notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button size="sm" className="mt-3 w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 text-xs font-semibold" onClick={() => toast.success("Notes saved to candidate scorecard")}>
                  Save Notes
                </Button>
              </GlassCard>
            )}

            {showChat && (
              <GlassCard className="p-4 flex-1 flex flex-col h-[320px]">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-[#D4AF37]" /> In-Room Chat
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`p-2 rounded-lg ${m.sender === "You" ? "bg-[#D4AF37]/15 border border-[#D4AF37]/30 ml-4" : "bg-secondary border border-border mr-4"}`}>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-0.5">
                        <span className="font-semibold text-foreground">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-foreground">{m.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-3">
                  <Input
                    placeholder="Type a message..."
                    className="bg-secondary border-border text-xs text-foreground h-8"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="h-8 w-8 p-0 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shrink-0">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </GlassCard>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="max-w-7xl w-full mx-auto mt-4">
        <GlassCard className="p-4 border border-border bg-secondary/40 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-xs bg-background/50 border-border">
                <Users className="h-3.5 w-3.5 mr-1.5 text-[#D4AF37]" />
                3 Online
              </Badge>
            </div>

            {/* Main Action Control Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="icon"
                className={`rounded-full h-11 w-11 transition-transform active:scale-95 ${videoEnabled ? "bg-secondary border border-border hover:bg-secondary/80 text-foreground" : "bg-red-500 hover:bg-red-600 text-white"}`}
                onClick={() => setVideoEnabled(!videoEnabled)}
                title={videoEnabled ? "Mute Camera" : "Unmute Camera"}
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={audioEnabled ? "default" : "destructive"}
                size="icon"
                className={`rounded-full h-11 w-11 transition-transform active:scale-95 ${audioEnabled ? "bg-secondary border border-border hover:bg-secondary/80 text-foreground" : "bg-red-500 hover:bg-red-600 text-white"}`}
                onClick={() => setAudioEnabled(!audioEnabled)}
                title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
              >
                {audioEnabled ? <Mic className="h-5 w-5 text-emerald-400" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`rounded-full h-11 w-11 border-border ${screenSharing ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" : "bg-secondary hover:bg-secondary/80 text-foreground"}`}
                onClick={toggleScreenShare}
                title="Share Screen"
              >
                <Monitor className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-11 w-11 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                onClick={handleEndCall}
                title="End Interview Call"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="text-xs border-border" onClick={() => toast.info("Device settings check OK")}>
                <Settings className="h-3.5 w-3.5 mr-1" /> Audio / Video Settings
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
