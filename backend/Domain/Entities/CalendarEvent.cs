namespace Domain.Entities;

public class CalendarEvent : BaseEntity
{
    public Guid OrganizerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string EventType { get; set; } = string.Empty;

    public DateTime StartDateTime { get; set; }

    public DateTime EndDateTime { get; set; }

    public string? Location { get; set; }

    public string? Description { get; set; }
}