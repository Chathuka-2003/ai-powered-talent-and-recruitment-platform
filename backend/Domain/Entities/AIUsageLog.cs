namespace Domain.Entities;

public class AIUsageLog : BaseEntity
{
    public Guid UserId { get; set; }

    public string Feature { get; set; } = string.Empty;

    public int TokensUsed { get; set; }

    public decimal? Cost { get; set; }

    public User User { get; set; } = null!;
}