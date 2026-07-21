using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

/// <summary>
/// Repository responsible for handling database operations
/// related to User entities.
/// </summary>
public class UserRepository : GenericRepository<User>, IUserRepository
{
    /// <summary>
    /// Initializes the UserRepository with the application's database context.
    /// </summary>
    /// <param name="context">Database context instance.</param>
    public UserRepository(RecruitmentDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Retrieves a user by their email address.
    /// </summary>
    /// <param name="email">The user's email address.</param>
    /// <returns>The matching user if found; otherwise null.</returns>
    public async Task<User?> GetByEmailAsync(string email)
    {
        // Search the Users table for a matching email address.
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    /// <summary>
    /// Retrieves all users assigned to a specific role.
    /// </summary>
    /// <param name="role">The user role to filter by.</param>
    /// <returns>A collection of users with the specified role.</returns>
    public async Task<IEnumerable<User>> GetByRoleAsync(UserRole role)
    {
        // Filter users based on their assigned role.
        return await _context.Users
            .Where(x => x.Role == role)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves every user stored in the database.
    /// </summary>
    /// <returns>A collection containing all users.</returns>
    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        // Return the complete list of users.
        return await _context.Users.ToListAsync();
    }

    /// <summary>
    /// Checks whether a user with the specified email already exists.
    /// </summary>
    /// <param name="email">Email address to verify.</param>
    /// <returns>True if the email exists; otherwise false.</returns>
    public async Task<bool> IsEmailExistsAsync(string email)
    {
        // Determine if any user record matches the given email.
        return await _context.Users
            .AnyAsync(x => x.Email == email);
    }
}