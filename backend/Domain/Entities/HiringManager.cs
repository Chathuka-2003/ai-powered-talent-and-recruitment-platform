namespace Domain.Entities;

public class HiringManager : BaseEntity
{
    public Guid UserId { get; set; }

    public Guid OrganizationId { get; set; }

    public string? Department { get; set; }

    public string? Designation { get; set; }

    public string? PhoneNumber { get; set; }

    public User? User { get; set; }

    public Organization? Organization { get; set; }
}