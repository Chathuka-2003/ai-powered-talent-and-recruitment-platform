using Domain.Entities;

namespace Domain.Interfaces;

public interface IInterviewRepository : IGenericRepository<Interview>
{
    Task<IEnumerable<Interview>> GetByApplicationIdAsync(Guid applicationId);

    Task<IEnumerable<Interview>> GetByCandidateIdAsync(Guid candidateId);

    Task<IEnumerable<Interview>> GetByRecruiterIdAsync(Guid recruiterId);

    Task<IEnumerable<Interview>> GetByHiringManagerIdAsync(Guid managerId);

    Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync(Guid userId);
}