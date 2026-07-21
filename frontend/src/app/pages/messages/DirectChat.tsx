import { useState } from "react";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  Search,
  Send,
  Plus,
  Circle,
} from "lucide-react";

// Navigation tabs used inside the communications module
const messagesTabs = [
  { label: "Chat", path: "/messages/chat-list", icon: MessageSquare },
  { label: "Direct Message", path: "/messages/direct-chat", icon: MessageCircle },
  { label: "Email Center", path: "/messages/email-center", icon: Mail },
  { label: "Notifications", path: "/messages/notifications", icon: Bell },
];

// Sample conversation data displayed in the conversation list
const conversations = [
  {
    id: 1,
    name: "Marcus Johnson",
    lastMessage: "Thank you! I'll be there at 10 AM sharp.",
    time: "2m ago",
    unread: 2,
    tag: "Candidate",
  },
  {
    id: 2,
    name: "Sarah Chen",
    lastMessage: "The technical assessment scores are in.",
    time: "14m ago",
    unread: 0,
    tag: "Recruiter",
  },
  {
    id: 3,
    name: "Priya Sharma",
    lastMessage: "Could we reschedule to Thursday afternoon?",
    time: "1h ago",
    unread: 1,
    tag: "Candidate",
  },
  {
    id: 4,
    name: "David Park",
    lastMessage: "Panel interview feedback uploaded.",
    time: "2h ago",
    unread: 0,
    tag: "Recruiter",
  },
  {
    id: 5,
    name: "Carlos Rivera",
    lastMessage: "Excited about the opportunity! When do we hear back?",
    time: "3h ago",
    unread: 3,
    tag: "Candidate",
  },
  {
    id: 6,
    name: "Rachel Adams",
    lastMessage: "HR notes for Aisha Patel attached.",
    time: "5h ago",
    unread: 0,
    tag: "Recruiter",
  },
  {
    id: 7,
    name: "Emma Thompson",
    lastMessage: "Portfolio link updated — please review.",
    time: "Yesterday",
    unread: 1,
    tag: "Candidate",
  },
  {
    id: 8,
    name: "Tom Wilson",
    lastMessage: "DevOps round scheduled for the 20th.",
    time: "Yesterday",
    unread: 0,
    tag: "Recruiter",
  },
];

// Sample messages displayed inside the selected conversation
const chatMessages = [
  { id: 1, from: "Marcus Johnson", text: "Hi! I received the interview confirmation email. Thank you so much.", time: "9:45 AM", mine: false },
  { id: 2, from: "You", text: "Great, Marcus! We're looking forward to meeting you. The interview will be via our video platform.", time: "9:47 AM", mine: true },
  { id: 3, from: "Marcus Johnson", text: "Perfect. Should I prepare any specific materials or a portfolio to share?", time: "9:50 AM", mine: false },
  { id: 4, from: "You", text: "Yes, please bring code samples or a live project you're proud of. We'll do a live code review session.", time: "9:52 AM", mine: true },
  { id: 5, from: "Marcus Johnson", text: "Understood. I have a React dashboard I built recently — that should work well.", time: "9:55 AM", mine: false },
  { id: 6, from: "You", text: "That sounds perfect. Thank you! I'll be there at 10 AM sharp.", time: "10:01 AM", mine: true },
];

// Communication statistics displayed at the top of the page
const stats = [
  { label: "Total Conversations", value: "234", color: "text-[#D4AF37]" },
  { label: "Unread", value: "12", color: "text-blue-400" },
  { label: "Response Rate", value: "94%", color: "text-green-400" },
  { label: "Avg Response Time", value: "2.3h", color: "text-purple-400" },
];

export function ChatList() {
  // Store the currently selected conversation
  const [selectedConv, setSelectedConv] = useState(conversations[0]);

  // Store the conversation search input
  const [search, setSearch] = useState("");

  // Store the currently selected conversation filter
  const [filter, setFilter] = useState("All");

  // Store the message currently entered by the user
  const [message, setMessage] = useState("");

  // Available options for filtering conversations
  const filters = ["All", "Unread", "Candidates", "Recruiters"];

  // Filter conversations based on the search text and selected category
  const filteredConvs = conversations.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ||
      (filter === "Unread" && c.unread > 0) ||
      (filter === "Candidates" && c.tag === "Candidate") ||
      (filter === "Recruiters" && c.tag === "Recruiter");

    return matchSearch && matchFilter;
  });

  return (
    <ModuleLayout
      title="Communications"
      subtitle="All your messages and communications in one place"
      icon={MessageSquare}
      tabs={messagesTabs}
      backPath="/recruiter/dashboard"
      backLabel="Back to Portal"
    >
      {/* Display communication statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Button used to start a new conversation */}
      <div className="flex justify-end mb-4">
        <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Main two-panel communications layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: "600px" }}>
        {/* Left panel containing search, filters, and conversations */}
        <GlassCard className="flex flex-col overflow-hidden">
          {/* Conversation search and filter controls */}
          <div className="p-3 border-b border-border">
            {/* Search input for finding conversations by name */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-[#D4AF37]/15 rounded-lg pl-9 pr-3 py-2 text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40"
              />
            </div>

            {/* Conversation category filters */}
            <div className="flex gap-1 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-[#D4AF37] text-black"
                      : "text-muted-foreground hover:text-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Display conversations matching the selected filters */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`w-full flex items-start gap-3 px-4 py-3 border-b border-[#D4AF37]/5 text-left transition-colors ${
                  selectedConv.id === conv.id
                    ? "bg-[#D4AF37]/10 border-l-2 border-l-[#D4AF37]"
                    : "hover:bg-secondary/50"
                }`}
              >
                {/* Display the conversation user's initials */}
                <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-[#D4AF37] text-xs font-bold flex-shrink-0">
                  {conv.name.split(" ").map((n) => n[0]).join("")}
                </div>

                {/* Display the conversation name and latest message */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground text-sm font-medium truncate">{conv.name}</span>

                    {/* Display the time of the latest message */}
                    <span className="text-muted-foreground text-[10px] ml-2 flex-shrink-0">{conv.time}</span>
                  </div>

                  <div className="text-muted-foreground text-xs truncate mt-0.5">{conv.lastMessage}</div>
                </div>

                {/* Display the number of unread messages */}
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Right panel containing the selected conversation */}
        <GlassCard className="md:col-span-2 flex flex-col overflow-hidden">
          {/* Display the selected conversation header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            {/* Display the selected user's initials */}
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-border flex items-center justify-center text-[#D4AF37] text-xs font-bold">
              {selectedConv.name.split(" ").map((n) => n[0]).join("")}
            </div>

            {/* Display the selected user's name and role */}
            <div>
              <div className="text-foreground font-medium">{selectedConv.name}</div>
              <div className="text-muted-foreground text-xs">{selectedConv.tag}</div>
            </div>
          </div>

          {/* Display all messages in the selected conversation */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
              >
                {/* Style sent and received messages differently */}
                <div
                  className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${
                    msg.mine
                      ? "bg-[#D4AF37] text-black rounded-br-sm"
                      : "bg-secondary text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {/* Message content */}
                  <p className="text-sm">{msg.text}</p>

                  {/* Time the message was sent */}
                  <p className={`text-[10px] mt-1 ${msg.mine ? "text-black/60" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message input area */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex gap-3">
              {/* Input used to type a new chat message */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-background border border-[#D4AF37]/15 rounded-xl px-4 py-2.5 text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40"
              />

              {/* Button used to send the entered message */}
              <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-10 w-10 p-0 rounded-xl">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </ModuleLayout>
  );
}