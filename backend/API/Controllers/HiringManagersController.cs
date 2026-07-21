using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HiringManagersController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public HiringManagersController(RecruitmentDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}/shortlisted")]
    public async Task<IActionResult> GetShortlistedCandidates(Guid id)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

         // Get shortlisted applications for Jobs in this HM's organization
        var applications = await _context.JobApplications
            .Include(a => a.Candidate)
            .Include(a => a.Job)
            .Where(a => a.Job.OrganizationId == hm.OrganizationId && (a.Status == "Shortlisted" || a.Status == "Interview Scheduled" || a.Status == "Reviewed"))
            .Select(a => new
            {
                a.Id,
                a.CandidateId,
                a.JobId,
                CandidateName = a.Candidate.User != null ? a.Candidate.User.FirstName + " " + a.Candidate.User.LastName : "Unknown",
                Position = a.Job.Title,
                a.Status,
                a.AIMatchScore,
                a.RecruiterNotes
            })
            .ToListAsync();

        return Ok(applications);
    }

     [HttpGet("{id}/evaluations")]
    public async Task<IActionResult> GetEvaluations(Guid id)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var evaluations = await _context.Evaluations
            .Include(e => e.Candidate)
            .ThenInclude(c => c.User)
            .Where(e => e.HiringManagerId == hm.Id)
            .Select(e => new
            {
                e.Id,
                e.CandidateId,
                CandidateName = e.Candidate.User != null ? e.Candidate.User.FirstName + " " + e.Candidate.User.LastName : "Unknown",
                e.TechnicalRating,
                e.CommunicationRating,
                e.OverallRating,
                e.Summary,
                e.CreatedAt
            })
            .ToListAsync();

        return Ok(evaluations);
    }

      [HttpPost("{id}/evaluations")]
    public async Task<IActionResult> SubmitEvaluation(Guid id, [FromBody] SubmitEvaluationDto dto)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var candidate = await _context.Candidates.FindAsync(dto.CandidateId);
        if (candidate == null) return NotFound(new { message = "Candidate not found." });

        var evaluation = new Evaluation
        {
            Id = Guid.NewGuid(),
            HiringManagerId = hm.Id,
            CandidateId = dto.CandidateId,
            TechnicalRating = dto.TechnicalRating,
            CommunicationRating = dto.CommunicationRating,
            OverallRating = dto.OverallRating,
            Summary = dto.Summary,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Evaluations.Add(evaluation);
        await _context.SaveChangesAsync();

        return Ok(evaluation);
    }

     [HttpGet("{id}/feedback")]
    public async Task<IActionResult> GetFeedback(Guid id)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var feedback = await _context.InterviewFeedbacks
            .Include(f => f.Interview)
            .ThenInclude(i => i.Candidate)
            .ThenInclude(c => c.User)
            .Where(f => f.HiringManagerId == hm.Id)
            .Select(f => new
            {
                f.Id,
                f.InterviewId,
                CandidateName = f.Interview.Candidate.User != null ? f.Interview.Candidate.User.FirstName + " " + f.Interview.Candidate.User.LastName : "Unknown",
                f.TechnicalScore,
                f.CommunicationScore,
                f.OverallScore,
                f.Notes,
                f.Recommendation,
                f.CreatedAt
            })
            .ToListAsync();

        return Ok(feedback);
    }
