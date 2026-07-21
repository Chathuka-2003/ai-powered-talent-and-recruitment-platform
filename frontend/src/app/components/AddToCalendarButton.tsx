/**
 * Reusable "Add to Calendar" dropdown button.
 * Shows Google Calendar and Outlook options, opens in a new tab.
 */
import { useState, useRef, useEffect } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import {
  googleCalendarLink,
  outlookLiveLink,
  outlookOfficeLink,
  interviewToCalendarEvent,
} from "../utils/calendarLinks";

interface Interview {
  position?: string;
  company?: string;
  candidateName?: string;
  date?: string;
  time?: string;
  type?: string;
  meetingLink?: string;
  location?: string;
}

interface AddToCalendarButtonProps {
  interview: Interview;
  compact?: boolean;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0078D4">
    <path d="M24 7.387v13.227L18.452 24l-6.968-1.032V22.5l5.484.484V4.016L12 3.032V1.5l6.452 1.032L24 7.387zM0 8.5l10.968-1.516V22l-2.452-.323V9.935L2.452 10.5 0 8.5zm10.968-7L0 3.016V5.5l2.516-.581L10.968 3.5V1.5z"/>
  </svg>
);

export function AddToCalendarButton({ interview, compact = false }: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const calEvent = interviewToCalendarEvent(interview);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    {
      label: "Google Calendar",
      icon: <GoogleIcon />,
      url: googleCalendarLink(calEvent),
      color: "hover:bg-blue-500/10 hover:text-blue-400",
    },
    {
      label: "Outlook.com",
      icon: <OutlookIcon />,
      url: outlookLiveLink(calEvent),
      color: "hover:bg-[#0078D4]/10 hover:text-[#0078D4]",
    },
    {
      label: "Office 365",
      icon: <OutlookIcon />,
      url: outlookOfficeLink(calEvent),
      color: "hover:bg-[#0078D4]/10 hover:text-[#0078D4]",
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-[#D4AF37]/50 hover:text-[#D4AF37] ${compact ? "text-xs px-2 py-1" : ""}`}
      >
        <CalendarPlus className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        {!compact && <span>Add to Calendar</span>}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 right-0 w-48 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt) => (
            <a
              key={opt.label}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition-colors ${opt.color}`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
