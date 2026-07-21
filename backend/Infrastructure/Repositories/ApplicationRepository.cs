using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ApplicationRepository
    : GenericRepository<JobApplication>, IApplicationRepository
{
    public ApplicationRepository(RecruitmentDbContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<JobApplication>> GetByJobIdAsync(Guid jobId)
    {
        return await _context.JobApplications
            .Where(x => x.JobId == jobId)
            .ToListAsync();
    }

    public async Task<IEnumerable<JobApplication>> GetByCandidateIdAsync(Guid candidateId)
    {
        return await _context.JobApplications
            .Where(x => x.CandidateId == candidateId)
            .ToListAsync();
    }

    public async Task<IEnumerable<JobApplication>> GetByStatusAsync(ApplicationStatus status)
    {
       

        return await Task.FromResult(new List<JobApplication>());
    }

    public async Task<JobApplication?> GetWithCandidateDetailsAsync(Guid applicationId)
    {
        return await _context.JobApplications
            .Include(x => x.Candidate)
            .Include(x => x.Job)
            .Include(x => x.Resume)
            .FirstOrDefaultAsync(x => x.Id == applicationId);
    }

    public async Task<bool> IsAlreadyAppliedAsync(Guid candidateId, Guid jobId)
    {
        return await _context.JobApplications.AnyAsync(x =>
            x.CandidateId == candidateId &&
            x.JobId == jobId);
    }
}
