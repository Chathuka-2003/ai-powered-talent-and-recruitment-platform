namespace Domain.Entities;

public class Resume : BaseEntity
{
    public string FileName { get; set; } = string.Empty;

    public string FileUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
}