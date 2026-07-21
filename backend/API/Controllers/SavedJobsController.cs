using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SavedJobsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public SavedJobsController(RecruitmentDbContext context)
    {
        _context = context;
    }

    // GET api/savedjobs/candidate/{candidateId}
    [HttpGet("candidate/{candidateId}")]
    public async Task<IActionResult> GetByCandidate(Guid candidateId)
    {
        var saved = await _context.SavedJobs
            .Where(s => s.CandidateId == candidateId)
            .Include(s => s.Job)
                .ThenInclude(j => j.Organization)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new
            {
                savedJobId = s.Id,
                savedAt = s.CreatedAt,
                job = new
                {
                    s.Job.Id,
                    s.Job.Title,
                    s.Job.Description,
                    s.Job.Location,
                    s.Job.EmploymentType,
                    s.Job.MinimumSalary,
                    s.Job.MaximumSalary,
                    s.Job.ExpiryDate,
                    s.Job.Status,
                    s.Job.CreatedAt,
                    Organization = s.Job.Organization == null ? null : new
                    {
                        s.Job.Organization.Id,
                        s.Job.Organization.Name
                    }
                }
            })
            .ToListAsync();

        return Ok(saved);
    }

    // POST api/savedjobs — Save a job
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] SaveJobRequest req)
    {
        var exists = await _context.SavedJobs
            .AnyAsync(s => s.CandidateId == req.CandidateId && s.JobId == req.JobId);

        if (exists)
            return Conflict(new { message = "Job already saved." });

        var saved = new SavedJob
        {
            CandidateId = req.CandidateId,
            JobId = req.JobId
        };

        _context.SavedJobs.Add(saved);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Job saved.", id = saved.Id });
    }

    // DELETE api/savedjobs/{candidateId}/{jobId} — Unsave a job
    [HttpDelete("{candidateId}/{jobId}")]
    public async Task<IActionResult> Unsave(Guid candidateId, Guid jobId)
    {
        var saved = await _context.SavedJobs
            .FirstOrDefaultAsync(s => s.CandidateId == candidateId && s.JobId == jobId);

        if (saved == null) return NotFound();

        _context.SavedJobs.Remove(saved);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Job removed from saved list." });
    }

    // GET api/savedjobs/check?candidateId=&jobId= — Check if saved
    [HttpGet("check")]
    public async Task<IActionResult> Check([FromQuery] Guid candidateId, [FromQuery] Guid jobId)
    {
        var exists = await _context.SavedJobs
            .AnyAsync(s => s.CandidateId == candidateId && s.JobId == jobId);
        return Ok(new { saved = exists });
    }
}

public class SaveJobRequest
{
    public Guid CandidateId { get; set; }
    public Guid JobId { get; set; }
}
