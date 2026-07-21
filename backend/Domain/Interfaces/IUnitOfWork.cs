namespace Domain.Interfaces;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    ICandidateRepository Candidates { get; }
    IJobRepository Jobs { get; }
    IApplicationRepository Applications { get; }
    IInterviewRepository Interviews { get; }
    IMessageRepository Messages { get; }
    INotificationRepository Notifications { get; }
    IOrganizationRepository Organizations { get; }
    IAuditLogRepository AuditLogs { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
