namespace Domain.Entities;

public class JobRequisition : BaseEntity
{
    public Guid HiringManagerId { get; set; }

    public Guid OrganizationId { get; set; }

    public string JobTitle { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string? SalaryRange { get; set; }

    public string EmploymentType { get; set; } = string.Empty;

    public int NumberOfPositions { get; set; }

    public string? JobDescription { get; set; }

    public string? ApprovalStatus { get; set; }

    public HiringManager HiringManager { get; set; } = null!;

    public Organization Organization { get; set; } = null!;
}