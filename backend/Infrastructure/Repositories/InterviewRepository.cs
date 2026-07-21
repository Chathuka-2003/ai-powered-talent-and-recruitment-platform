using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class InterviewRepository
    : GenericRepository<Interview>, IInterviewRepository
{
    public InterviewRepository(RecruitmentDbContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<Interview>> GetByApplicationIdAsync(Guid applicationId)
    {
        return await _context.Interviews
            .Where(x => x.ApplicationId == applicationId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetByCandidateIdAsync(Guid candidateId)
    {
        return await _context.Interviews
            .Where(x => x.CandidateId == candidateId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetByRecruiterIdAsync(Guid recruiterId)
    {
        return await _context.Interviews
            .Where(x => x.RecruiterId == recruiterId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetByHiringManagerIdAsync(Guid managerId)
    {
        
        return await Task.FromResult(new List<Interview>());
    }

    public async Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync(Guid userId)
    {
        return await _context.Interviews
            .Where(x => x.InterviewDate >= DateTime.UtcNow)
            .ToListAsync();
    }
}