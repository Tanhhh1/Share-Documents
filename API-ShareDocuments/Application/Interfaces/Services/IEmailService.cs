namespace Application.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendPaymentSuccessEmailAsync(PaymentSuccessEmailModel model, CancellationToken cancellationToken = default);
        Task SendOtpEmailAsync(OtpEmailModel model, CancellationToken cancellationToken = default);
    }

    public class PaymentSuccessEmailModel
    {
        public string ToEmail { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public long OrderCode { get; set; }
    }

    public class OtpEmailModel
    {
        public string ToEmail { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
