using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MessageRepository
    : GenericRepository<Message>, IMessageRepository
{


   public MessageRepository(RecruitmentDbContext context)
    : base(context)
{
}

    public async Task<IEnumerable<Message>> GetConversationAsync(
        Guid senderId,
        Guid receiverId)
    {
        return await _context.Messages
            .Where(x =>
                (x.SenderId == senderId && x.ReceiverId == receiverId) ||
                (x.SenderId == receiverId && x.ReceiverId == senderId))
            .OrderBy(x => x.SentAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Message>> GetAllConversationsAsync(Guid userId)
    {
        return await _context.Messages
            .Where(x => x.SenderId == userId || x.ReceiverId == userId)
            .OrderByDescending(x => x.SentAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        return await _context.Messages
            .CountAsync(x =>
                x.ReceiverId == userId &&
                !x.IsRead);
    }

    public async Task MarkAsReadAsync(Guid messageId)
    {
        var message = await _context.Messages.FindAsync(messageId);

        if (message != null)
        {
            message.IsRead = true;

            _context.Messages.Update(message);

            await _context.SaveChangesAsync();
        }
    }
}
