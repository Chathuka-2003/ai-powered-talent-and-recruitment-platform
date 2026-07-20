using Domain.Entities;

namespace Domain.Entities;

public class Recruiter : BaseEntity
{
    public Guid UserId { get; set; }

    public Guid OrganizationId { get; set; }

    public string? Department { get; set; }

    public string? JobTitle { get; set; }

    public string? PhoneNumber { get; set; }

    public User? User { get; set; }

    public Organization? Organization { get; set; }

    // Navigation Property
    public ICollection<Job> Jobs { get; set; }
        = new List<Job>();
}