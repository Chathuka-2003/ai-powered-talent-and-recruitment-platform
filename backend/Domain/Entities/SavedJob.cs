namespace Domain.Entities;

public class SavedJob : BaseEntity
{
    public Guid CandidateId { get; set; }

    public Guid JobId { get; set; }

    public Candidate Candidate { get; set; } = null!;

    public Job Job { get; set; } = null!;
}
