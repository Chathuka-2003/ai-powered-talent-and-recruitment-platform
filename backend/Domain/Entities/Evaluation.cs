namespace Domain.Entities;

public class Evaluation : BaseEntity
{
    public Guid CandidateId { get; set; }

    public Guid HiringManagerId { get; set; }

    public decimal TechnicalRating { get; set; }

    public decimal CommunicationRating { get; set; }

    public decimal OverallRating { get; set; }

    public string? Summary { get; set; }

    public Candidate Candidate { get; set; } = null!;

    public HiringManager HiringManager { get; set; } = null!;
}