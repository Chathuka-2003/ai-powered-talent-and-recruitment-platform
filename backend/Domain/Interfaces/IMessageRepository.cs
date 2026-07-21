using Domain.Entities;

namespace Domain.Interfaces;

public interface IMessageRepository : IGenericRepository<Message>
{
    Task<IEnumerable<Message>> GetConversationAsync(
        Guid senderId,
        Guid receiverId);

    Task<IEnumerable<Message>> GetAllConversationsAsync(Guid userId);

    Task<int> GetUnreadCountAsync(Guid userId);

    Task MarkAsReadAsync(Guid messageId);
}
