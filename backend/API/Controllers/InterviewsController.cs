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

 // Get interviews linked via InterviewFeedback
        var interviews = await _context.InterviewFeedbacks
            .Where(f => f.HiringManagerId == hiringManager.Id)
            .Include(f => f.Interview)
                .ThenInclude(i => i.Candidate)
                .ThenInclude(c => c.User)
            .Include(f => f.Interview)
                .ThenInclude(i => i.Application)
                .ThenInclude(a => a.Job)
            .OrderBy(f => f.Interview.InterviewDate)
            .Select(f => new
            {
                f.Interview.Id,
                FeedbackId = f.Id,
                CandidateName = f.Interview.Candidate.User.FirstName + " " + f.Interview.Candidate.User.LastName,
                CandidateTitle = f.Interview.Candidate.ProfessionalHeadline ?? "Candidate",
                Position = f.Interview.Application.Job.Title,
                Date = f.Interview.InterviewDate.ToString("MMMM dd, yyyy"),
                Time = f.Interview.InterviewTime.ToString(@"hh\:mm"),
                Type = f.Interview.Type,
                Status = f.Interview.Status,
                VideoLink = !string.IsNullOrEmpty(f.Interview.MeetingLink),
                MeetingLink = f.Interview.MeetingLink,
                OverallScore = f.OverallScore,
                Recommendation = f.Recommendation
            })
            .ToListAsync();

        return Ok(interviews);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInterviewById(Guid id)
    {
        var interview = await _context.Interviews
            .Include(i => i.Candidate).ThenInclude(c => c.User)
            .Include(i => i.Application).ThenInclude(a => a.Job).ThenInclude(j => j.Organization)
            .Include(i => i.Recruiter).ThenInclude(r => r.User)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (interview == null) return NotFound(new { message = "Interview not found." });

        return Ok(new
        {
            interview.Id,
            CandidateName = interview.Candidate?.User?.FirstName + " " + interview.Candidate?.User?.LastName,
            CandidateEmail = interview.Candidate?.User?.Email,
            CandidatePhone = interview.Candidate?.PhoneNumber,
            Position = interview.Application?.Job?.Title,
            Company = interview.Application?.Job?.Organization?.Name,
            Type = interview.Type,
            Date = interview.InterviewDate.ToString("MMMM dd, yyyy"),
            Time = interview.InterviewTime.ToString(@"hh\:mm"),
            Location = interview.Location ?? "Virtual",
            RecruiterName = interview.Recruiter?.User?.FirstName + " " + interview.Recruiter?.User?.LastName,
            MeetingLink = interview.MeetingLink,
            Status = interview.Status
        });
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllInterviews()
    {
        var interviews = await _context.Interviews
            .Include(i => i.Candidate).ThenInclude(c => c.User)
            .Include(i => i.Application).ThenInclude(a => a.Job).ThenInclude(j => j.Organization)
            .OrderByDescending(i => i.InterviewDate)
            .Select(i => new
            {
                i.Id,
                CandidateName = i.Candidate.User.FirstName + " " + i.Candidate.User.LastName,
                Position = i.Application.Job.Title,
                Company = i.Application.Job.Organization != null ? i.Application.Job.Organization.Name : "Company",
                Date = i.InterviewDate.ToString("MMMM dd, yyyy"),
                Status = i.Status
            })
            .ToListAsync();

        return Ok(interviews);
    }

[HttpPost]
    public async Task<IActionResult> CreateInterview([FromBody] CreateInterviewRequest req)
    {
        var application = await _context.JobApplications
            .Include(a => a.Candidate)
            .FirstOrDefaultAsync(a => a.Id == req.ApplicationId);

        if (application == null) return NotFound(new { message = "Application not found." });

        var actualRecruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == req.RecruiterId);
        if (actualRecruiter == null) return BadRequest(new { message = "Recruiter profile not found for this user." });

        var interview = new Interview
        {
            ApplicationId = req.ApplicationId,
            CandidateId = application.CandidateId,
            RecruiterId = actualRecruiter.Id,
            InterviewDate = req.InterviewDate,
            InterviewTime = req.InterviewTime,
            Location = req.Location,
            MeetingLink = req.MeetingLink,
            Status = req.Status ?? "Upcoming",
            Type = req.Type ?? "Technical"
        };

        // Update application status to reflect that an interview is scheduled
        application.Status = "Interview Scheduled";

        _context.Interviews.Add(interview);

        // Notify Candidate
        if (application.Candidate != null)
        {
            var jobTitle = "a position";
            var jobApp = await _context.JobApplications.Include(a => a.Job).FirstOrDefaultAsync(a => a.Id == application.Id);
            if (jobApp != null && jobApp.Job != null) {
                jobTitle = jobApp.Job.Title;
            }

            _context.Notifications.Add(new Notification
            {
                UserId = application.Candidate.UserId,
                Title = "Interview Scheduled",
                MessageText = $"An interview for {jobTitle} has been scheduled for {interview.InterviewDate:MMM dd} at {interview.InterviewTime:hh\\:mm}.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

 // If a hiring manager is specified, create an InterviewFeedback stub
        if (req.HiringManagerId.HasValue)
        {
            var feedback = new InterviewFeedback
            {
                InterviewId = interview.Id,
                HiringManagerId = req.HiringManagerId.Value,
                OverallScore = 0,
                TechnicalScore = 0,
                CommunicationScore = 0
            };
            _context.InterviewFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }

        // Find recruiter user ID for calendar sync
        var recruiter = actualRecruiter;
        List<object>? syncResults = null;

        if (recruiter != null)
        {
            try
            {
                // Only auto-sync if they have tokens (CalendarSyncService handles it)
                // Only auto-sync if they have tokens and AutoSync is true
                syncResults = await _syncService.SyncInterviewAsync(interview.Id, recruiter.UserId, autoSyncOnly: true);
            }
            catch (Exception ex)
            {
                // Log but don't fail the interview creation
                Console.WriteLine($"Calendar sync error: {ex.Message}");
            }
        }

        return Ok(new { message = "Interview scheduled successfully.", id = interview.Id, syncResults });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest req)
    {
        var interview = await _context.Interviews.FindAsync(id);
        if (interview == null) return NotFound();

        interview.Status = req.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated." });
    }
}

public class CreateInterviewRequest
{
    public Guid ApplicationId { get; set; }
    public Guid RecruiterId { get; set; }
    public Guid? HiringManagerId { get; set; }
    public DateTime InterviewDate { get; set; }
    public TimeSpan InterviewTime { get; set; }
    public string? Location { get; set; }
    public string? MeetingLink { get; set; }
    public string? Status { get; set; }
    public string? Type { get; set; }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
