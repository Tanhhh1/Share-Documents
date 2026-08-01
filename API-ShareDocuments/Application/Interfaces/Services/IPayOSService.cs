namespace Application.Interfaces.Services
{
    public class PayOSCreatePaymentRequest
    {
        public long OrderCode { get; set; }
        public long Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
    }

    public class PayOSCreatePaymentResult
    {
        public long OrderCode { get; set; }
        public string PaymentLinkId { get; set; } = string.Empty;
        public string CheckoutUrl { get; set; } = string.Empty;
        public string QrCode { get; set; } = string.Empty;
    }

    public class PayOSWebhookResult
    {
        public bool Success { get; set; }
        public long OrderCode { get; set; }
        public long Amount { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string TransactionDateTime { get; set; } = string.Empty;
        public string PaymentLinkId { get; set; } = string.Empty;
    }

    public interface IPayOSService
    {
        Task<PayOSCreatePaymentResult> CreatePaymentLinkAsync(PayOSCreatePaymentRequest request, CancellationToken cancellationToken = default);
        Task CancelPaymentLinkAsync(long orderCode, CancellationToken cancellationToken = default);
        Task<PayOSWebhookResult> VerifyWebhookAsync(string rawWebhookBody);
    }
}
