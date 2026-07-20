using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class CalendarToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        /// <summary>"google" or "microsoft"</summary>
        [Required]
        [MaxLength(32)]
        public string Provider { get; set; } = string.Empty;

        [Required]
        public string AccessToken { get; set; } = string.Empty;

        public string? RefreshToken { get; set; }

        public DateTime? ExpiresAt { get; set; }

        /// <summary>Email associated with the connected calendar account</summary>
        public string? CalendarEmail { get; set; }

        public bool AutoSync { get; set; } = true;

        /// <summary>Reminder minutes before event (15, 30, 60)</summary>
        public int ReminderMinutes { get; set; } = 30;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
