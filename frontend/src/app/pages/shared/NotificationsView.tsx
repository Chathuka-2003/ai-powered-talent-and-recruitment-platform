import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Badge } from "../../components/ui/badge";
import { Bell, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { api } from "../../api";

export function NotificationsView() {
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

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!currentUserId) return;
    try {
      await api.notifications.markAllAsRead(currentUserId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-[#D4AF37]">Dashboard / Notifications</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Application, interview, message, AI recommendation, and profile alerts.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead}>
          <Check className="w-4 h-4 mr-2" /> Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-muted-foreground">Loading notifications...</p> :
         notifications.length === 0 ? <p className="text-muted-foreground">No notifications yet.</p> :
         notifications.map(n => (
          <GlassCard key={n.id} className={`p-5 ${!n.isRead ? "border-l-4 border-l-[#D4AF37]" : ""}`}>
            <div className="flex gap-4">
              <div className="rounded-xl bg-[#D4AF37]/10 p-3 h-fit">
                <Bell className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between gap-3">
                  <h2 className="text-foreground font-semibold">🔔 {n.title}</h2>
                  <div className="flex gap-2 items-center">
                    {!n.isRead && (
                      <button onClick={() => handleMarkAsRead(n.id)} className="text-xs text-[#D4AF37] hover:underline">Mark as read</button>
                    )}
                    <Badge variant={n.isRead ? "outline" : "default"}>{n.isRead ? "Read" : "Unread"}</Badge>
                  </div>
                </div>
                <p className="text-gray-300 mt-1">{n.messageText}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
