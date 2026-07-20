namespace Domain.Entities;

public class Candidate : BaseEntity
{
    public Guid UserId { get; set; }

    public string? ProfessionalHeadline { get; set; }

    public string? Summary { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Location { get; set; }

    public bool IsOpenToWork { get; set; }

    public string? PreferredJobRole { get; set; }

    public string? EmploymentType { get; set; }

    public string? PreferredLocation { get; set; }

    public string? WorkPreference { get; set; }

    public int ProfileCompleteness { get; set; }

    public int ProfileViews { get; set; } = 0;

    public string? Status { get; set; }

    public int ResumeScore { get; set; }

    public string? SuggestedSkills { get; set; } // JSON array of strings

    public string? ImprovementSuggestions { get; set; } // JSON array of strings

    public string? ResumeUrl { get; set; }

    public string? ResumeFileName { get; set; }

    public DateTime? ResumeUploadedAt { get; set; }

    public User? User { get; set; }
}