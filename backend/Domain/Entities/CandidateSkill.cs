namespace Domain.Entities;

public class CandidateSkill : BaseEntity
{
    public Guid CandidateId { get; set; }

    public Guid SkillId { get; set; }

    public string ProficiencyLevel { get; set; } = string.Empty;

    public Candidate Candidate { get; set; } = null!;

    public Skill Skill { get; set; } = null!;
}