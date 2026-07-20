namespace Domain.Entities;

public class InterviewFeedback : BaseEntity
{
    public Guid InterviewId { get; set; }

    public Guid HiringManagerId { get; set; }

    public decimal TechnicalScore { get; set; }

    public decimal CommunicationScore { get; set; }

    public decimal OverallScore { get; set; }

    public string? Notes { get; set; }

    public string? Recommendation { get; set; }

    public Interview Interview { get; set; } = null!;

    public HiringManager HiringManager { get; set; } = null!;
}