using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize(Roles = "recruiter,hiring-manager,admin")]
[ApiController]
[Route("api/[controller]")]
public class RecruitersController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public RecruitersController(RecruitmentDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile/{userId}")]
    public async Task<IActionResult> GetProfile(Guid userId)
    {
        var recruiter = await _context.Recruiters
            .Include(r => r.Organization)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId || r.Id == userId);

        if (recruiter == null)
        {
            var user = await _context.Users
                .Include(u => u.Organization)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound(new { message = "Recruiter profile not found." });

            return Ok(new
            {
                Id = user.Id,
                UserId = user.Id,
                OrganizationId = user.OrganizationId,
                JobTitle = "Recruiter",
                Department = "Recruitment",
                PhoneNumber = user.PhoneNumber,
                Organization = user.Organization != null ? new
                {
                    Id = user.Organization.Id,
                    Name = user.Organization.Name,
                    Website = user.Organization.Website,
                    Address = user.Organization.Address,
                    Description = user.Organization.Description
                } : null,
                User = new
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email
                }
            });
        }

        return Ok(new
        {
            Id = recruiter.Id,
            UserId = recruiter.UserId,
            OrganizationId = recruiter.OrganizationId,
            JobTitle = recruiter.JobTitle,
            Department = recruiter.Department,
            PhoneNumber = recruiter.PhoneNumber,
            Organization = recruiter.Organization != null ? new
            {
                Id = recruiter.Organization.Id,
                Name = recruiter.Organization.Name,
                Website = recruiter.Organization.Website,
                Address = recruiter.Organization.Address,
                Description = recruiter.Organization.Description
            } : null,
            User = recruiter.User != null ? new 
            {
                FirstName = recruiter.User.FirstName,
                LastName = recruiter.User.LastName,
                Email = recruiter.User.Email
            } : null
        });
    }

    public class UpdateProfileDto
    {
        public string? JobTitle { get; set; }
        public string? Department { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? CompanyAddress { get; set; }
        public string? Industry { get; set; }
    }

    [HttpPut("profile/{userId}")]
    [Authorize(Roles = "recruiter,admin")]
    public async Task<IActionResult> UpdateProfile(Guid userId, [FromBody] UpdateProfileDto dto)
    {
        var recruiter = await _context.Recruiters
            .Include(r => r.Organization)
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null) return NotFound(new { message = "Recruiter profile not found." });

        recruiter.JobTitle = dto.JobTitle;
        recruiter.Department = dto.Department;
        recruiter.PhoneNumber = dto.PhoneNumber;

        if (recruiter.Organization != null)
        {
            recruiter.Organization.Name = dto.CompanyName ?? string.Empty;
            recruiter.Organization.Website = dto.CompanyWebsite;
            recruiter.Organization.Address = dto.CompanyAddress;
            recruiter.Organization.Description = dto.Industry;
        }

        _context.Recruiters.Update(recruiter);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully." });
    }
}
