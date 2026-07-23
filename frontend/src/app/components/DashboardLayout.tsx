import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { api } from "../api";
import { Button } from "./ui/button";
import { GlassCard } from "./GlassCard";
import { ThemeToggle } from "./ThemeToggle";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  MessageSquare,
  Calendar,
  Search,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Sparkles,
  Shield,
  Building,
  Activity,
  Star,
  ClipboardCheck,
  BarChart3,
  ScrollText,
  UserCheck,
  Video,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { clearCurrentRole, getLoginPathForRole } from "../auth";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "jobseeker" | "job-seeker" | "recruiter" | "hiring-manager" | "admin";
}

type NavigationItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const normalizedRole = role === "job-seeker" ? "jobseeker" : role;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const mockUsersFallback: Record<string, any> = {
    jobseeker: { name: "Avery Chen", company: null },
    recruiter: { name: "Sarah Jenkins", company: "Acme Corp" },
    "hiring-manager": { name: "David Kim", company: "Acme Corp" },
    admin: { name: "Elena Rodriguez", company: null }
  };

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('talentai.user') || "{}"); } catch { return {}; }
  })();

  const [currentUser, setCurrentUser] = useState({
    name: storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName}` : mockUsersFallback[normalizedRole].name,
    company: storedUser.organizationName || mockUsersFallback[normalizedRole].company
  });

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!storedUser?.id) return;
    const fetchCounts = async () => {
      try {
        const [conversations, notifications] = await Promise.all([
          api.messages.getConversations(storedUser.id),
          api.notifications.getByUser(storedUser.id)
        ]);
        const unreadMsgs = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        setUnreadMessages(unreadMsgs);
        const unreadNotifs = notifications.filter((n: any) => !n.isRead).length;
        setUnreadNotifications(unreadNotifs);
      } catch (error) {
        console.error("Failed to fetch badge counts", error);
      }
    };
    fetchCounts();

    if (normalizedRole === 'recruiter' || normalizedRole === 'hiring-manager') {
      const getProfile = normalizedRole === 'recruiter' 
        ? api.recruiters.getProfile(storedUser.id) 
        : api.hiringManager.getProfile(storedUser.id);
      
      getProfile.then((data: any) => {
        if (data?.organization?.name) {
          setCurrentUser(prev => ({ ...prev, company: data.organization.name }));
        } else if (data?.organizationName) {
          setCurrentUser(prev => ({ ...prev, company: data.organizationName }));
        }
      }).catch(() => {});
    }
  }, [storedUser?.id, normalizedRole]);

  const navigationConfig: Record<Exclude<DashboardLayoutProps["role"], "job-seeker">, NavigationItem[]> = {
    jobseeker: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/jobseeker/dashboard" },
      { icon: User, label: "My Profile", path: "/jobseeker/profile" },
      { icon: FileText, label: "Resume Manager", path: "/jobseeker/resume" },
      { icon: Search, label: "Job Search", path: "/jobseeker/jobs" },
      { icon: Briefcase, label: "Applications", path: "/jobseeker/applications" },
      { icon: Sparkles, label: "AI Recommendations", path: "/jobseeker/ai-recommendations" },
      { icon: Sparkles, label: "AI Suite", path: "/jobseeker/ai-suite" },
      { icon: Calendar, label: "Interviews", path: "/jobseeker/interviews" },
      { icon: Video, label: "Video Room", path: "/interviews/video-room" },
      { icon: Calendar, label: "Calendar Integration", path: "/jobseeker/calendar" },
      { icon: MessageSquare, label: "Messages", path: "/jobseeker/messages", badge: unreadMessages > 0 ? unreadMessages : undefined },
      { icon: Bell, label: "Notifications", path: "/jobseeker/notifications", badge: unreadNotifications > 0 ? unreadNotifications : undefined },
      { icon: Settings, label: "Settings", path: "/jobseeker/settings" },
      { icon: LogOut, label: "Logout", path: "/auth/login" },
    ],
    recruiter: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/recruiter/dashboard" },
      { icon: FileText, label: "Job Requisitions", path: "/recruiter/job-requisitions" },
      { icon: Briefcase, label: "Job Postings", path: "/recruiter/jobs" },
      { icon: Search, label: "Candidates", path: "/recruiter/candidates" },
      { icon: FileText, label: "Application Review", path: "/recruiter/applications" },
      { icon: TrendingUp, label: "AI Candidate Ranking", path: "/recruiter/ai-ranking" },
      { icon: Calendar, label: "Interviews", path: "/recruiter/interviews" },
      { icon: Users, label: "Talent Pool", path: "/recruiter/talent-pool" },
      { icon: BarChart3, label: "Analytics", path: "/recruiter/analytics" },
      { icon: Settings, label: "Company Settings", path: "/recruiter/company-settings" },
      { icon: MessageSquare, label: "Messages", path: "/recruiter/messages", badge: unreadMessages > 0 ? unreadMessages : undefined },
      { icon: Bell, label: "Notifications", path: "/recruiter/notifications", badge: unreadNotifications > 0 ? unreadNotifications : undefined },
      { icon: LogOut, label: "Logout", path: "/auth/login" },
    ],
    "hiring-manager": [
      { icon: LayoutDashboard, label: "Dashboard", path: "/hiring-manager/dashboard" },
      { icon: User, label: "My Profile", path: "/hiring-manager/profile" },
      { icon: FileText, label: "Job Requisitions", path: "/hiring-manager/job-requisitions" },
      { icon: Briefcase, label: "Assigned Jobs", path: "/hiring-manager/assigned-jobs" },
      { icon: Users, label: "Candidates", path: "/hiring-manager/candidates" },
      { icon: UserCheck, label: "Candidate Reviews", path: "/hiring-manager/reviews" },
      { icon: Star, label: "Evaluations", path: "/hiring-manager/evaluations" },
      { icon: Calendar, label: "Interviews", path: "/hiring-manager/interviews" },
      { icon: MessageSquare, label: "Interview Feedback", path: "/hiring-manager/feedback" },
      { icon: Calendar, label: "Calendar", path: "/hiring-manager/calendar" },
      { icon: ClipboardCheck, label: "Hiring Decisions", path: "/hiring-manager/decisions" },
      { icon: BarChart3, label: "Reports & Analytics", path: "/hiring-manager/reports" },
      { icon: Mail, label: "Messages", path: "/hiring-manager/messages", badge: unreadMessages > 0 ? unreadMessages : undefined },
      { icon: Bell, label: "Notifications", path: "/hiring-manager/notifications", badge: unreadNotifications > 0 ? unreadNotifications : undefined },
      { icon: Sparkles, label: "AI Suite", path: "/hiring-manager/ai-suite" },
      { icon: Settings, label: "Settings", path: "/hiring-manager/settings" },
      { icon: LogOut, label: "Logout", path: "/auth/login" },
    ],
    admin: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
      { icon: Users, label: "Users", path: "/admin/users" },
      { icon: Shield, label: "Roles", path: "/admin/roles" },
      { icon: Building, label: "Organizations", path: "/admin/organizations" },
      { icon: ScrollText, label: "Audit Logs", path: "/admin/audit-logs" },
      { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
      { icon: Activity, label: "AI Monitoring", path: "/admin/ai-monitoring" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
      { icon: Bell, label: "Notifications", path: "/admin/notifications", badge: unreadNotifications > 0 ? unreadNotifications : undefined },
      { icon: LogOut, label: "Logout", path: "/auth/login" },
    ],
  };

  const navigation = navigationConfig[normalizedRole];
  const handleLogout = () => {
    clearCurrentRole();
    navigate(getLoginPathForRole(normalizedRole));
  };

  const roleNames = {
    jobseeker: "Job Seeker",
    recruiter: "Recruiter",
    "hiring-manager": "Hiring Manager",
    admin: "Administrator",
  };

  const roleColors = {
    jobseeker: "text-[#D4AF37]",
    recruiter: "text-[#E5C158]",
    "hiring-manager": "text-[#C9A227]",
    admin: "text-[#FFD700]",
  };

  // Normalize active path â€” match both old and new path prefixes
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    // Legacy path matching for seeker
    if (path === "/seeker/dashboard" && location.pathname === "/jobseeker/dashboard") return true;
    if (path === "/seeker/profile" && location.pathname === "/jobseeker/profile") return true;
    if (path === "/seeker/resume" && location.pathname === "/jobseeker/resume") return true;
    if (path === "/seeker/job-search" && location.pathname === "/jobseeker/jobs") return true;
    if (path === "/seeker/applications" && location.pathname === "/jobseeker/applications") return true;
    if (path === "/seeker/messages" && location.pathname === "/jobseeker/messages") return true;
    if (path === "/seeker/interviews" && location.pathname === "/jobseeker/interviews") return true;
    // Legacy path matching for manager
    if (path === "/manager/dashboard" && location.pathname === "/hiring-manager/dashboard") return true;
    if (path === "/manager/reviews" && location.pathname.startsWith("/hiring-manager/review")) return true;
    if (path === "/manager/evaluations" && location.pathname.startsWith("/hiring-manager/evaluation")) return true;
    if (path === "/manager/feedback" && location.pathname === "/hiring-manager/feedback") return true;
    if (path === "/manager/decisions" && location.pathname === "/hiring-manager/decisions") return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Top Navigation */}
      <nav className="border-b border-[#D4AF37]/20 bg-[#0F0F0F]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Sparkles className="h-6 w-6 text-[#D4AF37]" />
                <span className="text-xl font-bold text-white">TalentAI</span>
              </button>
              <Badge
                variant="outline"
                className={`hidden md:inline-flex border-[#D4AF37]/40 ${roleColors[normalizedRole]}`}
              >
                {roleNames[normalizedRole]}
              </Badge>
            </div>

            <div className="flex items-center space-x-1">
              {/* Quick AI Tools */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex text-xs text-gray-400 hover:text-[#D4AF37] gap-1"
                onClick={() => navigate("/ai/resume-parsing")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Tools
              </Button>
              {/* Theme Toggle Button (Dark Gold vs LinkedIn Light Theme) */}
              <ThemeToggle />

              {/* Notifications bell */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  const notifPath =
                    normalizedRole === "jobseeker"
                      ? "/jobseeker/notifications"
                      : normalizedRole === "recruiter"
                        ? "/recruiter/notifications"
                        : normalizedRole === "hiring-manager"
                          ? "/messages/notifications"
                          : "/admin/notifications";
                  navigate(notifPath);
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
                )}
              </Button>

              <div className="pl-4 ml-2 border-l border-[#D4AF37]/20 flex items-center">
                <Button
                  variant="ghost"
                  className="relative h-10 flex items-center gap-3 pl-2 pr-4 hover:bg-[#1E1E1E]"
                  onClick={() => navigate(normalizedRole === "jobseeker" ? "/jobseeker/profile" : normalizedRole === "recruiter" ? "/recruiter/profile" : normalizedRole === "hiring-manager" ? "/hiring-manager/profile" : `/${normalizedRole}/settings`)}
                  aria-label="Open my profile"
                >
                  <Avatar className="h-8 w-8 border border-[#D4AF37]/30">
                    <AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37] font-semibold">
                      {currentUser.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-white leading-none">{currentUser.name}</span>
                    <span className="text-xs text-gray-400 mt-1 leading-none">
                      {roleNames[normalizedRole]} {currentUser.company ? ` \u2022 ${currentUser.company}` : ""}
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)]
            border-r border-[#D4AF37]/20 bg-[#0F0F0F] z-40
            transition-all duration-300 ease-in-out overflow-hidden
            ${sidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-16 -translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-3 space-y-1 overflow-y-auto h-full">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  variant={active ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 transition-all ${
                    active
                      ? "bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#E5C158]"
                      : "text-gray-400 hover:text-white hover:bg-[#1E1E1E]"
                  } ${!sidebarOpen ? "lg:justify-center lg:px-0" : ""}`}
                  onClick={() => item.label === "Logout" ? setLogoutOpen(true) : navigate(item.path)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className={`${!sidebarOpen ? "lg:hidden" : ""} truncate`}>{item.label}</span>
                  {item.badge && sidebarOpen && (
                    <Badge
                      className={`ml-auto text-xs shrink-0 ${
                        active
                          ? "bg-[#0F0F0F]/20 text-[#0F0F0F]"
                          : "bg-[#D4AF37]/20 text-[#D4AF37]"
                      }`}
                      variant="secondary"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}

            {/* Divider + Module shortcuts */}
            {sidebarOpen && (
              <div className="pt-4 mt-4 border-t border-[#D4AF37]/10 space-y-1">
                <p className="text-xs text-gray-600 px-3 mb-2 uppercase tracking-wider">Modules</p>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-500 hover:text-[#D4AF37] text-sm"
                  onClick={() => navigate("/ai/resume-parsing")}
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  AI Suite
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-500 hover:text-[#D4AF37] text-sm"
                  onClick={() => navigate("/interviews/calendar")}
                >
                  <Video className="h-4 w-4 shrink-0" />
                  Interviews
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-500 hover:text-[#D4AF37] text-sm"
                  onClick={() => navigate(normalizedRole === "jobseeker" ? "/jobseeker/messages" : "/messages/chat-list")}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  Communications
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="bg-[#1E1E1E] border-[#D4AF37]/20 text-white">
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription className="text-gray-400">You will be redirected to the login page.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DashboardLayout;

