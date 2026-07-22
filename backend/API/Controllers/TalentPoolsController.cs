using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize(Roles = "recruiter,hiring-manager,admin")]
[ApiController]
[Route("api/[controller]")]
public class TalentPoolsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public TalentPoolsController(RecruitmentDbContext context)
    {
        _context = context;
    }

    [HttpGet("recruiter/{userId}")]
    public async Task<IActionResult> GetByRecruiter(Guid userId)
    {
        var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == userId);
        if (recruiter == null) return Ok(new List<object>());

        var pools = await _context.TalentPools
            .Include(t => t.Candidate)
            .ThenInclude(c => c.User)
            .Where(t => t.RecruiterId == recruiter.Id)
            .OrderByDescending(t => t.AddedDate)
            .ToListAsync();
        return Ok(pools);
    }

    public class AddTalentPoolDto
    {
        public Guid RecruiterId { get; set; }
        public Guid CandidateId { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> AddToPool([FromBody] AddTalentPoolDto dto)
    {
        var recruiter = await _context.Recruiters.FirstOrDefaultAsync(r => r.UserId == dto.RecruiterId);
        if (recruiter == null) return BadRequest("Recruiter not found");

        // Check if already exists
        var existing = await _context.TalentPools
            .FirstOrDefaultAsync(t => t.RecruiterId == recruiter.Id && t.CandidateId == dto.CandidateId);
            
        if (existing != null)
        {
            return Ok(existing);
        }

        var pool = new TalentPool
        {
            Id = Guid.NewGuid(),
            RecruiterId = recruiter.Id,
            CandidateId = dto.CandidateId,
            Status = dto.Status,
            Notes = dto.Notes,
            AddedDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _context.TalentPools.Add(pool);
        await _context.SaveChangesAsync();
        
        var fullPool = await _context.TalentPools
            .Include(t => t.Candidate)
            .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(t => t.Id == pool.Id);

        return Ok(fullPool);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromPool(Guid id)
    {
        var pool = await _context.TalentPools.FindAsync(id);
        if (pool == null) return NotFound();

        _context.TalentPools.Remove(pool);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
