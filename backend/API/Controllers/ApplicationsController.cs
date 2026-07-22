using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public ApplicationsController(RecruitmentDbContext context)
    {
        _context = context;
    }

    // POST api/applications - Submit a job application
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] ApplyRequest req)
    {
        // Check if already applied
        var exists = await _context.JobApplications
            .AnyAsync(a => a.CandidateId == req.CandidateId && a.JobId == req.JobId);
        if (exists)
            return Conflict(new { message = "You have already applied to this job." });

        var candidate = await _context.Candidates.FindAsync(req.CandidateId);
        if (candidate == null) return NotFound(new { message = "Candidate not found." });

        var job = await _context.Jobs.FindAsync(req.JobId);
        if (job == null) return NotFound(new { message = "Job not found." });

        var application = new JobApplication
        {
            CandidateId = req.CandidateId,
            JobId = req.JobId,
            ResumeId = req.ResumeId,  // null if no specific resume selected
            AppliedDate = DateTime.UtcNow,
            AIMatchScore = req.AIMatchScore ?? new Random().Next(65, 98),
            Status = "Applied"
        };

        _context.JobApplications.Add(application);

        // Notify Recruiter
        if (job.RecruiterId.HasValue)
        {
            var recruiter = await _context.Recruiters.FindAsync(job.RecruiterId.Value);
            if (recruiter != null)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = recruiter.UserId,
                    Title = "New Application Received",
                    MessageText = $"A candidate has applied for the {job.Title} position.",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Application submitted successfully.", id = application.Id });
    }

    // GET api/applications/candidate/{candidateId} - Get all applications for a candidate
    [HttpGet("candidate/{candidateId}")]
    public async Task<IActionResult> GetByCandidateId(Guid candidateId)
    {
        var applications = await _context.JobApplications
            .Where(a => a.CandidateId == candidateId)
            .Include(a => a.Job)
                .ThenInclude(j => j.Organization)
            .OrderByDescending(a => a.AppliedDate)
            .Select(a => new
            {
                a.Id,
                a.AppliedDate,
                a.AIMatchScore,
                a.Status,
                a.RecruiterNotes,
                Job = new
                {
                    a.Job.Id,
                    a.Job.Title,
                    a.Job.Location,
                    a.Job.EmploymentType,
                    a.Job.MinimumSalary,
                    a.Job.MaximumSalary,
                    a.Job.Description,
                    a.Job.Status,
                    a.Job.ExpiryDate,
                    a.Job.CreatedAt,
                    Organization = a.Job.Organization == null ? null : new
                    {
                        a.Job.Organization.Id,
                        a.Job.Organization.Name
                    }
                }
            })
            .ToListAsync();

        return Ok(applications);
    }

    // GET api/applications/check?candidateId=...&jobId=... - Check if already applied
    [HttpGet("check")]
    public async Task<IActionResult> Check([FromQuery] Guid candidateId, [FromQuery] Guid jobId)
    {
        var exists = await _context.JobApplications
            .AnyAsync(a => a.CandidateId == candidateId && a.JobId == jobId);
        return Ok(new { applied = exists });
    }

    // DELETE api/applications/{id} - Withdraw application
    [HttpDelete("{id}")]
    public async Task<IActionResult> Withdraw(Guid id)
    {
        var application = await _context.JobApplications.FindAsync(id);
        if (application == null) return NotFound();

        _context.JobApplications.Remove(application);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT api/applications/{id}/status - Update application status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateApplicationStatusRequest req)
    {
        var application = await _context.JobApplications.FindAsync(id);
        if (application == null) return NotFound(new { message = "Application not found" });

        application.Status = req.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated successfully", status = req.Status });
    }

    // GET api/applications/recruiter/{userId} - Get all applications for jobs posted by a recruiter
    [HttpGet("recruiter/{userId}")]
    public async Task<IActionResult> GetByRecruiterId(Guid userId)
    {
        var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId || r.Id == userId);
        Guid? orgId = recruiter?.OrganizationId;
        Guid? recruiterId = recruiter?.Id;

        if (orgId == null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            orgId = user?.OrganizationId;
        }

        var applications = await _context.JobApplications
            .Include(a => a.Job)
            .Include(a => a.Candidate).ThenInclude(c => c.User)
            .Where(a => (orgId != null && a.Job.OrganizationId == orgId) || (recruiterId != null && a.Job.RecruiterId == recruiterId))
            .OrderByDescending(a => a.AppliedDate)
            .Select(a => new
            {
                a.Id,
                a.AppliedDate,
                a.AIMatchScore,
                a.Status,
                CandidateName = a.Candidate.User != null ? a.Candidate.User.FirstName + " " + a.Candidate.User.LastName : "Candidate",
                CandidateId = a.CandidateId,
                JobTitle = a.Job.Title,
                JobId = a.Job.Id,
                ResumeFileName = a.Candidate.ResumeFileName,
                ResumeUrl = a.Candidate.ResumeUrl
            })
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetApplicationById(Guid id)
    {
        var app = await _context.JobApplications
            .Include(a => a.Candidate).ThenInclude(c => c.User)
            .Include(a => a.Job).ThenInclude(j => j.Organization)
            .Include(a => a.Job).ThenInclude(j => j.Recruiter).ThenInclude(r => r.User)
            .Include(a => a.Resume)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (app == null) return NotFound(new { message = "Application not found." });

        return Ok(new
        {
            app.Id,
            CandidateName = app.Candidate?.User?.FirstName + " " + app.Candidate?.User?.LastName,
            CandidateEmail = app.Candidate?.User?.Email,
            CandidatePhone = app.Candidate?.PhoneNumber,
            JobTitle = app.Job?.Title,
            OrganizationName = app.Job?.Organization?.Name,
            RecruiterName = app.Job?.Recruiter?.User?.FirstName + " " + app.Job?.Recruiter?.User?.LastName,
            app.Status,
            app.AppliedDate,
            app.AIMatchScore,
            ResumeUrl = app.Resume?.FileUrl
        });
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllApplications()
    {
        var apps = await _context.JobApplications
            .Include(a => a.Candidate)
                .ThenInclude(c => c.User)
            .Include(a => a.Job)
                .ThenInclude(j => j.Organization)
            .OrderByDescending(a => a.AppliedDate)
            .Select(a => new
            {
                a.Id,
                CandidateName = a.Candidate != null && a.Candidate.User != null 
                    ? a.Candidate.User.FirstName + " " + a.Candidate.User.LastName 
                    : "Unknown",
                JobTitle = a.Job != null ? a.Job.Title : "Unknown",
                OrganizationName = a.Job != null && a.Job.Organization != null 
                    ? a.Job.Organization.Name 
                    : "Unknown",
                a.Status,
                a.AppliedDate
            })
            .ToListAsync();

        return Ok(apps);
    }
}

public class ApplyRequest
{
    public Guid CandidateId { get; set; }
    public Guid JobId { get; set; }
    public Guid? ResumeId { get; set; }
    public int? AIMatchScore { get; set; }
}

public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
