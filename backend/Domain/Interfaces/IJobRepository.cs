using Domain.Entities;

namespace Domain.Interfaces;

public interface IJobRepository : IGenericRepository<Job>
{
    Task<IEnumerable<Job>> GetByRecruiterIdAsync(Guid recruiterId);

    Task<IEnumerable<Job>> GetByOrganizationIdAsync(Guid orgId);

    Task<IEnumerable<Job>> GetActiveJobsAsync();

    Task<IEnumerable<Job>> SearchJobsAsync(
        string keyword,
        string location,
        string type);

    Task<Job?> GetJobWithApplicationsAsync(Guid jobId);
}
