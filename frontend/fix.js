const fs = require('fs');
const path = 'd:/ai_powered_talent_and_recruitment_platform/frontend/src/app/components/DashboardLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

const searchState =   const mockUsers = {
    jobseeker: { name: "Avery Chen", company: null },
    recruiter: { name: "Sarah Jenkins", company: "Acme Corp" },
    "hiring-manager": { name: "David Kim", company: "Acme Corp" },
    admin: { name: "Elena Rodriguez", company: null }
  };
  const currentUser = mockUsers[normalizedRole];;

const replaceState =   const mockUsersFallback: Record<string, any> = {
    jobseeker: { name: "Avery Chen", company: null },
    recruiter: { name: "Sarah Jenkins", company: "Acme Corp" },
    "hiring-manager": { name: "David Kim", company: "Acme Corp" },
    admin: { name: "Elena Rodriguez", company: null }
  };

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('talentai.user') || "{}"); } catch { return {}; }
  })();

  const [currentUser, setCurrentUser] = useState({
    name: storedUser.firstName ? \\ \\ : mockUsersFallback[normalizedRole].name,
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
        }
      }).catch(console.error);
    }
  }, [storedUser?.id, normalizedRole]);;

content = content.replace(searchState, replaceState);

// Add Recruiter Menu
const searchRecruiterMenu = { icon: LayoutDashboard, label: "Dashboard", path: "/recruiter/dashboard" },;
const replaceRecruiterMenu = { icon: LayoutDashboard, label: "Dashboard", path: "/recruiter/dashboard" },\n      { icon: FileText, label: "Job Requisitions", path: "/recruiter/job-requisitions" },;
content = content.replace(searchRecruiterMenu, replaceRecruiterMenu);

// Add Badges
content = content.replace(adge: 3, adge: unreadMessages > 0 ? unreadMessages : undefined);
content = content.replace(adge: 5, adge: unreadNotifications > 0 ? unreadNotifications : undefined);

// Fix rendering
const searchRender = className="text-xs text-muted-foreground mt-0.5">{roleNames[normalizedRole]} {currentUser.company ? \\\â€¢ \\\\ : ""}</p>;
const replaceRender = className="text-xs text-muted-foreground mt-0.5">{roleNames[normalizedRole]} {currentUser.company ? \\\• \\\\ : ""}</p>;
content = content.replace(searchRender, replaceRender);

// Another render fallback check
const searchRender2 = className="text-xs text-muted-foreground mt-0.5">{roleNames[normalizedRole]} {currentUser.company ? "â€¢ " + currentUser.company : ""}</p>;
const replaceRender2 = className="text-xs text-muted-foreground mt-0.5">{roleNames[normalizedRole]} {currentUser.company ? "• " + currentUser.company : ""}</p>;
content = content.replace(searchRender2, replaceRender2);

fs.writeFileSync(path, content, 'utf8');
