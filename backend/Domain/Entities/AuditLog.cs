namespace Domain.Entities;

public class AuditLog : BaseEntity
{
    public Guid UserId { get; set; }

    public string Action { get; set; } = string.Empty;

    public string Resource { get; set; } = string.Empty;

    public string? Details { get; set; }

    public string? IpAddress { get; set; }

    public User User { get; set; } = null!;
}