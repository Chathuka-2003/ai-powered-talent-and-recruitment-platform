using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Domain.Entities;
using System.Security.Claims;
using System.Web;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarController : ControllerBase
    {
        private readonly RecruitmentDbContext _context;
        private readonly IConfiguration _config;
        private readonly CalendarSyncService _syncService;

        public CalendarController(RecruitmentDbContext context, IConfiguration config, CalendarSyncService syncService)
        {
            _context = context;
            _config = config;
            _syncService = syncService;
        }

        // ─────────────────────────────────────────────────────────────
        // GET /api/calendar/connections?userId={userId}
        // Returns which calendars the user has connected
        // ─────────────────────────────────────────────────────────────
        [HttpGet("connections")]
        public async Task<IActionResult> GetConnections([FromQuery] Guid userId)
        {
            var tokens = await _context.CalendarTokens
                .Where(t => t.UserId == userId)
                .Select(t => new
                {
                    t.Provider,
                    t.CalendarEmail,
                    t.AutoSync,
                    t.ReminderMinutes,
                    IsExpired = t.ExpiresAt.HasValue && t.ExpiresAt < DateTime.UtcNow
                })
                .ToListAsync();

            return Ok(tokens);
        }

        // ─────────────────────────────────────────────────────────────
        // GET /api/calendar/google/auth-url?userId={userId}
        // Returns the Google OAuth URL for authorization
        // ─────────────────────────────────────────────────────────────
        [HttpGet("google/auth-url")]
        public IActionResult GetGoogleAuthUrl([FromQuery] Guid userId)
        {
            var clientId = _config["GoogleCalendar:ClientId"];
            var redirectUri = _config["GoogleCalendar:RedirectUri"] ?? "http://localhost:5173/auth/google/callback";

            if (string.IsNullOrEmpty(clientId))
                return BadRequest(new { error = "Google Calendar is not configured. Add GoogleCalendar:ClientId to appsettings." });

            var scope = HttpUtility.UrlEncode("https://www.googleapis.com/auth/calendar.events");
            var state = HttpUtility.UrlEncode(userId.ToString());
            var url = $"https://accounts.google.com/o/oauth2/v2/auth" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={HttpUtility.UrlEncode(redirectUri)}" +
                      $"&response_type=code" +
                      $"&scope={scope}" +
                      $"&access_type=offline" +
                      $"&prompt=consent" +
                      $"&state={state}";

            return Ok(new { url });
        }

        // ─────────────────────────────────────────────────────────────
        // GET /api/calendar/microsoft/auth-url?userId={userId}
        // Returns the Microsoft OAuth URL for authorization
        // ─────────────────────────────────────────────────────────────
        [HttpGet("microsoft/auth-url")]
        public IActionResult GetMicrosoftAuthUrl([FromQuery] Guid userId)
        {
            var clientId = _config["MicrosoftCalendar:ClientId"];
            var tenantId = _config["MicrosoftCalendar:TenantId"] ?? "common";
            var redirectUri = _config["MicrosoftCalendar:RedirectUri"] ?? "http://localhost:5173/auth/microsoft/callback";

            if (string.IsNullOrEmpty(clientId))
                return BadRequest(new { error = "Microsoft Calendar is not configured. Add MicrosoftCalendar:ClientId to appsettings." });

            var scope = HttpUtility.UrlEncode("Calendars.ReadWrite offline_access");
            var state = HttpUtility.UrlEncode(userId.ToString());
            var url = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={HttpUtility.UrlEncode(redirectUri)}" +
                      $"&response_type=code" +
                      $"&scope={scope}" +
                      $"&state={state}";

            return Ok(new { url });
        }

        // ─────────────────────────────────────────────────────────────
        // POST /api/calendar/google/callback
        // Handles the Google OAuth code exchange and saves the token
        // ─────────────────────────────────────────────────────────────
        [HttpPost("google/callback")]
        public async Task<IActionResult> HandleGoogleCallback([FromBody] OAuthCallbackRequest req)
        {
            var clientId = _config["GoogleCalendar:ClientId"];
            var clientSecret = _config["GoogleCalendar:ClientSecret"];
            var redirectUri = _config["GoogleCalendar:RedirectUri"] ?? "http://localhost:5173/auth/google/callback";

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                return BadRequest(new { error = "Google Calendar is not configured." });

            // Exchange code for tokens
            using var http = new HttpClient();
            var tokenResponse = await http.PostAsync("https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["code"] = req.Code,
                    ["client_id"] = clientId,
                    ["client_secret"] = clientSecret,
                    ["redirect_uri"] = redirectUri,
                    ["grant_type"] = "authorization_code"
                }));

            if (!tokenResponse.IsSuccessStatusCode)
                return BadRequest(new { error = "Failed to exchange code for token." });

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>();
            if (tokenData == null) return BadRequest(new { error = "Invalid token response." });

            // Get user's calendar email
            var userInfoResponse = await http.GetAsync($"https://www.googleapis.com/oauth2/v1/userinfo?access_token={tokenData.access_token}");
            string? calendarEmail = null;
            if (userInfoResponse.IsSuccessStatusCode)
            {
                var userInfo = await userInfoResponse.Content.ReadFromJsonAsync<GoogleUserInfo>();
                calendarEmail = userInfo?.email;
            }

            // Save or update token
            var existing = await _context.CalendarTokens
                .FirstOrDefaultAsync(t => t.UserId == req.UserId && t.Provider == "google");

            if (existing != null)
            {
                existing.AccessToken = tokenData.access_token;
                existing.RefreshToken = tokenData.refresh_token ?? existing.RefreshToken;
                existing.ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in);
                existing.CalendarEmail = calendarEmail;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _context.CalendarTokens.Add(new CalendarToken
                {
                    UserId = req.UserId,
                    Provider = "google",
                    AccessToken = tokenData.access_token,
                    RefreshToken = tokenData.refresh_token,
                    ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in),
                    CalendarEmail = calendarEmail
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, email = calendarEmail });
        }

        // ─────────────────────────────────────────────────────────────
        // POST /api/calendar/microsoft/callback
        // Handles the Microsoft OAuth code exchange and saves the token
        // ─────────────────────────────────────────────────────────────
        [HttpPost("microsoft/callback")]
        public async Task<IActionResult> HandleMicrosoftCallback([FromBody] OAuthCallbackRequest req)
        {
            var clientId = _config["MicrosoftCalendar:ClientId"];
            var clientSecret = _config["MicrosoftCalendar:ClientSecret"];
            var tenantId = _config["MicrosoftCalendar:TenantId"] ?? "common";
            var redirectUri = _config["MicrosoftCalendar:RedirectUri"] ?? "http://localhost:5173/auth/microsoft/callback";

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                return BadRequest(new { error = "Microsoft Calendar is not configured." });

            using var http = new HttpClient();
            var tokenResponse = await http.PostAsync($"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["code"] = req.Code,
                    ["client_id"] = clientId,
                    ["client_secret"] = clientSecret,
                    ["redirect_uri"] = redirectUri,
                    ["grant_type"] = "authorization_code"
                }));

            if (!tokenResponse.IsSuccessStatusCode)
                return BadRequest(new { error = "Failed to exchange code for token." });

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<MicrosoftTokenResponse>();
            if (tokenData == null) return BadRequest(new { error = "Invalid token response." });

            // Get user profile email from Microsoft Graph
            string? calendarEmail = null;
            http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokenData.access_token);
            var profileResponse = await http.GetAsync("https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName");
            if (profileResponse.IsSuccessStatusCode)
            {
                var profile = await profileResponse.Content.ReadFromJsonAsync<MicrosoftUserProfile>();
                calendarEmail = profile?.mail ?? profile?.userPrincipalName;
            }

            var existing = await _context.CalendarTokens
                .FirstOrDefaultAsync(t => t.UserId == req.UserId && t.Provider == "microsoft");

            if (existing != null)
            {
                existing.AccessToken = tokenData.access_token;
                existing.RefreshToken = tokenData.refresh_token ?? existing.RefreshToken;
                existing.ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in);
                existing.CalendarEmail = calendarEmail;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _context.CalendarTokens.Add(new CalendarToken
                {
                    UserId = req.UserId,
                    Provider = "microsoft",
                    AccessToken = tokenData.access_token,
                    RefreshToken = tokenData.refresh_token,
                    ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.expires_in),
                    CalendarEmail = calendarEmail
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, email = calendarEmail });
        }

        // ─────────────────────────────────────────────────────────────
        // PUT /api/calendar/preferences
        // Update auto-sync and reminder preferences
        // ─────────────────────────────────────────────────────────────
        [HttpPut("preferences")]
        public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesRequest req)
        {
            var tokens = await _context.CalendarTokens
                .Where(t => t.UserId == req.UserId)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.AutoSync = req.AutoSync;
                token.ReminderMinutes = req.ReminderMinutes;
                token.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // ─────────────────────────────────────────────────────────────
        // DELETE /api/calendar/{provider}?userId={userId}
        // Disconnects a calendar provider
        // ─────────────────────────────────────────────────────────────
        [HttpDelete("{provider}")]
        public async Task<IActionResult> Disconnect(string provider, [FromQuery] Guid userId)
        {
            var token = await _context.CalendarTokens
                .FirstOrDefaultAsync(t => t.UserId == userId && t.Provider == provider);

            if (token == null) return NotFound();

            _context.CalendarTokens.Remove(token);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // ─────────────────────────────────────────────────────────────
        // POST /api/calendar/sync/{interviewId}?userId={userId}
        // Syncs an interview to all connected calendars for this user
        // ─────────────────────────────────────────────────────────────
        [HttpPost("sync/{interviewId}")]
        public async Task<IActionResult> SyncInterview(Guid interviewId, [FromQuery] Guid userId)
        {
            try
            {
                var results = await _syncService.SyncInterviewAsync(interviewId, userId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Interview not found.") return NotFound();
                return BadRequest(new { error = ex.Message });
            }
        }

        // ─── Request / Response DTOs ───────────────────────────────────

        public record OAuthCallbackRequest(Guid UserId, string Code);
        public record UpdatePreferencesRequest(Guid UserId, bool AutoSync, int ReminderMinutes);

        private class GoogleTokenResponse
        {
            public string access_token { get; set; } = "";
            public string? refresh_token { get; set; }
            public int expires_in { get; set; }
        }

        private class GoogleUserInfo
        {
            public string? email { get; set; }
        }

        private class MicrosoftTokenResponse
        {
            public string access_token { get; set; } = "";
            public string? refresh_token { get; set; }
            public int expires_in { get; set; }
        }

        private class MicrosoftUserProfile
        {
            public string? mail { get; set; }
            public string? userPrincipalName { get; set; }
        }
    }
}
