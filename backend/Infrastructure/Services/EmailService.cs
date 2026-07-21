using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Options;
using Infrastructure.Configuration;

namespace Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        if (string.IsNullOrEmpty(_settings.SendGridApiKey) || _settings.SendGridApiKey == "SG.mock_sendgrid_key")
        {
            Console.WriteLine($"[Mock EmailService] Sending email to: {to}");
            Console.WriteLine($"[Mock EmailService] Subject: {subject}");
            Console.WriteLine($"[Mock EmailService] Body: {body}");
            return;
        }

        var client = new SendGridClient(_settings.SendGridApiKey);
        var from = new EmailAddress(_settings.FromEmail, _settings.FromName);
        var toAddress = new EmailAddress(to);
        var plainTextContent = body;
        var htmlContent = $"<p>{body.Replace("\n", "<br>")}</p>";
        var msg = MailHelper.CreateSingleEmail(from, toAddress, subject, plainTextContent, htmlContent);
        
        var response = await client.SendEmailAsync(msg);
        
        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine($"[EmailService Error] Failed to send email via SendGrid: {response.StatusCode}");
        }
    }
}
