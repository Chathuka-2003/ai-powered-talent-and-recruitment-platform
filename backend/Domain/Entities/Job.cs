using Domain.Enums;

namespace Domain.Entities;

public class Job : BaseEntity
{
    public Guid? RecruiterId { get; set; }
    public Guid? OrganizationId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string EmploymentType { get; set; } = string.Empty;

    public decimal MinimumSalary { get; set; }

    public decimal MaximumSalary { get; set; }

    public DateTime ExpiryDate { get; set; }

    public JobStatus Status { get; set; } = JobStatus.Draft;

    // Navigation Properties
    public Recruiter? Recruiter { get; set; }

    public Organization? Organization { get; set; }

    public ICollection<JobApplication> JobApplications { get; set; }
        = new List<JobApplication>();
}