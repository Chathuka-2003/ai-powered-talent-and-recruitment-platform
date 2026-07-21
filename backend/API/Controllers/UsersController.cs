using API.Helpers;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly RecruitmentDbContext _context;

    public UsersController(RecruitmentDbContext context)
    {
        _context = context;
    }

    [HttpGet("contacts/{userId}")]
    public async Task<IActionResult> GetContacts(Guid userId)
    {
        var currentUser = await _context.Users.FindAsync(userId);
        if (currentUser == null) return NotFound(new { message = "User not found" });

        var targetRoles = new List<Domain.Enums.UserRole>();
        if (currentUser.Role == Domain.Enums.UserRole.Candidate)
        {
            targetRoles.Add(Domain.Enums.UserRole.Recruiter);
            targetRoles.Add(Domain.Enums.UserRole.HiringManager);
        }
        else if (currentUser.Role == Domain.Enums.UserRole.Recruiter || currentUser.Role == Domain.Enums.UserRole.HiringManager)
        {
            targetRoles.Add(Domain.Enums.UserRole.Candidate);
            targetRoles.Add(Domain.Enums.UserRole.Recruiter); // Let recruiters talk to each other too
            targetRoles.Add(Domain.Enums.UserRole.HiringManager);
        }
        else
        {
            targetRoles.Add(Domain.Enums.UserRole.Candidate);
            targetRoles.Add(Domain.Enums.UserRole.Recruiter);
            targetRoles.Add(Domain.Enums.UserRole.HiringManager);
        }

        var contacts = await _context.Users
            .Where(u => targetRoles.Contains(u.Role) && u.Id != userId)
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                Role = u.Role
            })
            .ToListAsync();

        return Ok(contacts);
    }

    [HttpPut("{id}/settings")]
    public async Task<IActionResult> UpdateSettings(Guid id, [FromBody] UpdateSettingsDto request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        // Optional: Check if the new email is already taken by another user
        if (user.Email != request.Email)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id);
            if (emailExists)
                return BadRequest(new { message = "Email is already in use by another account" });
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Settings updated successfully",
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Role
            }
        });
    }

    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDto request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (!PasswordHasher.VerifyPassword(request.OldPassword, user.PasswordHash))
            return BadRequest(new { message = "Incorrect current password" });

        user.PasswordHash = PasswordHasher.HashPassword(request.NewPassword);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.Organization)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound(new { message = "User not found" });

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            Organization = user.Organization == null ? null : new { user.Organization.Name }
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Role,
                u.IsActive,
                u.CreatedAt,
                OrganizationId = u.OrganizationId,
                Organization = u.Organization == null ? null : new { u.Organization.Name }
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] Domain.Enums.UserRole role)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found" });

        user.Role = role;
        await _context.SaveChangesAsync();
        return Ok(new { message = "User role updated successfully" });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] bool isActive)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found" });

        user.IsActive = isActive;
        await _context.SaveChangesAsync();
        return Ok(new { message = "User status updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found" });

        user.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();
        return Ok(new { message = "User deactivated successfully" });
    }
}

public class UpdateSettingsDto
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ChangePasswordDto
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    public string NewPassword { get; set; } = string.Empty;
}
