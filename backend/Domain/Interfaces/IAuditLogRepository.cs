using Domain.Entities;

namespace Domain.Interfaces;

public interface IAuditLogRepository : IGenericRepository<AuditLog>
{
    Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId);

    Task<IEnumerable<AuditLog>> GetByActionAsync(string action);

    Task<IEnumerable<AuditLog>> GetAllLogsAsync();

    Task<IEnumerable<AuditLog>> GetLogsByDateRangeAsync(
        DateTime from,
        DateTime to);
}
