using Domain.Entities;

namespace Domain.Interfaces;

public interface IOrganizationRepository : IGenericRepository<Organization>
{
    Task<Organization?> GetByNameAsync(string name);

    Task<Organization?> GetWithUsersAsync(Guid orgId);

    Task<IEnumerable<Organization>> GetAllOrganizationsAsync();
}
