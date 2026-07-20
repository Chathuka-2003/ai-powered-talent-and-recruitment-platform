namespace Domain.Entities;

public class JobApplication : BaseEntity
{
    public Guid CandidateId { get; set; }

    public Guid JobId { get; set; }

    public Guid? ResumeId { get; set; }  // Nullable - resume not always required to apply

    public DateTime AppliedDate { get; set; }

    public decimal? AIMatchScore { get; set; }

    public string? RecruiterNotes { get; set; }

    public string Status { get; set; } = "Applied"; // Applied, Reviewed, Shortlisted, Rejected, Hired

    public Candidate Candidate { get; set; } = null!;

    public Job Job { get; set; } = null!;

    public Resume? Resume { get; set; }
}