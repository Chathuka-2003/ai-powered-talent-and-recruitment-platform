namespace Domain.Entities;

public class Education : BaseEntity
{
    public string Institution { get; set; } = string.Empty;

    public string Degree { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
}