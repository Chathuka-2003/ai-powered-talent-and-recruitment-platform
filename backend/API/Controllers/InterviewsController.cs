using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using API.Services;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InterviewsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;
    private readonly CalendarSyncService _syncService;

    public InterviewsController(RecruitmentDbContext context, CalendarSyncService syncService)
    {
        _context = context;
        _syncService = syncService;
    }

    [HttpGet("candidate/{candidateId}")]
    public async Task<IActionResult> GetByCandidateId(Guid candidateId)
    {
        var interviews = await _context.Interviews
            .Where(i => i.CandidateId == candidateId)
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
                .ThenInclude(j => j.Organization)
            .Include(i => i.Recruiter)
                .ThenInclude(r => r.User)
            .OrderBy(i => i.InterviewDate)
            .Select(i => new
            {
                i.Id,
                Position = i.Application.Job.Title,
                Company = i.Application.Job.Organization != null ? i.Application.Job.Organization.Name : "Company",
                Type = i.Type,
                Date = i.InterviewDate.ToString("MMMM dd, yyyy"),
                Time = i.InterviewTime.ToString(@"hh\:mm") + " - " + i.InterviewTime.Add(TimeSpan.FromHours(1)).ToString(@"hh\:mm"), // Defaulting to 1 hour duration
                Location = i.Location ?? "Virtual",
                Interviewer = i.Recruiter.User.FirstName + " " + i.Recruiter.User.LastName + " - Recruiter",
                MeetingLink = i.MeetingLink,
                Status = i.Status
            })
            .ToListAsync();

        return Ok(interviews);
    }

    [HttpGet("recruiter/{userId}")]
    public async Task<IActionResult> GetByRecruiterId(Guid userId)
    {
        // Resolve the Recruiter entity from the UserId in the JWT token
        var recruiter = await _context.Recruiters
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null)
            return Ok(new List<object>()); // Return empty rather than 404 for UX

        var interviews = await _context.Interviews
            .Where(i => i.RecruiterId == recruiter.Id)
            .Include(i => i.Candidate)
                .ThenInclude(c => c.User)
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .OrderBy(i => i.InterviewDate)
            .Select(i => new
            {
                i.Id,
                CandidateName = i.Candidate.User.FirstName + " " + i.Candidate.User.LastName,
                CandidateTitle = i.Candidate.ProfessionalHeadline ?? "Candidate",
                Position = i.Application.Job.Title,
                Date = i.InterviewDate.ToString("MMMM dd, yyyy"),
                Time = i.InterviewTime.ToString(@"hh\:mm"),
                Type = i.Type,
                Status = i.Status,
                VideoLink = !string.IsNullOrEmpty(i.MeetingLink),
                MeetingLink = i.MeetingLink
            })
            .ToListAsync();

        return Ok(interviews);
    }


    [HttpGet("hiringmanager/{userId}")]
    public async Task<IActionResult> GetByHiringManagerId(Guid userId)
    {
        // Resolve the HiringManager entity from the UserId in the JWT token
        var hiringManager = await _context.HiringManagers
            .FirstOrDefaultAsync(h => h.UserId == userId);

        if (hiringManager == null)
            return Ok(new List<object>()); // Return empty rather than 404 for UX
