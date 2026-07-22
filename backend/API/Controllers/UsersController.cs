// ==============================================
// UsersController
// Handles user profile, contacts, account settings,
// password management, role updates and user status.
// ==============================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using API.DTOs;
using API.Helpers;

using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    // Database context
    private readonly RecruitmentDbContext _context;

    public UsersController(RecruitmentDbContext context)
    {
        _context = context;
    }

    // ----------------------------------------------------
    // GET: api/users/contacts/{userId}
    // Returns the list of users that the current user
    // is allowed to communicate with.
    // ----------------------------------------------------
    [HttpGet("contacts/{userId}")]
    public async Task<IActionResult> GetContacts(Guid userId)
    {
        // Find current user
        var currentUser = await _context.Users.FindAsync(userId);

        if (currentUser == null)
            return NotFound(new { message = "User not found" });

        // Determine which roles are visible based on
        // the current user's role.
        var targetRoles = new List<Domain.Enums.UserRole>();

        if (currentUser.Role == Domain.Enums.UserRole.Candidate)
        {
            targetRoles.Add(Domain.Enums.UserRole.Recruiter);
            targetRoles.Add(Domain.Enums.UserRole.HiringManager);
        }
        else if (currentUser.Role == Domain.Enums.UserRole.Recruiter ||
                 currentUser.Role == Domain.Enums.UserRole.HiringManager)
        {
            targetRoles.Add(Domain.Enums.UserRole.Candidate);
            targetRoles.Add(Domain.Enums.UserRole.Recruiter);
            targetRoles.Add(Domain.Enums.UserRole.HiringManager);
        }
        else
        {
            // Admin or other roles can view everyone
            targetRoles.Add(Domain.Enums.UserRole.Candidate);
            targetRoles.Add(Domain.Enums.UserRole.Recruiter);
            targetRoles.Add(Domain.Enums.UserRole.HiringManager);
        }

        // Retrieve matching users while excluding
        // the current logged-in user.
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

    // ----------------------------------------------------
    // PUT: api/users/{id}/settings
    // Updates the user's profile information.
    // ----------------------------------------------------
    [HttpPut("{id}/settings")]
    public async Task<IActionResult> UpdateSettings(Guid id, [FromBody] UpdateSettingsDto request)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        // Prevent duplicate email addresses.
        if (user.Email != request.Email)
        {
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == request.Email && u.Id != id);

            if (emailExists)
                return BadRequest(new
                {
                    message = "Email is already in use by another account"
                });
        }

        // Update profile information.
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

    // ----------------------------------------------------
    // PUT: api/users/{id}/password
    // Changes the user's password after verifying
    // the current password.
    // ----------------------------------------------------
    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDto request)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        // Verify existing password.
        if (!PasswordHasher.VerifyPassword(request.OldPassword, user.PasswordHash))
            return BadRequest(new
            {
                message = "Incorrect current password"
            });

        // Store the new hashed password.
        user.PasswordHash = PasswordHasher.HashPassword(request.NewPassword);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Password updated successfully"
        });
    }

    // ----------------------------------------------------
    // GET: api/users/{id}
    // Returns a single user's profile information.
    // ----------------------------------------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.Organization)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            Organization = user.Organization == null
                ? null
                : new { user.Organization.Name }
        });
    }

    // ----------------------------------------------------
    // GET: api/users
    // Returns all registered users.
    // ----------------------------------------------------
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
                Organization = u.Organization == null
                    ? null
                    : new { u.Organization.Name }
            })
            .ToListAsync();

        return Ok(users);
    }

    // ----------------------------------------------------
    // PUT: api/users/{id}/role
    // Updates the user's role.
    // ----------------------------------------------------
    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] Domain.Enums.UserRole role)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        user.Role = role;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User role updated successfully"
        });
    }

    // ----------------------------------------------------
    // PUT: api/users/{id}/status
    // Activates or deactivates a user account.
    // ----------------------------------------------------
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] bool isActive)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        user.IsActive = isActive;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User status updated successfully"
        });
    }

    // ----------------------------------------------------
    // DELETE: api/users/{id}
    // Soft deletes a user by marking them inactive.
    // ----------------------------------------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        // Soft delete
        user.IsActive = false;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User deactivated successfully"
        });
    }
}
