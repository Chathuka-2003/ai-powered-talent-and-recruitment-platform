using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);

    Task<IEnumerable<User>> GetByRoleAsync(UserRole role);

    Task<IEnumerable<User>> GetAllUsersAsync();

    Task<bool> IsEmailExistsAsync(string email);
}
