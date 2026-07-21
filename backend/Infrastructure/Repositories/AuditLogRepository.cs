using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

/// <summary>
/// Repository responsible for managing audit log records
/// and providing query operations for audit-related data.
/// </summary>
public class AuditLogRepository
    : GenericRepository<AuditLog>, IAuditLogRepository
{

    /// <summary>
    /// Initializes the AuditLogRepository with the application's database context.
    /// </summary>
    /// <param name="context">Database context instance.</param>
    public AuditLogRepository(RecruitmentDbContext context)
     : base(context)
    {
    }

    /// <summary>
    /// Retrieves all audit logs created by a specific user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <returns>A collection of audit logs ordered by creation date.</returns>
    public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId)
    {
        // Filter audit logs by user ID and return the latest records first.
        return await _context.AuditLogs
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves audit logs that match a specific action.
    /// </summary>
    /// <param name="action">The action performed by the user.</param>
    /// <returns>A collection of matching audit log entries.</returns>
    public async Task<IEnumerable<AuditLog>> GetByActionAsync(string action)
    {
        // Retrieve audit logs based on the specified action.
        return await _context.AuditLogs
            .Where(x => x.Action == action)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves all audit log records from the database.
    /// </summary>
    /// <returns>A collection of audit logs sorted by creation date.</returns>
    public async Task<IEnumerable<AuditLog>> GetAllLogsAsync()
    {
        // Return all audit logs with the newest entries appearing first.
        return await _context.AuditLogs
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves audit logs created within a specified date range.
    /// </summary>
    /// <param name="from">Start date of the search range.</param>
    /// <param name="to">End date of the search range.</param>
    /// <returns>A collection of audit logs within the given period.</returns>
    public async Task<IEnumerable<AuditLog>> GetLogsByDateRangeAsync(
        DateTime from,
        DateTime to)
    {
        // Filter audit logs using the provided date range.
        return await _context.AuditLogs
            .Where(x =>
                x.CreatedAt >= from &&
                x.CreatedAt <= to)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}