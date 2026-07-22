using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly RecruitmentDbContext _context;
    private readonly IEmailService _emailService;

    public MessagesController(RecruitmentDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetConversations(Guid userId)
    {
        // Get all unique users the current user has messaged or received messages from
        var userIds = await _context.Messages
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .Select(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Distinct()
            .ToListAsync();

        var users = await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Role
            })
            .ToListAsync();

        // For each user, get the last message and unread count
        var conversations = new List<object>();
        foreach (var peer in users)
        {
            var lastMessage = await _context.Messages
                .Where(m => (m.SenderId == userId && m.ReceiverId == peer.Id) || (m.SenderId == peer.Id && m.ReceiverId == userId))
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefaultAsync();

            var unreadCount = await _context.Messages
                .CountAsync(m => m.SenderId == peer.Id && m.ReceiverId == userId && !m.IsRead);

            if (lastMessage != null)
            {
                conversations.Add(new
                {
                    Peer = peer,
                    LastMessage = lastMessage.Content,
                    LastMessageTime = lastMessage.SentAt,
                    UnreadCount = unreadCount
                });
            }
        }

        return Ok(conversations.OrderByDescending(c => (DateTime)((dynamic)c).LastMessageTime));
    }

    [HttpGet("conversation/{userId}/{peerId}")]
    public async Task<IActionResult> GetConversation(Guid userId, Guid peerId)
    {
        var messages = await _context.Messages
            .Where(m => (m.SenderId == userId && m.ReceiverId == peerId) || (m.SenderId == peerId && m.ReceiverId == userId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest req)
    {
        var message = new Message
        {
            SenderId = req.SenderId,
            ReceiverId = req.ReceiverId,
            Content = req.Content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Send email notification to receiver
        var receiver = await _context.Users.FindAsync(req.ReceiverId);
        var sender = await _context.Users.FindAsync(req.SenderId);
        if (receiver != null && sender != null)
        {
            await _emailService.SendEmailAsync(
                receiver.Email,
                $"New message from {sender.FirstName} {sender.LastName}",
                $"You have received a new message on TalentAI from {sender.FirstName} {sender.LastName}:\n\n\"{req.Content}\"\n\nLog in to reply."
            );
        }

        return Ok(message);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message == null) return NotFound();

        message.IsRead = true;
        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class SendMessageRequest
{
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
}
