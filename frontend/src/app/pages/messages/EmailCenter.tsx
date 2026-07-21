import { useState } from "react";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  Star,
  Reply,
  Forward,
  Trash,
  Edit,
  Plus,
  Send,
} from "lucide-react";

const messagesTabs = [
  { label: "Chat", path: "/messages/chat-list", icon: MessageSquare },
  { label: "Direct Message", path: "/messages/direct-chat", icon: MessageCircle },
  { label: "Email Center", path: "/messages/email-center", icon: Mail },
  { label: "Notifications", path: "/messages/notifications", icon: Bell },
];

const folders = [
  { label: "Inbox", count: 24, icon: Mail },
  { label: "Sent", count: 0, icon: Send },
  { label: "Drafts", count: 3, icon: Edit },
  { label: "Templates", count: 0, icon: Star },
  { label: "Starred", count: 7, icon: Star },
];

const emails = [
  {
    id: 1,
    from: "Marcus Johnson",
    email: "marcus.j@gmail.com",
    subject: "Re: Interview Confirmation — Senior Frontend Engineer",
    preview: "Thank you for the confirmation! I'll be ready at 10 AM. Please find my portfolio link below...",
    date: "Jun 17, 10:02 AM",
    starred: true,
    unread: true,
    body: `Hi,\n\nThank you for the interview confirmation email! I'm really excited about this opportunity at TalentAI.\n\nI'll be ready to join the video call at 10:00 AM PST on June 17th. For the technical session, I've prepared my React dashboard project which demonstrates component architecture, performance optimization, and real-time data handling.\n\nPortfolio: https://marcus-dev.io/projects\n\nPlease let me know if there's anything else I should bring or prepare. Looking forward to meeting the team!\n\nBest regards,\nMarcus Johnson`,
  },
  {
    id: 2,
    from: "Priya Sharma",
    email: "priya.s@proton.me",
    subject: "Interview Reschedule Request — Product Manager Role",
    preview: "I apologize for the short notice, but I have a conflict on Thursday. Could we move the HR round to...",
    date: "Jun 16, 3:45 PM",
    starred: false,
    unread: true,
    body: `Hi,\n\nI apologize for the short notice, but I have an unavoidable conflict that has arisen for Thursday's HR round.\n\nCould we possibly reschedule to Friday June 19th any time after 1 PM, or early the following week?\n\nI'm very enthusiastic about the Product Manager role and don't want this to reflect negatively on my application.\n\nThank you for your understanding.\n\nBest,\nPriya Sharma`,
  },
  {
    id: 3,
    from: "LinkedIn Recruiter",
    email: "noreply@linkedin.com",
    subject: "7 new applicants for your Senior Data Engineer posting",
    preview: "Your job posting for Senior Data Engineer has received 7 new applications in the last 24 hours...",
    date: "Jun 16, 9:00 AM",
    starred: false,
    unread: false,
    body: `Your job posting for Senior Data Engineer received 7 new applications in the last 24 hours.\n\nTop matches based on your requirements:\n• Yuki Tanaka — 94% match\n• Derek Walsh — 91% match\n• Natalie Brooks — 88% match\n\nLog in to review these candidates.`,
  },
  {
    id: 4,
    from: "Carlos Rivera",
    email: "crivera@devmail.io",
    subject: "Thank you — Final Interview Confirmation",
    preview: "I wanted to send a quick thank-you note for moving me to the final round. It means a lot...",
    date: "Jun 15, 5:22 PM",
    starred: true,
    unread: false,
    body: `Hello,\n\nI wanted to send a quick thank-you note for advancing me to the final interview round for the DevOps Lead position.\n\nI've thoroughly enjoyed the process so far and feel very aligned with TalentAI's mission and culture. The panel interview with the engineering team was a fantastic conversation.\n\nI'm fully prepared for the final round and have put together a 30-60-90 day infrastructure plan I'd love to share.\n\nWarm regards,\nCarlos Rivera`,
  },
  {
    id: 5,
    from: "HR System",
    email: "hr@talentai.internal",
    subject: "Background Check Completed — Aisha Patel",
    preview: "The background verification for Aisha Patel has been completed successfully. All checks passed...",
    date: "Jun 14, 2:00 PM",
    starred: false,
    unread: false,
    body: `The background verification for Aisha Patel (Data Scientist candidate) has been completed.\n\nVerification Results:\n• Identity Verification: PASSED\n• Employment History: PASSED\n• Education: PASSED\n• Criminal Record: CLEAR\n\nYou may proceed with the offer process at your discretion.`,
  },
  {
    id: 6,
    from: "Emma Thompson",
    email: "emma.t@design.co",
    subject: "Updated Portfolio for UX Designer Position",
    preview: "As requested, I've updated my portfolio with the case studies from my most recent project at...",
    date: "Jun 13, 11:30 AM",
    starred: false,
    unread: false,
    body: `Hi,\n\nAs requested during our initial phone screen, I've updated my portfolio with detailed case studies from my most recent projects.\n\nNew additions:\n• Redesign of a B2B SaaS dashboard (Figma + usability testing)\n• Mobile-first onboarding flow (shipped to 50k+ users)\n• Design system for a fintech startup\n\nPortfolio: https://emma-ux.design\n\nHappy to walk through any of these in the next session.\n\nBest,\nEmma Thompson`,
  },
];

const templates = [
  { id: 1, name: "Interview Invitation", desc: "Invite a candidate to an interview session", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10 border-border" },
  { id: 2, name: "Offer Letter", desc: "Formal job offer with compensation details", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  { id: 3, name: "Rejection Notice", desc: "Respectful decline at any stage", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  { id: 4, name: "Follow-up", desc: "Post-interview status update to candidate", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
];

const stats = [
  { label: "Emails Sent", value: "1,247", color: "text-[#D4AF37]" },
  { label: "Open Rate", value: "68%", color: "text-blue-400" },
  { label: "Response Rate", value: "42%", color: "text-green-400" },
  { label: "Templates Used", value: "89", color: "text-purple-400" },
];

export function EmailCenter() {
  const [selectedFolder, setSelectedFolder] = useState("Inbox");
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);
  const [composing, setComposing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  return (
    <ModuleLayout
      title="Email Center"
      subtitle="Professional email communications and templates"
      icon={Mail}
      tabs={messagesTabs}
      backPath="/recruiter/dashboard"
      backLabel="Back to Portal"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Compose button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => { setComposing(true); setShowTemplates(false); }}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 gap-2"
        >
          <Plus className="h-4 w-4" />
          Compose
        </Button>
      </div>

      {/* Compose form */}
      {composing && (
        <GlassCard className="p-5 mb-6 border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-foreground font-semibold">New Email</h3>
            <button onClick={() => setComposing(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">To</label>
              <input
                type="text"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                placeholder="recipient@email.com"
                className="w-full bg-background border border-[#D4AF37]/15 rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Subject</label>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Email subject..."
                className="w-full bg-background border border-[#D4AF37]/15 rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Template (optional)</label>
              <select className="w-full bg-background border border-[#D4AF37]/15 rounded-lg px-3 py-2 text-muted-foreground text-sm focus:outline-none focus:border-[#D4AF37]/40">
                <option value="">Select a template...</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-muted-foreground text-xs mb-1 block">Message</label>
              <textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                className="w-full bg-background border border-[#D4AF37]/15 rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 gap-2">
                <Send className="h-4 w-4" />
                Send Email
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setComposing(false)}>
                Discard
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Three-column layout */}
      <div className="grid grid-cols-12 gap-4" style={{ height: "580px" }}>
        {/* Sidebar */}
        <GlassCard className="col-span-2 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Folders</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {folders.map((folder) => {
              const FolderIcon = folder.icon;
              return (
                <button
                  key={folder.label}
                  onClick={() => { setSelectedFolder(folder.label); setShowTemplates(folder.label === "Templates"); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 text-sm transition-all ${
                    selectedFolder === folder.label
                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-3.5 w-3.5" />
                    <span className="text-xs">{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-1.5 font-medium">
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Email list */}
        <GlassCard className="col-span-4 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <h3 className="text-foreground font-semibold text-sm">{selectedFolder}</h3>
          </div>

          {showTemplates ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className={`rounded-lg border p-3 cursor-pointer hover:opacity-80 transition-opacity ${t.bg}`}
                >
                  <div className={`text-sm font-semibold ${t.color}`}>{t.name}</div>
                  <div className="text-muted-foreground text-xs mt-1">{t.desc}</div>
                  <button
                    onClick={() => { setComposing(true); setShowTemplates(false); }}
                    className={`mt-2 text-[10px] font-medium ${t.color} hover:underline`}
                  >
                    Use Template →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full flex items-start gap-2 px-3 py-3 border-b border-[#D4AF37]/5 text-left transition-colors ${
                    selectedEmail.id === email.id
                      ? "bg-[#D4AF37]/10 border-l-2 border-l-[#D4AF37]"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Star
                      className={`h-3.5 w-3.5 ${email.starred ? "text-[#D4AF37] fill-current" : "text-gray-700"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium truncate ${email.unread ? "text-foreground" : "text-muted-foreground"}`}>
                        {email.from}
                      </span>
                      <span className="text-muted-foreground text-[9px] ml-1 flex-shrink-0">{email.date.split(",")[0]}</span>
                    </div>
                    <div className={`text-xs truncate mt-0.5 ${email.unread ? "text-gray-200 font-medium" : "text-muted-foreground"}`}>
                      {email.subject}
                    </div>
                    <div className="text-muted-foreground text-[10px] truncate mt-0.5">{email.preview}</div>
                  </div>
                  {email.unread && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0 mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Email detail */}
        <GlassCard className="col-span-6 flex flex-col overflow-hidden">
          {selectedEmail && !showTemplates ? (
            <>
              <div className="p-5 border-b border-border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-foreground font-semibold text-base leading-snug pr-4">
                    {selectedEmail.subject}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-[#D4AF37]">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-8">From</span>
                    <span className="text-gray-300">{selectedEmail.from} &lt;{selectedEmail.email}&gt;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-8">Date</span>
                    <span className="text-gray-300">{selectedEmail.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {selectedEmail.body}
                </p>
              </div>
              <div className="px-5 py-4 border-t border-border flex gap-3">
                <Button size="sm" className="bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 border border-border gap-2">
                  <Reply className="h-3.5 w-3.5" />
                  Reply
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground gap-2">
                  <Forward className="h-3.5 w-3.5" />
                  Forward
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Select an email to read</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </ModuleLayout>
  );
}
