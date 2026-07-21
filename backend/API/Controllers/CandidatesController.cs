using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CandidatesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly RecruitmentDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly Infrastructure.Services.ResumeAnalyzerService _analyzer;

    public CandidatesController(IUnitOfWork unitOfWork, RecruitmentDbContext context, IWebHostEnvironment env, Infrastructure.Services.ResumeAnalyzerService analyzer)
    {
        _unitOfWork = unitOfWork;
        _context = context;
        _env = env;
        _analyzer = analyzer;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var candidates = await _unitOfWork.Candidates.GetAllAsync();
        return Ok(candidates);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound();
        return Ok(candidate);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var candidate = await _unitOfWork.Candidates.GetByUserIdAsync(userId);
        if (candidate == null) return NotFound();
        return Ok(candidate);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Candidate candidate)
    {
        if (id != candidate.Id) return BadRequest();
        Console.WriteLine($"[DEBUG] CandidatesController.Update - Id: {candidate.Id}, IsOpenToWork: {candidate.IsOpenToWork}, ProfessionalHeadline: {candidate.ProfessionalHeadline}, Location: {candidate.Location}");
        candidate.User = null;
        _unitOfWork.Candidates.Update(candidate);
        await _unitOfWork.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(candidate.Id);
        return Ok(new { message = "Updated successfully" });
    }

    // Ensures a candidate profile exists for the given userId - finds or creates one
    [HttpPost("ensure/{userId}")]
    public async Task<IActionResult> EnsureCandidate(Guid userId)
    {
        // Check if candidate already exists
        var existing = await _unitOfWork.Candidates.GetByUserIdAsync(userId);
        if (existing != null) return Ok(existing);

        // Verify the user exists in Users table
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return NotFound(new { message = "User not found. Please log in again." });

        // Create a blank candidate profile for this user
        var candidate = new Candidate
        {
            UserId = userId,
            ProfessionalHeadline = string.Empty,
            Summary = string.Empty,
            IsOpenToWork = false,
            ProfileCompleteness = 0
        };
        await _unitOfWork.Candidates.AddAsync(candidate);
        await _unitOfWork.SaveChangesAsync();

        // Reload with user navigation property
        var created = await _unitOfWork.Candidates.GetByUserIdAsync(userId);
        return Ok(created);
    }

    [HttpPost("{id}/view")]
    public async Task<IActionResult> RecordView(Guid id)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound(new { message = "Candidate not found." });

        candidate.ProfileViews++;
        _unitOfWork.Candidates.Update(candidate);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { views = candidate.ProfileViews });
    }

    [HttpPost("{id}/resume")]
    public async Task<IActionResult> UploadResume(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest(new { message = "No file uploaded." });

        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound(new { message = "Candidate not found." });

        // Validate extension
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".pdf" && ext != ".docx") return BadRequest(new { message = "Invalid file type. Only PDF and DOCX are allowed." });

        // Validate size (5MB limit)
        if (file.Length > 5 * 1024 * 1024) return BadRequest(new { message = "File exceeds 5MB size limit." });

        var uploadsPath = Path.Combine(_env.WebRootPath, "uploads", "resumes");
        if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

        // Delete existing resume file if exists
        if (!string.IsNullOrEmpty(candidate.ResumeUrl))
        {
            var oldFileName = Path.GetFileName(candidate.ResumeUrl);
            var oldFilePath = Path.Combine(uploadsPath, oldFileName);
            if (System.IO.File.Exists(oldFilePath)) System.IO.File.Delete(oldFilePath);
        }

        var uniqueFileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsPath, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        candidate.ResumeFileName = file.FileName;
        candidate.ResumeUrl = $"/uploads/resumes/{uniqueFileName}";
        candidate.ResumeUploadedAt = DateTime.UtcNow;

        _unitOfWork.Candidates.Update(candidate);
        await _unitOfWork.SaveChangesAsync();

        // Run AI Analysis
        var analysis = await _analyzer.AnalyzeResumeAsync(filePath);
        if (analysis.Score > 0)
        {
            candidate.ResumeScore = analysis.Score;
            candidate.SuggestedSkills = System.Text.Json.JsonSerializer.Serialize(analysis.Skills);
            candidate.ImprovementSuggestions = System.Text.Json.JsonSerializer.Serialize(analysis.Suggestions);
            
            _unitOfWork.Candidates.Update(candidate);
            await _unitOfWork.SaveChangesAsync();
        }

        // Recalculate profile completeness
        await RecalculateProfileCompletenessAsync(id);

        return Ok(new { 
            resumeFileName = candidate.ResumeFileName, 
            resumeUrl = candidate.ResumeUrl, 
            resumeUploadedAt = candidate.ResumeUploadedAt,
            resumeScore = candidate.ResumeScore,
            suggestedSkills = candidate.SuggestedSkills,
            improvementSuggestions = candidate.ImprovementSuggestions
        });
    }

    [HttpDelete("{id}/resume")]
    public async Task<IActionResult> DeleteResume(Guid id)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound(new { message = "Candidate not found." });

        if (!string.IsNullOrEmpty(candidate.ResumeUrl))
        {
            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads", "resumes");
            var fileName = Path.GetFileName(candidate.ResumeUrl);
            var filePath = Path.Combine(uploadsPath, fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        candidate.ResumeFileName = null;
        candidate.ResumeUrl = null;
        candidate.ResumeUploadedAt = null;

        _unitOfWork.Candidates.Update(candidate);
        await _unitOfWork.SaveChangesAsync();

        // Recalculate profile completeness
        await RecalculateProfileCompletenessAsync(id);

        return NoContent();
    }

    // --- Education Endpoints ---

    public class EducationRequest
    {
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class EducationDto
    {
        public Guid Id { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    [HttpGet("{id}/education")]
    public async Task<IActionResult> GetEducation(Guid id)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound();
        var education = await _context.Educations
            .Where(e => e.UserId == candidate.UserId)
            .OrderByDescending(e => e.StartDate)
            .Select(e => new EducationDto
            {
                Id = e.Id,
                Institution = e.Institution,
                Degree = e.Degree,
                StartDate = e.StartDate,
                EndDate = e.EndDate
            })
            .ToListAsync();
        return Ok(education);
    }

    [HttpPost("{id}/education")]
    public async Task<IActionResult> AddEducation(Guid id, [FromBody] EducationRequest dto)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound();
        var education = new Education
        {
            UserId = candidate.UserId,
            Institution = dto.Institution,
            Degree = dto.Degree,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };
        _context.Educations.Add(education);
        await _context.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(id);
        return Ok(new EducationDto
        {
            Id = education.Id,
            Institution = education.Institution,
            Degree = education.Degree,
            StartDate = education.StartDate,
            EndDate = education.EndDate
        });
    }

    [HttpDelete("{id}/education/{eduId}")]
    public async Task<IActionResult> DeleteEducation(Guid id, Guid eduId)
    {
        var education = await _context.Educations.FindAsync(eduId);
        if (education == null) return NotFound();
        _context.Educations.Remove(education);
        await _context.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(id);
        return Ok(new { message = "Deleted successfully" });
    }

    // --- Experience Endpoints ---

    public class ExperienceDto
    {
        public Guid Id { get; set; }
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class ExperienceRequest
    {
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    [HttpGet("{id}/experience")]
    public async Task<IActionResult> GetExperience(Guid id)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound();
        var experience = await _context.Experiences
            .Where(e => e.UserId == candidate.UserId)
            .OrderByDescending(e => e.StartDate)
            .Select(e => new ExperienceDto
            {
                Id = e.Id,
                Company = e.Company,
                Position = e.Position,
                StartDate = e.StartDate,
                EndDate = e.EndDate
            })
            .ToListAsync();
        return Ok(experience);
    }

    [HttpPost("{id}/experience")]
    public async Task<IActionResult> AddExperience(Guid id, [FromBody] ExperienceRequest dto)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound();
        var experience = new Experience
        {
            UserId = candidate.UserId,
            Company = dto.Company,
            Position = dto.Position,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };
        _context.Experiences.Add(experience);
        await _context.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(id);
        return Ok(new ExperienceDto
        {
            Id = experience.Id,
            Company = experience.Company,
            Position = experience.Position,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate
        });
    }

    [HttpDelete("{id}/experience/{expId}")]
    public async Task<IActionResult> DeleteExperience(Guid id, Guid expId)
    {
        var experience = await _context.Experiences.FindAsync(expId);
        if (experience == null) return NotFound();
        _context.Experiences.Remove(experience);
        await _context.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(id);
        return Ok(new { message = "Deleted successfully" });
    }

    // --- Skills Endpoints ---

    public class CandidateSkillDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
    }

    [HttpGet("{id}/skills")]
    public async Task<IActionResult> GetSkills(Guid id)
    {
        var skills = await _context.CandidateSkills
            .Include(cs => cs.Skill)
            .Where(cs => cs.CandidateId == id)
            .Select(cs => new CandidateSkillDto
            {
                Id = cs.Id,
                Name = cs.Skill.Name,
                Level = cs.ProficiencyLevel
            })
            .ToListAsync();
        return Ok(skills);
    }

    [HttpPost("{id}/skills")]
    public async Task<IActionResult> AddSkill(Guid id, [FromBody] CandidateSkillDto skillDto)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(id);
        if (candidate == null) return NotFound();
        
        var skill = await _context.Skills.FirstOrDefaultAsync(s => s.Name.ToLower() == skillDto.Name.ToLower());
        if (skill == null)
        {
            skill = new Skill { Name = skillDto.Name };
            _context.Skills.Add(skill);
            await _unitOfWork.SaveChangesAsync();
        }

        var candidateSkill = new CandidateSkill
        {
            CandidateId = id,
            SkillId = skill.Id,
            ProficiencyLevel = skillDto.Level
        };

        _context.CandidateSkills.Add(candidateSkill);
        await _unitOfWork.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(id);

        return Ok(new CandidateSkillDto
        {
            Id = candidateSkill.Id,
            Name = skill.Name,
            Level = candidateSkill.ProficiencyLevel
        });
    }

    [HttpDelete("{id}/skills/{csId}")]
    public async Task<IActionResult> DeleteSkill(Guid id, Guid csId)
    {
        var candidateSkill = await _context.CandidateSkills.FindAsync(csId);
        if (candidateSkill == null) return NotFound();
        _context.CandidateSkills.Remove(candidateSkill);
        await _unitOfWork.SaveChangesAsync();
        await RecalculateProfileCompletenessAsync(id);
        return Ok(new { message = "Deleted successfully" });
    }
    private async Task RecalculateProfileCompletenessAsync(Guid candidateId)
    {
        var candidate = await _unitOfWork.Candidates.GetByIdAsync(candidateId);
        if (candidate == null) return;

        int score = 0;

        if (!string.IsNullOrWhiteSpace(candidate.ProfessionalHeadline)) score += 10;
        if (!string.IsNullOrWhiteSpace(candidate.Summary)) score += 15;
        if (!string.IsNullOrWhiteSpace(candidate.Location)) score += 5;
        if (!string.IsNullOrWhiteSpace(candidate.PhoneNumber)) score += 5;
        if (!string.IsNullOrWhiteSpace(candidate.PreferredJobRole)) score += 10;
        if (!string.IsNullOrWhiteSpace(candidate.EmploymentType)) score += 5;
        if (!string.IsNullOrWhiteSpace(candidate.PreferredLocation)) score += 5;
        if (!string.IsNullOrWhiteSpace(candidate.WorkPreference)) score += 5;

        bool hasEducation = await _context.Educations.AnyAsync(e => e.UserId == candidate.UserId);
        if (hasEducation) score += 15;

        bool hasExperience = await _context.Experiences.AnyAsync(e => e.UserId == candidate.UserId);
        if (hasExperience) score += 15;

        bool hasSkills = await _context.CandidateSkills.AnyAsync(cs => cs.CandidateId == candidateId);
        if (hasSkills) score += 10;

        candidate.ProfileCompleteness = score;
        _unitOfWork.Candidates.Update(candidate);
        await _unitOfWork.SaveChangesAsync();
    }
}
