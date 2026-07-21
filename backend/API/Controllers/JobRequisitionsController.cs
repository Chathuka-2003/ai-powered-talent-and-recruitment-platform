using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobRequisitionsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public JobRequisitionsController(RecruitmentDbContext context)
    {
        _context = context;
    }

    [HttpGet("hiringManager/{hmId}")]
    public async Task<IActionResult> GetByHiringManager(Guid hmId)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == hmId || h.Id == hmId);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var requisitions = await _context.JobRequisitions
            .Where(r => r.HiringManagerId == hm.Id)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(requisitions);
    }

    [HttpGet("organization/{orgId}")]
    public async Task<IActionResult> GetByOrganization(Guid orgId)
    {
        var requisitions = await _context.JobRequisitions
            .Include(r => r.HiringManager)
                .ThenInclude(hm => hm.User)
            .Where(r => r.OrganizationId == orgId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(requisitions);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobRequisitionDto dto)
    {
        var hm = await _context.HiringManagers.FirstOrDefaultAsync(h => h.UserId == dto.HiringManagerId || h.Id == dto.HiringManagerId);
        if (hm == null) return NotFound(new { message = "Hiring Manager not found." });

        var requisition = new JobRequisition
        {
            Id = Guid.NewGuid(),
            HiringManagerId = hm.Id,
            OrganizationId = hm.OrganizationId,
            JobTitle = dto.JobTitle,
            Department = dto.Department,
            Location = dto.Location ?? "Remote",
            SalaryRange = dto.SalaryRange,
            EmploymentType = dto.EmploymentType,
            NumberOfPositions = dto.NumberOfPositions,
            JobDescription = dto.JobDescription,
            ApprovalStatus = "Pending Approval",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.JobRequisitions.Add(requisition);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetByHiringManager), new { hmId = hm.UserId }, requisition);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateRequisitionStatusDto dto)
    {
        var requisition = await _context.JobRequisitions.FindAsync(id);
        if (requisition == null) return NotFound(new { message = "Job Requisition not found." });

        requisition.ApprovalStatus = dto.Status;
        requisition.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Status updated successfully." });
    }
}

public class UpdateRequisitionStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}

public class CreateJobRequisitionDto
{
    [Required]
    public Guid HiringManagerId { get; set; }
    [Required]
    public string JobTitle { get; set; } = string.Empty;
    [Required]
    public string Department { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    [Required]
    public string EmploymentType { get; set; } = string.Empty;
    public int NumberOfPositions { get; set; }
    public string? JobDescription { get; set; }
}

