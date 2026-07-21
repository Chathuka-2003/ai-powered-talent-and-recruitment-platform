using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Kiota.Abstractions.Authentication;

namespace API.Services;

public class CalendarSyncService
{
    private readonly RecruitmentDbContext _context;

    public CalendarSyncService(RecruitmentDbContext context)
    {
        _context = context;
    }

    public async Task<List<object>> SyncInterviewAsync(Guid interviewId, Guid userId, bool autoSyncOnly = false)
    {
        var interview = await _context.Interviews
            .Include(i => i.Candidate).ThenInclude(c => c.User)
            .Include(i => i.Application).ThenInclude(a => a.Job)
            .FirstOrDefaultAsync(i => i.Id == interviewId);

        if (interview == null) throw new Exception("Interview not found.");

        var query = _context.CalendarTokens.Where(t => t.UserId == userId);
        if (autoSyncOnly)
        {
            query = query.Where(t => t.AutoSync == true);
        }

        var tokens = await query.ToListAsync();

        var results = new List<object>();

        foreach (var token in tokens)
        {
            try
            {
                var start = interview.InterviewDate.Date.Add(interview.InterviewTime);
                var end = start.AddHours(1);
                var title = $"Interview: {interview.Candidate?.User?.FirstName} {interview.Candidate?.User?.LastName} – {interview.Application?.Job?.Title}";
                var description = $"Interview Type: {interview.Type}\nStatus: {interview.Status}";

                if (token.Provider == "google")
                {
                    await CreateGoogleCalendarEvent(token.AccessToken, title, description, start, end, interview.MeetingLink);
                    results.Add(new { provider = "google", success = true });
                }
                else if (token.Provider == "microsoft")
                {
                    await CreateMicrosoftCalendarEvent(token.AccessToken, title, description, start, end, interview.MeetingLink);
                    results.Add(new { provider = "microsoft", success = true });
                }
            }
            catch (Exception ex)
            {
                results.Add(new { provider = token.Provider, success = false, error = ex.Message });
            }
        }

        return results;
    }

    private async Task CreateGoogleCalendarEvent(string accessToken, string title, string description, DateTime start, DateTime end, string? meetingLink)
    {
        var credential = GoogleCredential.FromAccessToken(accessToken);
        var service = new CalendarService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = credential,
            ApplicationName = "Talent Platform"
        });

        var newEvent = new Google.Apis.Calendar.v3.Data.Event()
        {
            Summary = title,
            Description = description,
            Start = new EventDateTime() { DateTimeDateTimeOffset = start, TimeZone = "UTC" },
            End = new EventDateTime() { DateTimeDateTimeOffset = end, TimeZone = "UTC" }
        };

        if (!string.IsNullOrEmpty(meetingLink))
        {
            newEvent.Location = meetingLink;
        }

        var request = service.Events.Insert(newEvent, "primary");
        await request.ExecuteAsync();
    }

    private async Task CreateMicrosoftCalendarEvent(string accessToken, string title, string description, DateTime start, DateTime end, string? meetingLink)
    {
        var authProvider = new BaseBearerTokenAuthenticationProvider(new TokenProvider(accessToken));
        var graphClient = new GraphServiceClient(authProvider);

        var requestBody = new Microsoft.Graph.Models.Event
        {
            Subject = title,
            Body = new ItemBody { ContentType = BodyType.Text, Content = description },
            Start = new DateTimeTimeZone { DateTime = start.ToString("yyyy-MM-ddTHH:mm:ss"), TimeZone = "UTC" },
            End = new DateTimeTimeZone { DateTime = end.ToString("yyyy-MM-ddTHH:mm:ss"), TimeZone = "UTC" },
        };

        if (!string.IsNullOrEmpty(meetingLink))
        {
            requestBody.Location = new Location { DisplayName = meetingLink };
        }

        await graphClient.Me.Events.PostAsync(requestBody);
    }
}

public class TokenProvider : IAccessTokenProvider
{
    private readonly string _token;
    public TokenProvider(string token) { _token = token; }
    
    public Task<string> GetAuthorizationTokenAsync(Uri uri, Dictionary<string, object>? additionalAuthenticationContext = null, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_token);
    }
    
    public AllowedHostsValidator AllowedHostsValidator { get; } = new AllowedHostsValidator();
}
