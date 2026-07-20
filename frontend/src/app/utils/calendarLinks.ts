/**
 * Calendar deep-link generators for Google Calendar and Microsoft Outlook.
 * These require NO OAuth — they simply open the calendar app with a pre-filled event.
 */

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  meetingLink?: string;
}

/** Formats a Date to the compact format Google Calendar expects: 20260717T100000Z */
function toGoogleDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Build a "Add to Google Calendar" deep link */
export function googleCalendarLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleDate(event.startDate)}/${toGoogleDate(event.endDate)}`,
    details: [
      event.description ?? "",
      event.meetingLink ? `\nJoin: ${event.meetingLink}` : "",
    ]
      .filter(Boolean)
      .join(""),
    location: event.location ?? (event.meetingLink ?? ""),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Build an "Add to Outlook.com" deep link */
export function outlookLiveLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
    body: [
      event.description ?? "",
      event.meetingLink ? `Join: ${event.meetingLink}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    location: event.location ?? (event.meetingLink ?? ""),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** Build an "Add to Office 365 Outlook" deep link */
export function outlookOfficeLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
    body: [
      event.description ?? "",
      event.meetingLink ? `Join: ${event.meetingLink}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    location: event.location ?? (event.meetingLink ?? ""),
  });
  return `https://outlook.office.com/calendar/action/compose?${params.toString()}`;
}

/**
 * Parse a date string like "June 17, 2026" + time "10:00 AM" into a Date object.
 * Falls back gracefully if parsing fails.
 */
export function parseInterviewDateTime(dateStr: string, timeStr: string): Date {
  try {
    // timeStr might be "10:00 - 11:00", so we extract just the start time
    const cleanTime = timeStr ? timeStr.split('-')[0].trim() : "";
    const d = new Date(`${dateStr} ${cleanTime}`);
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
}

/**
 * Build a CalendarEvent object from an interview record returned by the backend.
 */
export function interviewToCalendarEvent(interview: {
  position?: string;
  company?: string;
  candidateName?: string;
  date?: string;
  time?: string;
  type?: string;
  meetingLink?: string;
  location?: string;
}): CalendarEvent {
  const start = parseInterviewDateTime(interview.date ?? "", interview.time ?? "");
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

  const titleParts = [
    "Interview",
    interview.candidateName ? `with ${interview.candidateName}` : null,
    interview.position ? `– ${interview.position}` : null,
  ].filter(Boolean);

  return {
    title: titleParts.join(" "),
    description: [
      interview.company ? `Company: ${interview.company}` : null,
      interview.type ? `Type: ${interview.type}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    location: interview.location ?? interview.meetingLink ?? "Virtual",
    meetingLink: interview.meetingLink,
    startDate: start,
    endDate: end,
  };
}
