import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  CalendarDays,
  GitBranch,
  Video,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Plug,
  PlugZap,
  Bell,
  Zap,
  Settings2,
  ExternalLink,
  Shield,
  CalendarCheck,
} from "lucide-react";
import { api } from "../../api";
import { getCurrentRole } from "../../auth";

const interviewTabs = [
  { label: "Schedule", path: "/interviews/schedule", icon: Calendar },
  { label: "Calendar", path: "/interviews/calendar", icon: CalendarDays },
  { label: "Timeline", path: "/interviews/timeline", icon: GitBranch },
  { label: "Video Room", path: "/interviews/video-room", icon: Video },
  { label: "Integrations", path: "/interviews/calendar-integration", icon: Settings2 },
];

interface CalendarConnection {
  provider: string;
  calendarEmail: string | null;
  autoSync: boolean;
  reminderMinutes: number;
  isExpired: boolean;
}

const REMINDER_OPTIONS = [
  { value: 15, label: "15 min before" },
  { value: 30, label: "30 min before" },
  { value: 60, label: "1 hour before" },
];

const GoogleIcon = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const OutlookIcon = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="4" fill="#0078D4"/>
    <path d="M13 5v14l8-2V7l-8-2zM3 8.5l8-1.5v10L3 15.5V8.5z" fill="white" opacity="0.9"/>
    <rect x="3" y="10" width="8" height="4" rx="1" fill="white" opacity="0.3"/>
  </svg>
);

export function CalendarIntegration() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(30);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const user = (() => {
    try {
      const u = localStorage.getItem("talentai.user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  })();
  const userId = user?.id;
  const userRole = user?.role || "jobseeker";

  const loadConnections = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await api.calendar.getConnections(userId);
      setConnections(data);
      if (data.length > 0) {
        setAutoSync(data[0].autoSync);
        setReminderMinutes(data[0].reminderMinutes);
      }
    } catch (e) {
      console.error("Failed to load calendar connections", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConnections();
    // Handle OAuth callback params in URL
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const code = params.get("code");
    if (provider && code && userId) {
      handleOAuthCallback(provider, code);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [loadConnections]);

  const handleOAuthCallback = async (provider: string, code: string) => {
    setConnecting(provider);
    try {
      await api.calendar.handleCallback(provider, userId, code);
      await loadConnections();
    } catch (e) {
      console.error("OAuth callback failed", e);
    } finally {
      setConnecting(null);
    }
  };

  const handleConnect = async (provider: string) => {
    if (!userId) return;
    setConnecting(provider);
    try {
      const { url } = await api.calendar.getAuthUrl(provider, userId);
      window.location.href = url;
    } catch (e: any) {
      // If not configured, show a helpful message
      alert(e.message || `${provider} Calendar is not configured yet. Add OAuth credentials to appsettings.json.`);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!userId) return;
    setDisconnecting(provider);
    try {
      await api.calendar.disconnect(provider, userId);
      await loadConnections();
    } catch (e) {
      console.error("Disconnect failed", e);
    } finally {
      setDisconnecting(null);
    }
  };

  const handleSavePreferences = async () => {
    if (!userId) return;
    setSavingPrefs(true);
    try {
      await api.calendar.updatePreferences(userId, autoSync, reminderMinutes);
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 2500);
    } catch (e) {
      console.error("Save prefs failed", e);
    } finally {
      setSavingPrefs(false);
    }
  };

  const isConnected = (provider: string) =>
    connections.some((c) => c.provider === provider && !c.isExpired);

  const getConnection = (provider: string) =>
    connections.find((c) => c.provider === provider);

  const providers = [
    {
      id: "google",
      name: "Google Calendar",
      description: "Sync interviews directly to your Google Calendar account.",
      icon: <GoogleIcon />,
      accentColor: "#4285F4",
      bgColor: "from-blue-500/5 to-transparent",
      borderColor: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/50",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      id: "microsoft",
      name: "Microsoft Outlook",
      description: "Sync interviews to Outlook.com or Office 365 calendar.",
      icon: <OutlookIcon />,
      accentColor: "#0078D4",
      bgColor: "from-[#0078D4]/5 to-transparent",
      borderColor: "border-[#0078D4]/20",
      hoverBorder: "hover:border-[#0078D4]/50",
      badgeColor: "bg-[#0078D4]/10 text-[#0078D4] border-[#0078D4]/20",
    },
  ];

  return (
    <DashboardLayout role={userRole as any}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar Integration</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Connect your calendar to automatically sync interview events</p>
        </div>

        {/* Connection cards */}
        {providers.map((prov) => {
          const connected = isConnected(prov.id);
          const conn = getConnection(prov.id);
          const isBusy = connecting === prov.id || disconnecting === prov.id;

          return (
            <GlassCard
              key={prov.id}
              className={`p-6 bg-gradient-to-r ${prov.bgColor} border ${connected ? prov.borderColor : "border-border"} transition-all duration-300 ${!connected ? prov.hoverBorder : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl p-2 bg-card border border-border shadow-sm">
                    {prov.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{prov.name}</h3>
                      {connected ? (
                        <Badge className={`text-xs border ${prov.badgeColor}`}>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{prov.description}</p>
                    {connected && conn?.calendarEmail && (
                      <p className="text-xs mt-1.5 text-foreground/60">
                        <span className="text-muted-foreground">Syncing to:</span>{" "}
                        <span className="font-medium">{conn.calendarEmail}</span>
                      </p>
                    )}
                    {conn?.isExpired && (
                      <p className="text-xs mt-1 text-yellow-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Token expired — reconnect to restore sync
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(prov.id)}
                      disabled={isBusy}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      {disconnecting === prov.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <PlugZap className="w-4 h-4 mr-2" />
                      )}
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(prov.id)}
                      disabled={isBusy}
                      className="bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90"
                    >
                      {connecting === prov.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plug className="w-4 h-4 mr-2" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Feature list */}
              {!connected && (
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3">
                  {[
                    { icon: <Zap className="w-3.5 h-3.5" />, text: "Auto-sync events" },
                    { icon: <Bell className="w-3.5 h-3.5" />, text: "Smart reminders" },
                    { icon: <Shield className="w-3.5 h-3.5" />, text: "Secure OAuth 2.0" },
                  ].map((f) => (
                    <div key={f.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="text-[#D4AF37]">{f.icon}</span>
                      {f.text}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          );
        })}

        {/* Preferences */}
        <GlassCard className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-[#D4AF37]" />
            Sync Preferences
          </h3>

          <div className="space-y-6">
            {/* Auto-sync toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-sync new interviews</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically add newly scheduled interviews to connected calendars
                </p>
              </div>
              <button
                onClick={() => setAutoSync((a) => !a)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  autoSync ? "bg-[#D4AF37]" : "bg-card border border-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    autoSync ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Reminder options */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                Event reminder
              </p>
              <div className="flex gap-2">
                {REMINDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setReminderMinutes(opt.value)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      reminderMinutes === opt.value
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-border text-muted-foreground hover:border-[#D4AF37]/40 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Preferences apply to all connected calendars
              </p>
              <Button
                size="sm"
                onClick={handleSavePreferences}
                disabled={savingPrefs || connections.length === 0}
                className={`min-w-[120px] transition-all ${
                  prefsSaved
                    ? "bg-green-600 text-white"
                    : "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                }`}
              >
                {savingPrefs ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : prefsSaved ? (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                ) : null}
                {prefsSaved ? "Saved!" : "Save Preferences"}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* How it works */}
        <GlassCard className="p-6 bg-gradient-to-r from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/10">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
            How it works
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Connect",
                desc: "Click Connect and authorize TalentAI to manage your calendar",
              },
              {
                step: "2",
                title: "Auto-sync",
                desc: "All upcoming interview events are automatically added to your calendar",
              },
              {
                step: "3",
                title: "Get reminded",
                desc: "Receive calendar reminders before each interview based on your preferences",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick add links note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
          <CalendarDays className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Quick-add without connecting</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every interview card has an <strong className="text-foreground">"Add to Calendar"</strong> button 
              that opens Google Calendar or Outlook with the event pre-filled — no account connection required.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
