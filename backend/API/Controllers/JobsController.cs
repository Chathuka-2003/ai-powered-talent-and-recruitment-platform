using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Enums;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly RecruitmentDbContext _context;

    public JobsController(IUnitOfWork unitOfWork, RecruitmentDbContext context)
    {
        _unitOfWork = unitOfWork;
        _context = context;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? title,
        [FromQuery] string? location,
        [FromQuery] string? employmentType,
        [FromQuery] decimal? minSalary,
        [FromQuery] decimal? maxSalary,
        [FromQuery] Guid? recruiterId,
        [FromQuery] Guid? organizationId)
    {
        var query = _context.Jobs
            .Include(j => j.Organization)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(title))
            query = query.Where(j => j.Title.Contains(title));

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Location.Contains(location));

        if (!string.IsNullOrWhiteSpace(employmentType))
            query = query.Where(j => j.EmploymentType.Contains(employmentType));

        if (minSalary.HasValue)
            query = query.Where(j => j.MaximumSalary >= minSalary.Value);

        if (maxSalary.HasValue)
            query = query.Where(j => j.MinimumSalary <= maxSalary.Value);

        if (recruiterId.HasValue && recruiterId.Value != Guid.Empty)
        {
            var actualRecruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == recruiterId.Value);
            if (actualRecruiter != null)
            {
                query = query.Where(j => j.RecruiterId == actualRecruiter.Id);
            }
            else
            {
                query = query.Where(j => j.RecruiterId == recruiterId.Value);
            }
        }

        if (organizationId.HasValue && organizationId.Value != Guid.Empty)
        {
            query = query.Where(j => j.OrganizationId == organizationId.Value);
        }

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.Description,
                j.Location,
                j.EmploymentType,
                j.MinimumSalary,
                j.MaximumSalary,
                j.ExpiryDate,
                j.Status,
                j.CreatedAt,
                Organization = j.Organization == null ? null : new
                {
                    j.Organization.Id,
                    j.Organization.Name
                },
                j.RecruiterId
            })
            .ToListAsync();

        return Ok(jobs);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var job = await _context.Jobs
            .Include(j => j.Organization)
            .Where(j => j.Id == id)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.Description,
                j.Location,
                j.EmploymentType,
                j.MinimumSalary,
                j.MaximumSalary,
                j.ExpiryDate,
                j.Status,
                j.CreatedAt,
                Organization = j.Organization == null ? null : new
                {
                    j.Organization.Id,
                    j.Organization.Name
                },
                ApplicationCount = j.JobApplications.Count
            })
            .FirstOrDefaultAsync();

        if (job == null) return NotFound();
        return Ok(job);
    }

    public class JobDto
    {
        public Guid? Id { get; set; }
        public Guid? RecruiterId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public decimal MinimumSalary { get; set; }
        public decimal MaximumSalary { get; set; }
        public DateTime ExpiryDate { get; set; }
        public JobStatus Status { get; set; }
        public string CompanyName { get; set; } = string.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] JobDto dto)
    {
        var job = new Job
        {
            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            EmploymentType = dto.EmploymentType,
            MinimumSalary = dto.MinimumSalary,
            MaximumSalary = dto.MaximumSalary,
            ExpiryDate = dto.ExpiryDate,
            Status = dto.Status
        };

        // Handle RecruiterId from frontend (which is actually UserId)
        if (dto.RecruiterId.HasValue && dto.RecruiterId != Guid.Empty)
        {
            var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == dto.RecruiterId.Value);
            if (recruiter != null)
            {
                job.RecruiterId = recruiter.Id;
                job.OrganizationId = recruiter.OrganizationId;
            }
        }
        else
        {
            var recruiter = _context.Recruiters.FirstOrDefault();
            if (recruiter != null)
            {
                job.RecruiterId = recruiter.Id;
                job.OrganizationId = recruiter.OrganizationId;
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.CompanyName) && job.OrganizationId == Guid.Empty)
        {
            var org = await _context.Organizations.FirstOrDefaultAsync(o => o.Name == dto.CompanyName);
            if (org == null)
            {
                org = new Organization { Name = dto.CompanyName };
                _context.Organizations.Add(org);
                await _context.SaveChangesAsync();
            }
            job.OrganizationId = org.Id;
        }

        await _unitOfWork.Jobs.AddAsync(job);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] JobDto dto)
    {
        if (id != dto.Id) return BadRequest();
        
        var job = await _unitOfWork.Jobs.GetByIdAsync(id);
        if (job == null) return NotFound();

        job.Title = dto.Title;
        job.Description = dto.Description;
        job.Location = dto.Location;
        job.EmploymentType = dto.EmploymentType;
        job.MinimumSalary = dto.MinimumSalary;
        job.MaximumSalary = dto.MaximumSalary;
        job.ExpiryDate = dto.ExpiryDate;
        job.Status = dto.Status;

        if (!string.IsNullOrWhiteSpace(dto.CompanyName) && job.OrganizationId == Guid.Empty)
        {
            var org = await _context.Organizations.FirstOrDefaultAsync(o => o.Name == dto.CompanyName);
            if (org == null)
            {
                org = new Organization { Name = dto.CompanyName };
                _context.Organizations.Add(org);
                await _context.SaveChangesAsync();
            }
            job.OrganizationId = org.Id;
        }

        _unitOfWork.Jobs.Update(job);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { message = "Updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var job = await _unitOfWork.Jobs.GetByIdAsync(id);
        if (job == null) return NotFound();
        _unitOfWork.Jobs.Delete(job);
        await _unitOfWork.SaveChangesAsync();
        return Ok(new { message = "Deleted successfully" });
    }

    [HttpGet("debug")]
    public async Task<IActionResult> Debug()
    {
        var users = await _context.Users.Select(u => new { u.Id, u.Role, u.Email }).ToListAsync();
        var recruiters = await _context.Recruiters.Select(r => new { r.Id, r.UserId, r.OrganizationId }).ToListAsync();
        var jobs = await _context.Jobs.Select(j => new { j.Id, j.Title, j.OrganizationId }).ToListAsync();
        return Ok(new { users, recruiters, jobs });
    }
}
