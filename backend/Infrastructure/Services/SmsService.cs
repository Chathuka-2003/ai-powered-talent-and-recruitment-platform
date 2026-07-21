using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using Microsoft.Extensions.Options;
using Infrastructure.Configuration;

namespace Infrastructure.Services;

public class SmsService : ISmsService
{
    private readonly SmsSettings _settings;
    private bool _isTwilioInitialized = false;

    public SmsService(IOptions<SmsSettings> settings)
    {
        _settings = settings.Value;
        
        if (!string.IsNullOrEmpty(_settings.TwilioAccountSid) && _settings.TwilioAccountSid != "AC_mock_twilio_sid" &&
            !string.IsNullOrEmpty(_settings.TwilioAuthToken) && _settings.TwilioAuthToken != "mock_twilio_token")
        {
            TwilioClient.Init(_settings.TwilioAccountSid, _settings.TwilioAuthToken);
            _isTwilioInitialized = true;
        }
    }

    public async Task SendSmsAsync(string to, string message)
    {
        if (string.IsNullOrEmpty(to)) return;

        if (!_isTwilioInitialized)
        {
            Console.WriteLine($"[Mock SmsService] Sending SMS to: {to}");
            Console.WriteLine($"[Mock SmsService] Message: {message}");
            return;
        }

        try
        {
            var msg = await MessageResource.CreateAsync(
                body: message,
                from: new PhoneNumber(_settings.FromPhoneNumber),
                to: new PhoneNumber(to)
            );

            if (msg.ErrorCode.HasValue)
            {
                Console.WriteLine($"[SmsService Error] Twilio Error Code {msg.ErrorCode}: {msg.ErrorMessage}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SmsService Error] Failed to send SMS via Twilio: {ex.Message}");
        }
    }
}
