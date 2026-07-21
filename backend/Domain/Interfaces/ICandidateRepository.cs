using Domain.Entities;

namespace Domain.Interfaces;

public interface ICandidateRepository : IGenericRepository<Candidate>
{
    Task<Candidate?> GetByUserIdAsync(Guid userId);

    Task<Candidate?> GetWithSkillsAsync(Guid candidateId);

    Task<Candidate?> GetWithEducationAsync(Guid candidateId);

    Task<Candidate?> GetWithExperienceAsync(Guid candidateId);

    Task<Candidate?> GetFullProfileAsync(Guid candidateId);

    Task<IEnumerable<Candidate>> SearchCandidatesAsync(string keyword);
}