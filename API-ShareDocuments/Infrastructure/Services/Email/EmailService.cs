using Application.Interfaces.Services;
using Infrastructure.Configurations;
using Infrastructure.Services.Email.Templates;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }

        public async Task SendPaymentSuccessEmailAsync(PaymentSuccessEmailModel model, CancellationToken cancellationToken = default)
        {
            var body = PaymentSuccessTemplate.Build(model);
            await SendAsync(model.ToEmail, "Xác nhận thanh toán nâng cấp membership", body, cancellationToken);
        }

        public async Task SendOtpEmailAsync(OtpEmailModel model, CancellationToken cancellationToken = default)
        {
            var body = OTPTemplate.Build(model);
            await SendAsync(model.ToEmail, "Mã OTP đặt lại mật khẩu", body, cancellationToken);
        }

        private async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

            using var client = new SmtpClient();

            await client.ConnectAsync(
                _settings.SmtpServer,
                _settings.Port,
                _settings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto,
                cancellationToken);

            await client.AuthenticateAsync(_settings.SenderEmail, _settings.SenderPassword, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }
    }
}
