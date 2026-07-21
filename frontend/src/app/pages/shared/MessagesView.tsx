import { useState, useEffect, useRef } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Mic, Paperclip, Phone, Send, Smile, Video, PhoneOff } from "lucide-react";
import { api } from "../../api";

type CallState = "incoming" | "active" | null;

export function MessagesView({ roleName }: { roleName: string }) {
  const [call, setCall] = useState<CallState>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem("talentai.user") || "{}").id; }
    catch { return null; }
  })();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (currentUserId) {
      Promise.all([
        api.messages.getConversations(currentUserId),
        api.users.getContacts(currentUserId)
      ])
      .then(([convs, conts]) => {
        setConversations(convs);
        setContacts(conts);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [currentUserId]);

  const displayList = [...conversations];
  contacts.forEach(contact => {
    if (!displayList.find(c => c.peer.id === contact.id)) {
      displayList.push({ peer: contact, lastMessage: "Start a conversation", lastMessageTime: null, unreadCount: 0 });
    }
  });

  useEffect(() => {
    if (selectedPeer && currentUserId) {
      api.messages.getConversation(currentUserId, selectedPeer.id)
        .then(res => {
          setMessages(res);
          scrollToBottom();
          // Mark unread as read
          res.forEach((m: any) => {
            if (!m.isRead && m.receiverId === currentUserId) {
              api.messages.markAsRead(m.id);
            }
          });
        });
    }
  }, [selectedPeer, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedPeer || !currentUserId) return;
    try {
      const newMsg = await api.messages.send(currentUserId, selectedPeer.id, inputText);
      setMessages(prev => [...prev, newMsg]);
      setInputText("");
      // Update last message in conversation list
      setConversations(prev => {
        const exists = prev.find(c => c.peer.id === selectedPeer.id);
        if (exists) {
          return prev.map(c => c.peer.id === selectedPeer.id ? { ...c, lastMessage: newMsg.content, lastMessageTime: newMsg.sentAt } : c);
        } else {
          return [{ peer: selectedPeer, lastMessage: newMsg.content, lastMessageTime: newMsg.sentAt, unreadCount: 0 }, ...prev];
        }
      });
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#D4AF37]">Dashboard / Messages</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Communicate directly with {roleName === "jobseeker" ? "recruiters" : "candidates and team members"} through secure chat.</p>
      </div>

      <div className="grid xl:grid-cols-[380px_1fr] gap-6 h-[720px]">
        <GlassCard className="p-4 flex flex-col">
          <Input placeholder="Search conversations" className="bg-secondary border-border text-foreground mb-4" />
          <div className="space-y-2 overflow-y-auto">
            {loading ? <p className="text-muted-foreground p-4">Loading conversations...</p> : 
             displayList.length === 0 ? <p className="text-muted-foreground p-4">No contacts available.</p> :
             displayList.map((c, i) => (
              <button 
                key={c.peer.id} 
                onClick={() => setSelectedPeer(c.peer)}
                className={`w-full text-left rounded-xl p-4 border transition-colors ${selectedPeer?.id === c.peer.id ? "bg-[#D4AF37]/10 border-border" : "bg-secondary/40 border-border hover:border-[#D4AF37]/25"}`}
              >
                <div className="flex gap-3">
                  <Avatar><AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37]">{(c.peer.firstName?.[0] || "") + (c.peer.lastName?.[0] || "")}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <h3 className="text-foreground font-medium truncate">{c.peer.firstName} {c.peer.lastName}</h3>
                        <Badge variant="outline" className="text-[9px] uppercase border-[#D4AF37]/30 text-[#D4AF37] px-1 py-0">
                          {typeof c.peer.role === 'string' 
                            ? c.peer.role.replace('-', ' ') 
                            : (c.peer.role === 1 ? 'Recruiter' : c.peer.role === 2 ? 'Hiring Manager' : c.peer.role === 3 ? 'Candidate' : 'Admin')}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                    </div>
                    <p className={`text-sm truncate ${!c.lastMessageTime ? 'text-[#D4AF37]/60 italic' : 'text-muted-foreground'}`}>{c.lastMessage}</p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-muted-foreground">{c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleDateString() : ''}</span>
                      {c.unreadCount > 0 && <Badge className="bg-[#D4AF37] text-black">{c.unreadCount}</Badge>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-0 flex flex-col overflow-hidden">
          {selectedPeer ? (
            <>
              <div className="p-5 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37]">{(selectedPeer.firstName?.[0] || "") + (selectedPeer.lastName?.[0] || "")}</AvatarFallback></Avatar>
                  <div>
                    <h2 className="text-foreground font-semibold">{selectedPeer.firstName} {selectedPeer.lastName}</h2>
                    <p className="text-sm text-[#D4AF37] capitalize">{selectedPeer.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCall("active")}><Phone className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setCall("active")}><Video className="h-4 w-4" /></Button>
                </div>
              </div>
              
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((m: any) => (
                  <Bubble key={m.id} text={m.content} mine={m.senderId === currentUserId} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-5 border-t border-border flex gap-2">
                <Button variant="outline" size="icon"><Paperclip className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Smile className="h-4 w-4" /></Button>
                <Input 
                  placeholder="Type a message..." 
                  className="bg-secondary border-border text-foreground"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </GlassCard>
      </div>

      {call && (
        <GlassCard className="fixed bottom-6 right-6 z-50 w-80 p-5 border-[#D4AF37]/40">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Mic />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">{call === "incoming" ? "Incoming Call" : "Active Call"}</h3>
              <p className="text-sm text-muted-foreground">{selectedPeer?.firstName} {selectedPeer?.lastName}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            {call === "incoming" && <Button className="flex-1" onClick={() => setCall("active")}>Accept</Button>}
            <Button variant="destructive" className="flex-1" onClick={() => setCall(null)}><PhoneOff className="mr-2 h-4 w-4" />End Call</Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function Bubble({ text, mine }: { text: string; mine?: boolean }) { 
  return (
    <div className={`max-w-[76%] rounded-2xl p-4 text-sm ${mine ? "ml-auto bg-[#D4AF37]/20 text-foreground" : "bg-secondary text-gray-300"}`}>
      {text}
    </div>
  ); 
}
