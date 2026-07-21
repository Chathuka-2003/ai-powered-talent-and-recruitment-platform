import { useState, useEffect } from "react";
import { ModuleLayout } from "../../components/ModuleLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
} from "lucide-react";
import { api } from "../../api";

const messagesTabs = [
  { label: "Chat", path: "/messages/chat-list", icon: MessageSquare },
  { label: "Direct Message", path: "/messages/direct-chat", icon: MessageCircle },
  { label: "Email Center", path: "/messages/email-center", icon: Mail },
  { label: "Notifications", path: "/messages/notifications", icon: Bell },
];

export function MessagesNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem("talentai.user") || "{}").id; }
    catch { return null; }
  })();

  useEffect(() => {
    if (currentUserId) {
      api.notifications.getByUser(currentUserId)
        .then(res => setNotifications(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [currentUserId]);

  const markAllRead = async () => {
    if (!currentUserId) return;
    try {
      await api.notifications.markAllAsRead(currentUserId);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ModuleLayout
      title="Notification Center"
      subtitle="All platform notifications and alerts"
      icon={Bell}
      tabs={messagesTabs}
      backPath="/recruiter/dashboard"
      backLabel="Back to Portal"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-4 text-center">
          <div className="text-3xl font-bold text-[#D4AF37]">{notifications.length}</div>
          <div className="text-muted-foreground text-xs mt-1">Total Notifications</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{unreadCount}</div>
          <div className="text-muted-foreground text-xs mt-1">Unread</div>
        </GlassCard>
      </div>

      {/* Controls */}
      <div className="flex justify-end gap-4 mb-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={markAllRead}
          className="text-muted-foreground hover:text-foreground text-xs h-8"
        >
          Mark All Read
        </Button>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {loading ? (
          <GlassCard className="p-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </GlassCard>
        ) : notifications.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-700 mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications to display</p>
          </GlassCard>
        ) : (
          notifications.map((n) => (
            <GlassCard
              key={n.id}
              className={`px-5 py-4 flex items-start gap-4 transition-all hover:border-border ${
                !n.isRead ? "border-[#D4AF37]/25" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                      )}
                    </div>
                    <div className={`text-sm font-semibold ${n.isRead ? "text-gray-300" : "text-foreground"}`}>
                      {n.title}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{n.messageText}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                    {!n.isRead && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[10px] text-muted-foreground hover:text-gray-300 underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </ModuleLayout>
  );
}
