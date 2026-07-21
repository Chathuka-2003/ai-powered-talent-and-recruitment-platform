using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class OrganizationRepository : GenericRepository<Organization>, IOrganizationRepository
{
    public OrganizationRepository(RecruitmentDbContext context)
        : base(context)
    {
    }

    public async Task<Organization?> GetByNameAsync(string name)
    {
        return await _context.Organizations
            .FirstOrDefaultAsync(o => o.Name == name);
    }

    public async Task<Organization?> GetWithUsersAsync(Guid orgId)
    {
        return await _context.Organizations
            .Include(o => o.Users)
            .FirstOrDefaultAsync(o => o.Id == orgId);
    }

    public async Task<IEnumerable<Organization>> GetAllOrganizationsAsync()
    {
        return await _context.Organizations
            .OrderBy(o => o.Name)
            .ToListAsync();
    }
}
