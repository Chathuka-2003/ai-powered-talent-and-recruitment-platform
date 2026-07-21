using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IApplicationRepository : IGenericRepository<JobApplication>
{
    Task<IEnumerable<JobApplication>> GetByJobIdAsync(Guid jobId);

    Task<IEnumerable<JobApplication>> GetByCandidateIdAsync(Guid candidateId);

    Task<IEnumerable<JobApplication>> GetByStatusAsync(ApplicationStatus status);

    Task<JobApplication?> GetWithCandidateDetailsAsync(Guid applicationId);

    Task<bool> IsAlreadyAppliedAsync(Guid candidateId, Guid jobId);
}
