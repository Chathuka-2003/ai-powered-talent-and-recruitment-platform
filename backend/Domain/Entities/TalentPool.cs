namespace Domain.Entities;

public class TalentPool : BaseEntity
{
    public Guid RecruiterId { get; set; }

    public Guid CandidateId { get; set; }

    public DateTime AddedDate { get; set; }

    public string? Notes { get; set; }

    public string? Status { get; set; }

    public Recruiter Recruiter { get; set; } = null!;

    public Candidate Candidate { get; set; } = null!;
}