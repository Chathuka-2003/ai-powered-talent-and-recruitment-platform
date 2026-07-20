namespace Domain.Entities;

public class HiringDecision : BaseEntity
{
    public Guid ApplicationId { get; set; }

    public Guid HiringManagerId { get; set; }

    public decimal? AIMatchScore { get; set; }

    public string? Notes { get; set; }

    public DateTime? DecisionDate { get; set; }

    public JobApplication Application { get; set; } = null!;

    public HiringManager HiringManager { get; set; } = null!;
}