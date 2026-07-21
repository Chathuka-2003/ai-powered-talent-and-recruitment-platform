using Domain.Entities;

namespace Domain.Interfaces;

public interface INotificationRepository : IGenericRepository<Notification>
{
    Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId);

    Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(Guid userId);

    Task MarkAsReadAsync(Guid notificationId);

    Task MarkAllAsReadAsync(Guid userId);

    Task<int> GetUnreadCountAsync(Guid userId);
}
