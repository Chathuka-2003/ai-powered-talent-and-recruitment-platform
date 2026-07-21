namespace Infrastructure.Configuration;

public class EmailSettings
{
    public string SendGridApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
}

public class SmsSettings
{
    public string TwilioAccountSid { get; set; } = string.Empty;
    public string TwilioAuthToken { get; set; } = string.Empty;
    public string FromPhoneNumber { get; set; } = string.Empty;
}
