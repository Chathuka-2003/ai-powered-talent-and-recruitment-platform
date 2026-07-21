using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AuditLogRepository
    : GenericRepository<AuditLog>, IAuditLogRepository
{


    public AuditLogRepository(RecruitmentDbContext context)
     : base(context)
    {
    }

    public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId)
    {
        return await _context.AuditLogs
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByActionAsync(string action)
    {
        return await _context.AuditLogs
            .Where(x => x.Action == action)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetAllLogsAsync()
    {
        return await _context.AuditLogs
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetLogsByDateRangeAsync(
        DateTime from,
        DateTime to)
    {
        return await _context.AuditLogs
            .Where(x =>
                x.CreatedAt >= from &&
                x.CreatedAt <= to)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}