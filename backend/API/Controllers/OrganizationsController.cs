using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public OrganizationsController(RecruitmentDbContext context)
    {
        _context = context;
    }

    [HttpGet("by-user/{userId}")]
    public async Task<IActionResult> GetOrganizationByUser(Guid userId)
    {
        // Find the recruiter and their organization
        var recruiter = await _context.Recruiters
            .Include(r => r.Organization)
            .ThenInclude(o => o.Recruiters)
                .ThenInclude(r2 => r2.User)
            .Include(r => r.Organization)
            .ThenInclude(o => o.HiringManagers)
                .ThenInclude(h => h.User)
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (recruiter == null || recruiter.Organization == null)
            return NotFound(new { message = "Organization not found for this user." });

        var org = recruiter.Organization;

        return Ok(new
        {
            Id = org.Id,
            Name = org.Name,
            Description = org.Description,
            Website = org.Website,
            Address = org.Address,
            Recruiters = org.Recruiters.Select(r => new
            {
                Id = r.Id,
                UserId = r.UserId,
                FirstName = r.User?.FirstName,
                LastName = r.User?.LastName,
                Email = r.User?.Email,
                JobTitle = r.JobTitle,
                Department = r.Department,
                Role = r.User?.Role
            }).ToList(),
            HiringManagers = org.HiringManagers.Select(h => new
            {
                Id = h.Id,
                UserId = h.UserId,
                FirstName = h.User?.FirstName,
                LastName = h.User?.LastName,
                Email = h.User?.Email,
                Designation = h.Designation,
                Department = h.Department,
                PhoneNumber = h.PhoneNumber,
                Role = h.User?.Role
            }).ToList()
        });
    }

    public class UpdateOrganizationDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? Address { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrganization([FromBody] UpdateOrganizationDto dto)
    {
        var org = new Organization
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            Website = dto.Website,
            Address = dto.Address,
            CreatedAt = DateTime.UtcNow
        };

        _context.Organizations.Add(org);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrganizationById), new { orgId = org.Id }, org);
    }

    [HttpPut("{orgId}")]
    public async Task<IActionResult> UpdateOrganization(Guid orgId, [FromBody] UpdateOrganizationDto dto)
    {
        var org = await _context.Organizations.FindAsync(orgId);
        if (org == null) return NotFound(new { message = "Organization not found." });

        org.Name = dto.Name;
        org.Description = dto.Description;
        org.Website = dto.Website;
        org.Address = dto.Address;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Organization updated successfully." });
    }

    public class AddRecruiterDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    [HttpPost("{orgId}/recruiters")]
    public async Task<IActionResult> AddRecruiter(Guid orgId, [FromBody] AddRecruiterDto dto)
    {
        var org = await _context.Organizations.FindAsync(orgId);
        if (org == null) return NotFound(new { message = "Organization not found." });

        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Email already in use." });
        }

        // Generate a random default password hash for simplicity in this prototype
        string passwordHash = API.Helpers.PasswordHasher.HashPassword("DefaultPassword123!");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = Domain.Enums.UserRole.Recruiter,
            IsActive = true,
            OrganizationId = orgId,
            CreatedAt = DateTime.UtcNow
        };

        var recruiter = new Recruiter
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            OrganizationId = orgId,
            JobTitle = dto.JobTitle,
            Department = dto.Department,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        _context.Recruiters.Add(recruiter);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            Id = recruiter.Id,
            UserId = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            JobTitle = recruiter.JobTitle,
            Department = recruiter.Department,
            Role = user.Role
        });
    }

    [HttpDelete("{orgId}/recruiters/{recruiterId}")]
    public async Task<IActionResult> RemoveRecruiter(Guid orgId, Guid recruiterId)
    {
        var recruiter = await _context.Recruiters
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == recruiterId && r.OrganizationId == orgId);

        if (recruiter == null) return NotFound(new { message = "Recruiter not found." });

        _context.Recruiters.Remove(recruiter);
        if (recruiter.User != null)
        {
            _context.Users.Remove(recruiter.User); // also remove the user account
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Recruiter removed successfully." });
    }

    public class AddHiringManagerDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [HttpPost("{orgId}/hiring-managers")]
    public async Task<IActionResult> AddHiringManager(Guid orgId, [FromBody] AddHiringManagerDto dto)
    {
        var org = await _context.Organizations.FindAsync(orgId);
        if (org == null) return NotFound(new { message = "Organization not found." });

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Email already in use." });
        }

        string passwordToHash = string.IsNullOrWhiteSpace(dto.Password) ? "DefaultPassword123!" : dto.Password;
        string passwordHash = API.Helpers.PasswordHasher.HashPassword(passwordToHash);

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = Domain.Enums.UserRole.HiringManager,
            IsActive = true,
            OrganizationId = orgId,
            CreatedAt = DateTime.UtcNow
        };

        var manager = new HiringManager
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            OrganizationId = orgId,
            Designation = dto.Designation,
            Department = dto.Department,
            PhoneNumber = dto.PhoneNumber,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        _context.HiringManagers.Add(manager);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            Id = manager.Id,
            UserId = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Designation = manager.Designation,
            Department = manager.Department,
            PhoneNumber = manager.PhoneNumber,
            Role = user.Role
        });
    }

    [HttpDelete("{orgId}/hiring-managers/{managerId}")]
    public async Task<IActionResult> RemoveHiringManager(Guid orgId, Guid managerId)
    {
        var manager = await _context.HiringManagers
            .Include(m => m.User)
            .FirstOrDefaultAsync(m => m.Id == managerId && m.OrganizationId == orgId);

        if (manager == null) return NotFound(new { message = "Hiring Manager not found." });

        _context.HiringManagers.Remove(manager);
        if (manager.User != null)
        {
            _context.Users.Remove(manager.User);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Hiring Manager removed successfully." });
    }
    [HttpGet("{orgId}")]
    public async Task<IActionResult> GetOrganizationById(Guid orgId)
    {
        var org = await _context.Organizations
            .Include(o => o.Recruiters).ThenInclude(r => r.User)
            .Include(o => o.HiringManagers).ThenInclude(h => h.User)
            .Include(o => o.Jobs)
            .FirstOrDefaultAsync(o => o.Id == orgId);

        if (org == null) return NotFound(new { message = "Organization not found." });

        return Ok(new
        {
            org.Id,
            org.Name,
            org.Description,
            org.Website,
            org.Address,
            Recruiters = org.Recruiters.Select(r => new { r.Id, r.User?.FirstName, r.User?.LastName, r.User?.Email }),
            HiringManagers = org.HiringManagers.Select(h => new { h.Id, h.User?.FirstName, h.User?.LastName, h.User?.Email }),
            Jobs = org.Jobs.Select(j => new { j.Id, j.Title, j.Status, j.CreatedAt }),
            org.CreatedAt
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrganizations()
    {
        var organizations = await _context.Organizations
            .Select(o => new
            {
                o.Id,
                o.Name,
                o.Description,
                o.Website,
                o.Address,
                UserCount = o.Recruiters.Count + o.HiringManagers.Count,
                JobCount = o.Jobs.Count,
                o.CreatedAt
            })
            .ToListAsync();

        return Ok(organizations);
    }
}
