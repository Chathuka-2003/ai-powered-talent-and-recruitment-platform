namespace Domain.Entities;

public class Experience : BaseEntity
{
    public string Company { get; set; } = string.Empty;

    public string Position { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
}