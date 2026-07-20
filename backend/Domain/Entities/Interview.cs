namespace Domain.Entities;

public class Interview : BaseEntity
{
    public Guid ApplicationId { get; set; }

    public Guid CandidateId { get; set; }

    public Guid RecruiterId { get; set; }

    public DateTime InterviewDate { get; set; }

    public TimeSpan InterviewTime { get; set; }

    public string? Location { get; set; }

    public string? MeetingLink { get; set; }

    public string Status { get; set; } = "Upcoming"; // Upcoming, Completed, Cancelled, Pending, Reschedule Requested

    public string Type { get; set; } = "Technical"; // Phone, Technical, HR, Panel

    public JobApplication Application { get; set; } = null!;

    public Candidate Candidate { get; set; } = null!;

    public Recruiter Recruiter { get; set; } = null!;
}