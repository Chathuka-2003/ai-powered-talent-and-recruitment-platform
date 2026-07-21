using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly RecruitmentDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(RecruitmentDbContext context)
    {
        _context = context;

        Users = new UserRepository(context);
        Candidates = new CandidateRepository(context);
        Jobs = new JobRepository(context);
        Organizations = new OrganizationRepository(context);

        // Remaining repositories
        Applications = new ApplicationRepository(context);
        Interviews = new InterviewRepository(context);
        Messages = new MessageRepository(context);
        Notifications = new NotificationRepository(context);
        AuditLogs = new AuditLogRepository(context);
    }

    public IUserRepository Users { get; }

    public ICandidateRepository Candidates { get; }

    public IJobRepository Jobs { get; }

    public IApplicationRepository Applications { get; }

    public IInterviewRepository Interviews { get; }

    public IMessageRepository Messages { get; }

    public INotificationRepository Notifications { get; }

    public IOrganizationRepository Organizations { get; }

    public IAuditLogRepository AuditLogs { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
        }
    }

    public async Task RollbackAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
        }
    }
}
