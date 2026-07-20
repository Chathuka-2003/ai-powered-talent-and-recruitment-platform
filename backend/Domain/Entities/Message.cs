namespace Domain.Entities;

public class Message : BaseEntity
{
    public Guid SenderId { get; set; }

    public Guid ReceiverId { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime SentAt { get; set; }

    public bool IsRead { get; set; }

    public string? AttachmentPath { get; set; }
}