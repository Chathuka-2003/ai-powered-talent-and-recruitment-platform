using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Services;

using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly RecruitmentDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public NotificationsController(RecruitmentDbContext context, IEmailService emailService, ISmsService smsService)
    {
        _context = context;
        _emailService = emailService;
        _smsService = smsService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest req)
    {
        var notification = new Notification
        {
            UserId = req.UserId,
            Title = req.Title,
            MessageText = req.MessageText,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // Fetch user to get Email and PhoneNumber
        var user = await _context.Users.FindAsync(req.UserId);
        if (user != null)
        {
            if (!string.IsNullOrEmpty(user.Email))
            {
                await _emailService.SendEmailAsync(user.Email, req.Title, req.MessageText);
            }

            if (!string.IsNullOrEmpty(user.PhoneNumber))
            {
                await _smsService.SendSmsAsync(user.PhoneNumber, $"{req.Title}: {req.MessageText}");
            }
        }

        return Ok(notification);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return NotFound();

        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("read-all/{userId}")]
    public async Task<IActionResult> MarkAllAsRead(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in notifications)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class CreateNotificationRequest
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
}
