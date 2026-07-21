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

    [HttpPost("{id}/feedback")]
    public async Task<IActionResult> SubmitFeedback(Guid id, [FromBody] SubmitFeedbackDto dto)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var interview = await _context.Interviews.FindAsync(dto.InterviewId);
        if (interview == null) return NotFound(new { message = "Interview not found." });

        var feedback = new InterviewFeedback
        {
            Id = Guid.NewGuid(),
            HiringManagerId = hm.Id,
            InterviewId = dto.InterviewId,
            TechnicalScore = dto.TechnicalScore,
            CommunicationScore = dto.CommunicationScore,
            OverallScore = dto.OverallScore,
            Notes = dto.Notes,
            Recommendation = dto.Recommendation,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InterviewFeedbacks.Add(feedback);

        // Optionally update interview status based on recommendation?
        // interview.Status = "Completed";

        await _context.SaveChangesAsync();
        return Ok(feedback);
    }

    [HttpGet("{id}/decisions")]
    public async Task<IActionResult> GetDecisions(Guid id)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var decisions = await _context.HiringDecisions
            .Include(d => d.Application)
            .ThenInclude(a => a.Candidate)
            .ThenInclude(c => c.User)
            .Include(d => d.Application.Job)
            .Where(d => d.HiringManagerId == hm.Id)
            .Select(d => new
            {
                d.Id,
                d.ApplicationId,
                CandidateName = d.Application.Candidate.User != null ? d.Application.Candidate.User.FirstName + " " + d.Application.Candidate.User.LastName : "Unknown",
                Position = d.Application.Job.Title,
                d.AIMatchScore,
                d.Notes,
                d.DecisionDate,
                d.CreatedAt
            })
            .ToListAsync();

        return Ok(decisions);
    }

     [HttpPost("{id}/decisions")]
    public async Task<IActionResult> SubmitDecision(Guid id, [FromBody] SubmitDecisionDto dto)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var app = await _context.JobApplications.FindAsync(dto.ApplicationId);
        if (app == null) return NotFound(new { message = "Application not found." });

        app.Status = dto.Notes == "Approve" ? "Hired" : (dto.Notes == "Reject" ? "Rejected" : "In Progress");

        var decision = new HiringDecision
        {
            Id = Guid.NewGuid(),
            HiringManagerId = hm.Id,
            ApplicationId = dto.ApplicationId,
            AIMatchScore = dto.AIMatchScore,
            Notes = dto.Notes,
            DecisionDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.HiringDecisions.Add(decision);
        

        await _context.SaveChangesAsync();
        return Ok(decision);
    }

 [HttpPut("{id}/decisions/{decisionId}")]
    public async Task<IActionResult> UpdateDecision(Guid id, Guid decisionId, [FromBody] UpdateDecisionDto dto)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var decision = await _context.HiringDecisions.Include(d => d.Application).FirstOrDefaultAsync(d => d.Id == decisionId && d.HiringManagerId == hm.Id);
        if (decision == null) return NotFound(new { message = "Decision not found." });

        decision.Notes = dto.Notes ?? decision.Notes;
        decision.UpdatedAt = DateTime.UtcNow;

        if (decision.Application != null)
        {
            decision.Application.Status = decision.Notes == "Approve" ? "Hired" : (decision.Notes == "Reject" ? "Rejected" : "In Progress");
        }

        await _context.SaveChangesAsync();
        return Ok(decision);
    }

[HttpDelete("{id}/decisions/{decisionId}")]
    public async Task<IActionResult> DeleteDecision(Guid id, Guid decisionId)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var decision = await _context.HiringDecisions.Include(d => d.Application).FirstOrDefaultAsync(d => d.Id == decisionId && d.HiringManagerId == hm.Id);
        if (decision == null) return NotFound(new { message = "Decision not found." });

        if (decision.Application != null)
        {
            // Revert application status
            decision.Application.Status = "Reviewed";
        }

        _context.HiringDecisions.Remove(decision);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Decision deleted successfully." });
    }

    [HttpGet("{id}/profile")]
    public async Task<IActionResult> GetProfile(Guid id)
    {
        var hm = await _context.HiringManagers
            .Include(h => h.User)
            .Include(h => h.Organization)
            .FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
            
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        return Ok(new
        {
            hm.Id,
            hm.UserId,
            FirstName = hm.User?.FirstName,
            LastName = hm.User?.LastName,
            Email = hm.User?.Email,
            Phone = hm.PhoneNumber,
            OrganizationName = hm.Organization?.Name,
            hm.Department,
            hm.Designation
        });
    }

[HttpPut("{id}/profile")]
    public async Task<IActionResult> UpdateProfile(Guid id, [FromBody] UpdateHmProfileDto dto)
    {
        var hm = await _context.HiringManagers
            .Include(h => h.User)
            .FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
            
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        if (hm.User != null)
        {
            hm.User.FirstName = dto.FirstName ?? hm.User.FirstName;
            hm.User.LastName = dto.LastName ?? hm.User.LastName;
            hm.User.Email = dto.Email ?? hm.User.Email;
        }

        hm.PhoneNumber = dto.Phone ?? hm.PhoneNumber;
        hm.Department = dto.Department ?? hm.Department;
        hm.Designation = dto.Designation ?? hm.Designation;
        hm.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(hm);
    }

    [HttpGet("{id}/assigned-jobs")]
    public async Task<IActionResult> GetAssignedJobs(Guid id)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == id || h.Id == id);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var jobs = await _context.Jobs
            .Include(j => j.JobApplications)
            .Where(j => j.OrganizationId == hm.OrganizationId)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.Location,
                j.Status,
                CandidatesApplied = j.JobApplications.Count,
                HiringProgress = j.JobApplications.Any(a => a.Status == "Hired") ? 100 : j.JobApplications.Any(a => a.Status == "Interview Scheduled") ? 75 : 50
            })
            .ToListAsync();

        return Ok(jobs);
    }


