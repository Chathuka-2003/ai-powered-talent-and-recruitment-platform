import { useState } from "react";
import { useNavigate } from "react-router";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  Circle,
  Check,
} from "lucide-react";

const messagesTabs = [
  { label: "Chat", path: "/messages/chat-list", icon: MessageSquare },
  { label: "Direct Message", path: "/messages/direct-chat", icon: MessageCircle },
  { label: "Email Center", path: "/messages/email-center", icon: Mail },
  { label: "Notifications", path: "/messages/notifications", icon: Bell },
];

const contacts = [
  {
    id: 1,
    name: "Marcus Johnson",
    role: "Senior Frontend Engineer",
    company: "Candidate",
    online: true,
    lastSeen: "Online",
    unread: 2,
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Technical Lead",
    company: "TalentAI (Interviewer)",
    online: true,
    lastSeen: "Online",
    unread: 0,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Product Manager",
    company: "Candidate",
    online: false,
    lastSeen: "2h ago",
    unread: 1,
  },
  {
    id: 4,
    name: "David Park",
    role: "Engineering Manager",
    company: "TalentAI (Hiring)",
    online: true,
    lastSeen: "Online",
    unread: 0,
  },
  {
    id: 5,
    name: "Carlos Rivera",
    role: "DevOps Lead",
    company: "Candidate",
    online: false,
    lastSeen: "30m ago",
    unread: 0,
  },
];

const threadMessages = [
  { id: 1, mine: false, text: "Hi! Just wanted to confirm I received the video link for tomorrow's interview.", time: "Jun 16 · 4:15 PM", read: true },
  { id: 2, mine: true, text: "Hi Marcus! Yes, you'll receive a reminder email 15 minutes before. The session starts at 10 AM PST.", time: "Jun 16 · 4:18 PM", read: true },
  { id: 3, mine: false, text: "Perfect. Will there be any coding exercises during the technical session?", time: "Jun 16 · 4:20 PM", read: true },
  { id: 4, mine: true, text: "Yes — we'll do a live code review and one small problem-solving exercise. It's collaborative, not a quiz.", time: "Jun 16 · 4:23 PM", read: true },
  { id: 5, mine: false, text: "That sounds great. I prefer that format. I'll bring my React dashboard project to walk through.", time: "Jun 16 · 4:25 PM", read: true },
  { id: 6, mine: true, text: "Excellent choice! Sarah Chen will be leading the technical portion. She's very collaborative.", time: "Jun 16 · 4:27 PM", read: true },
  { id: 7, mine: false, text: "Looking forward to it. Quick question — should I use screen share from my end or will you host it?", time: "Jun 17 · 9:10 AM", read: true },
  { id: 8, mine: true, text: "You can share your screen — our video room supports that natively. Just click the Monitor icon in the toolbar.", time: "Jun 17 · 9:12 AM", read: true },
  { id: 9, mine: false, text: "Got it. Thank you! I'll be there at 10 AM sharp.", time: "Jun 17 · 9:15 AM", read: true },
  { id: 10, mine: true, text: "We're looking forward to it, Marcus. Good luck!", time: "Jun 17 · 9:17 AM", read: true },
];

export function DirectChat() {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [isTyping] = useState(true);

  return (
    <ModuleLayout
      title="Direct Messages"
      subtitle="Private one-on-one messaging"
      icon={MessageCircle}
      tabs={messagesTabs}
      backPath="/recruiter/dashboard"
      backLabel="Back to Portal"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: "640px" }}>
        {/* Left: contact list */}
        <GlassCard className="flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-foreground font-semibold text-sm">Direct Messages</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Private conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-start gap-3 px-4 py-3 border-b border-[#D4AF37]/5 text-left transition-colors ${
                  selectedContact.id === contact.id
                    ? "bg-[#D4AF37]/10 border-l-2 border-l-[#D4AF37]"
                    : "hover:bg-secondary/50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                    {contact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1E1E1E] ${
                      contact.online ? "bg-green-400" : "bg-gray-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground text-sm font-medium truncate">{contact.name}</span>
                    {contact.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs truncate">{contact.role}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Circle
                      className={`h-1.5 w-1.5 fill-current ${
                        contact.online ? "text-green-400" : "text-muted-foreground"
                      }`}
                    />
                    <span className={`text-[10px] ${contact.online ? "text-green-400" : "text-muted-foreground"}`}>
                      {contact.lastSeen}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Right: chat thread */}
        <GlassCard className="md:col-span-2 flex flex-col overflow-hidden">
          {/* Contact header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-border flex items-center justify-center text-[#D4AF37] text-sm font-bold">
                  {selectedContact.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {selectedContact.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#1E1E1E]" />
                )}
              </div>
              <div>
                <div className="text-foreground font-semibold">{selectedContact.name}</div>
                <div className="text-muted-foreground text-xs">{selectedContact.role} · {selectedContact.company}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground h-9 w-9 p-0"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-[#D4AF37] h-9 w-9 p-0"
                onClick={() => navigate("/interviews/video-room")}
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {threadMessages.map((msg, idx) => {
              const showDate = idx === 0 || threadMessages[idx - 1].time.split(" · ")[0] !== msg.time.split(" · ")[0];
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="text-center text-muted-foreground text-[10px] my-3">
                      {msg.time.split(" · ")[0]}
                    </div>
                  )}
                  <div className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-sm rounded-2xl px-4 py-2.5 ${
                        msg.mine
                          ? "bg-[#D4AF37] text-black rounded-br-sm"
                          : "bg-secondary text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 ${msg.mine ? "justify-end" : ""}`}>
                        <span className={`text-[10px] ${msg.mine ? "text-black/60" : "text-muted-foreground"}`}>
                          {msg.time.split(" · ")[1]}
                        </span>
                        {msg.mine && (
                          <div className="flex">
                            <Check className="h-3 w-3 text-black/60" />
                            <Check className="h-3 w-3 text-black/60 -ml-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && selectedContact.id === 1 && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="text-muted-foreground text-xs mr-1">Marcus Johnson is typing</span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex items-center gap-2">
              <button className="text-muted-foreground hover:text-gray-300 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
              <button className="text-muted-foreground hover:text-gray-300 transition-colors">
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-background border border-[#D4AF37]/15 rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40"
              />
              <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-10 w-10 p-0 rounded-xl flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </ModuleLayout>
  );
}
