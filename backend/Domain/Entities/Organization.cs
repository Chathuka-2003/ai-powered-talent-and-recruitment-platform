using Domain.Entities;

namespace Domain.Entities;

public class Organization : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Website { get; set; }

    public string? Address { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();

    public ICollection<Recruiter> Recruiters { get; set; } = new List<Recruiter>();

    public ICollection<HiringManager> HiringManagers { get; set; } = new List<HiringManager>();

    public ICollection<Job> Jobs { get; set; } = new List<Job>();
}